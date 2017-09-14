let elasticsearch = require('elasticsearch'),
    elastic_index = "pims_sync_demo",
    config = require('config'),
    pimsConfig = config.get('config');

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