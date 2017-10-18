let elasticsearch = require('elasticsearch'),
    client = new elasticsearch.Client({
        host: '10.1.3.15:9200',
        log: 'trace'
    });

let indexParams = {
    index: "pims-staging",
},
    type = "fd5b36e3-90a3-493b-a37d-c4f4262aec22";

let body = {
    "fd5b36e3-90a3-493b-a37d-c4f4262aec22": {
        properties: {
            "2fd537cf-0120-4d12-8f08-02c36e598deb": {
                "type": "string", "index": "not_analyzed"
            },
            "a5566795-1074-43c0-b0b4-7cae2bcb6483": {
                "type": "string"
            },
            "c8d52e69-1cf9-4692-ba79-23883fe6aca8": {
                "type": "string", "index": "not_analyzed"
            },
        }
    }
};




client.indices.exists(indexParams).then((r) => {
    if (r) {
        console.log("Index  Exists ...");
        client.indices.delete(indexParams).then(() => {
            console.log("Index Successfully Deleted")
        })

    } else {
        console.log("Does Not Exist ...");
        client.indices.create(indexParams).then(() => {
            console.log("Index Successfully Created");
            console.log("");
            // client.indices.putMapping({index: indexParams.index,
            //     type: type,
            //     body: body}).then(()=>{
            //     console.log(" Mapping Successfully Put");
            // },(error)=>{
            //     console.log("Error Putting Mapping");
            //     console.log(error);
            // })
        })
    }
}, (e) => {
    console.log(error)
});



