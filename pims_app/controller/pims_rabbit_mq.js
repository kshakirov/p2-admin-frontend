let amqp = require('amqplib/callback_api'),
    config = require('config'),
    csvProcessor = require('./csv_reader_redis'),
    excelProcessor = require('./excell_reader_redis'),
    amqpConn = null;
pimsConfig = config.get('config');


function notify(req, res, queue_name) {
    amqp.connect(`amqp://${pimsConfig.rabbitMq.url}`, function (err, conn) {
        conn.createChannel(function (err, ch) {
            if (err) {
                console.log(err)
            }
            let ex = pimsConfig.rabbitMq.pimsExchange,
                msg = JSON.stringify(req.body.message);
            ch.publish(ex, queue_name, new Buffer(msg));
            console.log(" [x] Sent %s", msg);
            res.json({success: true})
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
                console.log(msg.content.toString());
                if (websocket_io) {
                    websocket_io.emit('individual', JSON.parse(msg.content.toString()))
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
    let queuePrefix = req.params.queuePrefix;
    notify(req, res, queuePrefix)
}

function notifyEntity(req, res) {
    notify(req, res, pimsConfig.rabbitMq.entityRoutingKey)
}


exports.notifyBatch = notifyBatch;
exports.notifyEntity = notifyEntity;
exports.startConnenction = startConnenction;