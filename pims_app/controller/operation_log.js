let config = require('config');
let pimsConfig = config.get('config');
let redis = require("redis"),
    elasticModel = require('../model/pims_elastic'),
    changesets = require('diff-json'),
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


function get_diff(newObj, oldObj) {
    let result = changesets.diff(oldObj,newObj);
    if(result && result.length > 0){
        return result
    }else{
        []
    }
}


function individualTaskStart(message, user_login) {
    let body = {};
    let msg = JSON.parse(message),
        id = msg.requestId;
    body.entityId = msg.pimsId;
    body.startedAt = Date.now();
    body.syncOperationType = msg.syncOperationType;
    body.entityTypeId = msg.entity_type_id;
    body.user = user_login;
    body.diff = get_diff(msg.newAttributes,msg.oldAttributes);
    elasticModel.addIndividualLogEntry(id, body)
}

function individualTaskFinish(message) {
    let body = {
        doc: {}
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