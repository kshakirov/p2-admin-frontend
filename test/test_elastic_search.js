var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: '10.1.3.15:9200',
    log: 'trace'
});

client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});

client.msearch({
    body: [

        { index: 'pims-staging', type: '7' },
        { query: { bool: { must: {match: {
            "33": "79"
        }}} } }
    ]
    }
).then(function (resp) {
    resp.responses.map(resp =>{
        let hits = resp.hits.hits;
    })

}, function (err) {
    console.trace(err.message);
});