let amqp = require('amqplib/callback_api'),
    config = require('config'),
    csvProcessor = require('./csv_reader_redis'),
    excelProcessor = require('./excell_reader_redis'),
    operationLog = require('./operation_log'),
    token_tools = require('../proxy/tokenTools'),
    amqpConn = null,
    sync_module_tools = require('./sync_module_tools'),
    pimsConfig = config.get('config');

function get_userr(req) {
    let token = token_tools.getToken(req.headers),
        user = token_tools.verifyToken(token);
    return user.name;
}


function addUserLogin(msg, user_login) {
    var message = msg;
    if(message.hasOwnProperty('CustomOperation')) {
        message.CustomOperation.userLogin = user_login;
    }
    return JSON.stringify(message);
}


function notify(req, res, queue_name) {
    let ex = pimsConfig.rabbitMq.pimsExchange,
        user_login = get_userr(req);
    let message = addUserLogin(req.body.message,user_login);
    operationLog.individualTaskStart(message, user_login);
    amqp.connect(`amqp://${pimsConfig.rabbitMq.url}`, function (err, conn) {
        conn.createChannel(function (err, ch) {
            if (err) {
                console.log(err)
            }
            ch.publish(ex, queue_name, new Buffer(message));
            ch.close();
            conn.close();
            console.log(" [x] Sent %s", message);
            res.json({success: true})
        });
    });
}

function sendMessage(message, custom_operation, user_login) {
    let ex = pimsConfig.rabbitMq.pimsExchange,
        queue_name = custom_operation.customAttributes.queuePrefix;

    message = addUserLogin(message,user_login);
    //operationLog.individualTaskStart(message, user_login);
    amqp.connect(`amqp://${pimsConfig.rabbitMq.url}`, function (err, conn) {
        conn.createChannel(function (err, ch) {
            if (err) {
                console.log(err)
            }
            ch.publish(ex, queue_name, new Buffer(message));
            console.log(" [x] Sent %s", message);
            ch.close();
            conn.close();
        });
    });
}


function startConnenction(websocket_io) {

    amqp.connect(`amqp://${pimsConfig.rabbitMq.url}`, function (err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(startConnenction, 1000);
        }
        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(startConnenction, 1000);
        });
        console.log("[AMQP] connected");
        amqpConn = conn;
        startListener(websocket_io);
        startFileReaderQueueListener();
    });
}

function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
}

function startListener(websocket_io) {
    amqpConn.createChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });

        ch.prefetch(10);
        ch.assertQueue(pimsConfig.rabbitMq.individualTopologyResultQueue, {durable: false}, function (err, _ok) {
            if (closeOnErr(err)) return;
            ch.consume(pimsConfig.rabbitMq.individualTopologyResultQueue, function (msg) {
                let message = msg.content.toString();
                console.log(message);
                operationLog.individualTaskFinish(message);
                if (websocket_io) {
                    websocket_io.emit('individual', JSON.parse(message))
                }
            }, {noAck: true});
            console.log("Listener is started");
        });
    });
}


function determine_file_format(content, search_pattern) {
    let fn = content.CustomOperation.args.filename;
    if (fn)
        return fn.search(search_pattern) >= 0;
    return false;
}

function is_csv(content) {
    return determine_file_format(content, '.csv')
}

function is_excel(content) {
    return determine_file_format(content, '.xls')
}

function process_file_read_operation(msg) {

    let content = JSON.parse(msg.content.toString());
    if (is_csv(content))
        csvProcessor.processCsv(msg);
    else if (is_excel(content))
        excelProcessor.processExcel(msg);
    else {
        console.log("No File or File Format is Unknown");
        return false
    }
    console.log("Request To Process File Received");
}

function startFileReaderQueueListener() {
    amqpConn.createChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });

        ch.prefetch(10);
        ch.assertQueue(pimsConfig.rabbitMq.fleReaderQueue, {durable: false}, function (err, _ok) {
            if (closeOnErr(err)) return;
            ch.consume(pimsConfig.rabbitMq.fleReaderQueue, function (msg) {
                process_file_read_operation(msg);
            }, {noAck: true});
            console.log("FileReadeкQueue Listener is started");
        });
    });
}


function notifyBatch(req, res) {
    let queuePrefix = req.params.queuePrefix,
        pipe_id = req.body.message.CustomOperation.pipelineId,
        entity_type_id = req.body.message.CustomOperation.entityTypeId;

    sync_module_tools.checkOperationSettings(pipe_id, entity_type_id).then(r => {
        if (r.success) {
            console.log("checked");
            notify(req, res, queuePrefix)
        } else {
            res.statusCode = 400;
            res.json(r)
        }

    }, e => {
        res.statusCode = 400;
        res.json({error: "Something with Settings"})
    })


}

function notifyEntity(req, res) {
    notify(req, res, pimsConfig.rabbitMq.entityRoutingKey)
}

function checkImmediatePipeline(req, res) {
    let entity_type_ids = req.body.entityTypeIds,
        external_system_ids = req.body.externalSystemIds;
    sync_module_tools.checkImmediatePipeConfig(entity_type_ids, external_system_ids).then(errs=>{
        if(errs.length > 0){
            res.statusCode = 400;
            res.json({
                error: errs
            })
        }else{
            res.send(200)
        }
    }, error =>{
        console.log(error);
        res.send(500)
    })

}


exports.notifyBatch = notifyBatch;
exports.notifyEntity = notifyEntity;
exports.sendMessage = sendMessage;
exports.startConnenction = startConnenction;
exports.checkImmediatePipeline = checkImmediatePipeline;
