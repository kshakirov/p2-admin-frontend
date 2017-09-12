let elasticsearch = require('elasticsearch');
let elastic_index = "pims_sync_demo";
let client = new elasticsearch.Client({
    host: '10.1.3.15:9200',
    log: 'trace'
});

function findAll(type, query, from, size=10) {
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