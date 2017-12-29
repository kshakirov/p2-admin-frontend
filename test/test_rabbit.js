let amqp = require('amqplib/callback_api'),
    config = require('config'),
    pimsConfig = config.get('config');

function startConnenction() {
    let amqpConn =null;
    amqp.connect(`amqp://10.1.3.23`, function(err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(startConnenction, 1000);
        }
        conn.on("error", function(err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", function() {
            console.error("[AMQP] reconnecting");
            return setTimeout(startConnenction, 1000);
        });
        console.log("[AMQP] connected");
        amqpConn = conn;
        startListener();
    });
}

function startListener() {
    amqpConn.createChannel(function(err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function(err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function() {
            console.log("[AMQP] channel closed");
        });

        ch.prefetch(10);
        ch.assertQueue(individualTopologyResultQueue, { durable: true }, function(err, _ok) {
            if (closeOnErr(err)) return;
            ch.consume(pimsConfig.rabbitMq.processMsg, { noAck: false });
            console.log("Listener is started");
        });
    });
}