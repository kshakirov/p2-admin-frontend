let elasticsearch = require('elasticsearch'),
    config = require('config'),
    pimsConfig = config.get('config'),
    elastic_index = pimsConfig.elasticSearch.indexName;

let client = new elasticsearch.Client({
    host: pimsConfig.elasticSearch.url,
    log: 'trace'
});

function findAll(type, query, from, size = 10) {
    return client.search({
        index: elastic_index,
        type: type,
        size: size,
        from: from,
        body: {
            query: query
        }
    }).then(function (resp) {
        return resp;
    }, function (err) {
        console.trace(err.message);
        return
    });
}


exports.findAll = findAll;