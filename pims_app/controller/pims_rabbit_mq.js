let amqp = require('amqplib/callback_api'),
    config = require('config'),
    pimsConfig = config.get('config');



function notifyModification(req, res) {
    amqp.connect(`amqp://${pimsConfig.rabbitMq.url}`, function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = `${pimsConfig.rabbitMq.inQueue}`;

            ch.assertQueue(q, {durable: false});
            ch.sendToQueue(q, new Buffer(JSON.stringify(req.body.message)));
            console.log(`Message [${req.body.message}]`);
            res.json({success: true})
        });
    });
}

exports.notifyModification = notifyModification;