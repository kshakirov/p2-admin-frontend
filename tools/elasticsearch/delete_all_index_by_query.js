let elasticsearch = require('elasticsearch'),
    config = require('config'),
    pimsConfig = config.get('config'),
    elastic_index = pimsConfig.elasticSearch.indexName;
client = new elasticsearch.Client({
    host: pimsConfig.elasticSearch.url,
    log: 'trace'
});


client.deleteByQuery({
    index: elastic_index,
    body: {
        query: {
            match_all: {}
        }
    }
}, (e, r) => {
    console.log(r);
    console.log(e)
});
