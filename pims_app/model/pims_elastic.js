let elasticsearch = require('elasticsearch'),
    config = require('config'),
    pimsConfig = config.get('config'),
    elastic_index = pimsConfig.elasticSearch.indexName;

let client = new elasticsearch.Client({
    host: pimsConfig.elasticSearch.url,
    //log: 'trace'
});

function findAll(type, query, from, size = 10, fields, sort) {
    return client.search({
        index: elastic_index,
        type: type,
        size: size,
        from: from,

        body: {
            _source: fields,
            query: query,
            sort: sort
        }
    })
}

function multiGet(refs) {
    let ds = refs.map(d => {
        d['_index'] = elastic_index;
        return d;
    });
    console.log(ds);
    return client.mget({
        body: {
            docs: ds
        }
    }).then(function (r) {
        return r;
    }, e => {
        console.log(e)
    });
}

function multiSearch(refs) {
    let ds = refs.map(d => {
        if (d.hasOwnProperty('index')) {
            d['index'] = elastic_index;
            d['size'] = 100;
        }
        return d;
    });
    return client.msearch({
        body:
        ds


    });
}

function makeSortable(type, body) {
    let indexParams = {
        index: elastic_index,
    };

    let requestParams = {
        index: elastic_index,
        type: type,
        body
    };
    return client.indices.putMapping(requestParams);
}

exports.findAll = findAll;
exports.multiGet = multiGet;
exports.multiSearch = multiSearch;
exports.makeSortable = makeSortable;