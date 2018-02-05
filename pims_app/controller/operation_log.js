let config = require('config');
let pimsConfig = config.get('config');
let redis = require("redis"),
    elasticModel = require('../model/pims_elastic'),
    redisClient = redis.createClient(pimsConfig.redis.url);

redisClient.on("error", function (err) {
    console.log("Error " + err);
});


function syncLog() {
    redisClient.hgetall("operations", function (err, reply) {
        if (reply) {
            Object.keys(reply).map(e => {
                let data = JSON.parse(reply[e]);
                elasticModel.addLogEntry(e, data);
            });
        }
    });
}

function individualTaskStart(message) {
    let body = {};
    let msg = JSON.parse(message),
        id = msg.requestId;
    body.entityId = msg.pimsId;
    body.startedAt = Date.now();
    body.entityTypeId = msg.entity_type_id;

    elasticModel.addIndividualLogEntry(id, body)
}

function individualTaskFinish(message) {
    let body = {
        doc: {

        }
    };
    let msg = JSON.parse(message),
        id = msg.requestId;
    body.doc.processed = true;
    body.doc.externalSysttemId = msg.extSysId;
    body.doc.finishedAt = msg.syncTime;

    elasticModel.updateIndividualLogEntry(id, body)
}

exports.syncLog = syncLog;
exports.individualTaskStart = individualTaskStart;
exports.individualTaskFinish = individualTaskFinish;