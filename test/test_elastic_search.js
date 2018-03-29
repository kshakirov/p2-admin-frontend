let elasticsearch = require('elasticsearch'),
    client = new elasticsearch.Client({
        host: '10.1.3.15:9200',
        log: 'trace'
    }),
    index = 'pims-staging';


let fields = [
    {
        field: 'SyncOperationType',
        type: 'terms'
    },
    {
        field: 'SyncOperationId',
        type: 'terms'
    },
    {
        field: 'startedAt',
        type: 'min'
    },
    {
        field: 'startedAt',
        type: 'max'
    },
    {
        field: 'finishedAt',
        type: 'min'
    },
    {
        field: 'finishedAt',
        type: 'max'
    }
];

function create_agg_body(fields) {
    let aggs = {};
    fields.map(function (f) {
        let aggs_item_name = f.type + "____" + f.field;
        aggs[aggs_item_name] = {};
        aggs[aggs_item_name][f.type] = {
            field: f.field
        }
    });
    return aggs
}

let aggs_body = create_agg_body(fields);

client.search({
        index: index,
        type: 'individual',
        body: {aggs: aggs_body}
    }
).then(function (resp) {
    console.log(resp.aggregations)

}, function (err) {
    console.trace(err.message);
});


let t = {
    aggs: {
        operationTypes: {
            terms: {
                field: 'syncOperationType'
            }
        },
        operationIds: {
            terms: {
                field: 'syncOperationId'
            }
        },
        minStartedAt: {
            min: {field: "startedAt"}
        }
        ,
        maxStartedAt: {
            max: {field: "startedAt"}
        },

        minFinishedAt: {
            min: {field: "finishedAt"}
        }
        ,
        maxFinishedAt: {
            max: {field: "finishedAt"}
        }
    }
}