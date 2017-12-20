let elasticsearch = require('elasticsearch'),
    config = require('config'),
    pimsConfig = config.get('config'),
    elastic_index = pimsConfig.elasticSearch.indexName,
    windowSize = 1000000,
    client = new elasticsearch.Client({
        host: pimsConfig.elasticSearch.url,
        log: 'trace'
    });

let indexParams = {
    index: elastic_index,
};



function set_window_size(size) {
    client.indices.putSettings({body: {
        "index.max_result_window" : `${size}`}
    }).then(function (promise) {
        console.log(`Window Size Set To ${size}`);
    });
}


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
            set_window_size(windowSize);
        })
    }
}, (e) => {
    console.log(error)
});


