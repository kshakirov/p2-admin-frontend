let redis = require("redis"),
    client = redis.createClient('redis://10.1.3.23');

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});


// client.hgetall("operations", function (err, reply) {
//     console.log(reply);
//     Object.keys(reply).map(e =>{
//         let data = JSON.parse(reply[e]);
//         console.log(`\n ${e} => `);
//         console.log(data);
//
//     });
//     client.quit();
// });
//

// client.rpop("notification", function (err, reply) {
//     if(reply){
//         console.log(JSON.parse(reply));
//     }else{
//         console.log("undefined reply");
//     }
//
//     client.quit();
// });

let counter = 1,
    startdate = new Date().getTime();

function sendToRedis() {
    let message = createMessage();
    client.rpush(["notifications", JSON.stringify(message)] , function (err, reply) {
    if(err){
        console.log("Error");
        console.log(err)
    }
    if(reply){
        console.log(JSON.parse(reply));
    }else{
        console.log("undefined reply");
    }

    //client.quit();
});
}

function createMessage () {
    counter = counter + 1;
    let message = {
            "operationId": "58cecc20-9582-4d69-bece-536e5d566454",
            "customOperationName": "Import Product  From Openerp",
            "entityTypeId": 7,
            "submittedEntities": 1500 * counter,
            "processedEntities": 1500 * counter,
            "failedEntities": 0,
            "startedAt": startdate,
            "lastUpdatedAt": new Date().getTime(),
            "completedAt": null
    };
    console.log(message);
    return message;
}


setInterval(sendToRedis, 3000);