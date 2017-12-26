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
        //console.log(reply);
        Object.keys(reply).map(e =>{
            let data = JSON.parse(reply[e]);
            //console.log(`\n ${e} => `);
            elasticModel.addLogEntry(e,data);
        });
    });
}


exports.syncLog = syncLog;