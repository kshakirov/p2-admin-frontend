let elasticsearch = require('elasticsearch'),
    config = require('config'),
    pimsConfig = config.get('config'),
    elastic_index = pimsConfig.elasticSearch.indexName,
    windowSize = 1000000,
    client = new elasticsearch.Client({
        host: pimsConfig.elasticSearch.url,
        log: 'trace'
    });

let analyzer = {

    "analyzer": {
        "lowercase_keyword": {
            "filter": "lowercase",
            "type": "custom",
            "tokenizer": "keyword"
        }
    }
};

let indexParams = {
    index: elastic_index,
    body: {
        settings: {
            analysis: analyzer
        }
    }
},
    indexDelete = {
    index: elastic_index
    };


function set_window_size(size) {
    client.indices.putSettings({
        body: {
            "index.max_result_window": `${size}`
        }
    }).then(function (promise) {
        console.log(`Window Size Set To ${size}`);
    });
}

console.log(`Checking Index [${elastic_index}] Existence`);

client.indices.exists(indexDelete).then((r) => {
    if (r) {
        console.log("Index  Exists ...");
        client.indices.delete(indexDelete).then(() => {
            console.log("Index Successfully Deleted")
        })

    } else {
        console.log("Does Not Exist ...");
        client.indices.create(indexParams).then(() => {
            console.log("Index Successfully Created");
            set_window_size(windowSize);
        })
    }
}, (e) => {
    console.log(error)
});


