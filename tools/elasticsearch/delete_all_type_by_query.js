let elasticsearch = require('elasticsearch'),
    config = require('config'),
    pimsConfig = config.get('config'),
    elastic_index = pimsConfig.elasticSearch.indexName;
client = new elasticsearch.Client({
    host: pimsConfig.elasticSearch.url,
    log: 'trace'
});

let type = process.argv[2].toString();
if (!type) {
    console.log("Type Is Not Defined");
    exit()
} else {
    client.deleteByQuery({
        index: elastic_index,
        type: type,
        body: {
            query: {
                match_all: {}
            }
        }
    }, (e,r) => {
        console.log(r)
        console.log(e)
    });
}