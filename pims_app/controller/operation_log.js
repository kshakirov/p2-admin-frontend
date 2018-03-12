let config = require('config');
let pimsConfig = config.get('config');
let redis = require("redis"),
    elasticModel = require('../model/pims_elastic'),
    changesets = require('diff-json'),
    redisClient = redis.createClient(pimsConfig.redis.url);

redisClient.on("error", function (err) {
    console.log("Error " + err);
});


async function deleteOperation(key){
    return redisClient.hdel("operations", key, function (err, reply) {
        console.log(`Deleted ${key} From Redis`)
    })
}

async function addLogs (keys, reply) {
    for (const key of keys ){
         let data = JSON.parse(reply[key]);
        await elasticModel.addLogEntry(key, data);
        await deleteOperation(key, reply)
    }
}

function syncLog() {
    redisClient.hgetall("operations", function (err, reply) {
        if (reply) {
            let keys =  Object.keys(reply);
            addLogs(keys, reply);
        }
    });
}


function get_diff(newObj, oldObj) {
    let result = changesets.diff(oldObj, newObj);
    if (result && result.length > 0) {
        return result
    } else {
        []
    }
}


function individualTaskStart(message, user_login) {
    let body = {};
    let msg = JSON.parse(message);
    body.entityId = msg.pimsId;
    body.startedAt = Date.now();
    body.syncOperationType = msg.syncOperationType;
    body.entityTypeId = msg.entity_type_id;
    body.user = user_login;
    body.operationId = msg.requestId;
    body.diff = msg.diff;
    body.version = msg.version;
    elasticModel.addIndividualLogEntry(body)
}

function individualTaskFinish(message) {
    let body = {};
    let msg = JSON.parse(message);
    body.processed = true;
    body.startedAt = msg.syncTime;
    body.entityId = msg.pimsId;
    body.operationId = msg.requestId;
    body.syncOperationType = "SYNC";
    body.externalSysttemId = msg.extSysId;
    body.finishedAt = msg.syncTime;

    elasticModel.addIndividualLogEntry(body)
}

exports.syncLog = syncLog;
exports.individualTaskStart = individualTaskStart;
exports.individualTaskFinish = individualTaskFinish;