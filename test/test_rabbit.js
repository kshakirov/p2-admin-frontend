let amqp = require('amqplib/callback_api'),
    config = require('config'),
    pimsConfig = config.get('config');

let msg = "{\"name\":\"PERFORM_EXTERNAL_OPERATION\", \"exteral_operation_id\":5}";


amqp.connect(`amqp://${pimsConfig.rabbitMq.url}`, function (err, conn) {
    conn.createChannel(function (err, ch) {
        let ex = pimsConfig.rabbitMq.pimsExchange,
            routingKey = pimsConfig.rabbitMq.decisionRoutingKey;
        ch.publish(ex, routingKey, new Buffer(msg));
        console.log(" [x] Sent %s", msg);
    });
});