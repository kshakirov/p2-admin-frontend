let elasticsearch = require('elasticsearch'),
    config = require('config'),
    pimsConfig = config.get('config'),
    settings = pimsConfig.elasticSearch.settings,
    elastic_index = pimsConfig.elasticSearch.indexName;
client = new elasticsearch.Client({
    host: pimsConfig.elasticSearch.url,
    log: 'trace'
});

let indexParams = {
    index: elastic_index,
};

let requestParams = {
    index: elastic_index,
    settings

};


client.indices.exists(indexParams).then((r) => {
    if (r) {
        console.log("Index  Exists , Closing ...");
        client.indices.close(indexParams, closed => {
            client.indices.putSettings(requestParams, response => {
                console.log("Settings Changed");
                client.indices.open(indexParams, closed => {
                    console.log("Index Reopening ...");
                })
            })
        })


    }
}, (e) => {
    console.log(error)
});