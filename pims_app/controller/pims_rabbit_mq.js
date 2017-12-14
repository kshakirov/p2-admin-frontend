let amqp = require('amqplib/callback_api'),
    config = require('config'),
    pimsConfig = config.get('config');


function notify(req, res, queue_name) {
    amqp.connect(`amqp://${pimsConfig.rabbitMq.url}`, function (err, conn) {
        conn.createChannel(function (err, ch) {
            if(err){
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

function notifyBatch(req, res) {
    let queuePrefix =req.params.queuePrefix;
    notify(req, res, queuePrefix)
}

function notifyEntity(req, res) {
    notify(req, res, pimsConfig.rabbitMq.entityRoutingKey)
}


exports.notifyBatch = notifyBatch;
exports.notifyEntity = notifyEntity;