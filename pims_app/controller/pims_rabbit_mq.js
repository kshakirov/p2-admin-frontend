let amqp = require('amqplib/callback_api'),
    config = require('config'),
    pimsConfig = config.get('config');


function notifyModification(req, res) {
    amqp.connect(`amqp://${pimsConfig.rabbitMq.url}`, function (err, conn) {
        conn.createChannel(function (err, ch) {
            let ex = pimsConfig.rabbitMq.pimsExchange,
                msg = JSON.stringify(req.body.message),
                routingKey = pimsConfig.rabbitMq.decisionRoutingKey;
            ch.publish(ex, routingKey, new Buffer(msg));
            console.log(" [x] Sent %s",msg);
        });
    });
}


exports.notifyModification = notifyModification;