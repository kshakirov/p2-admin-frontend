let elastic_model = require("../model/pims_elastic");


function compact_query(query) {
    if (query) {
        let keys = Object.keys(query),
            parsed_query = {};
        keys = keys.filter((k) => {
            if (query[k].length > 0 || query[k] > 0) {
                return k
            }
        });
        if (keys.length > 0) {
            keys.forEach((k) => {
                parsed_query[k] = query[k]
            });
            return parsed_query
        } else {
            return false;
        }
    } else {
        return false;
    }

}

function prep_response(response, from, size) {
    let r = {};
    r.content = response.hits.hits.map((hit) => {
        let attrs = hit._source;
        attrs.id = hit._id;
        return attrs
    });
    r.totalPages = response.hits.total / size;
    r.number = from;
    r.first = from == 0;
    r.last = r.totalPages == from;
    return r;
};


function build_query(query) {
    let qs = {
            "query_string": {
                "fields": [],
                "lenient": true,
                "query": ""
            }
        },
        keys = Object.keys(query);


    qs.query_string.fields = keys.map(function (k) {
        return k
    });
    let temp_query = keys.map(function (k) {
        return query[k]
    });
    qs.query_string.query = temp_query.join(" AND ");
    return qs;
}


function findOperations(req, res) {
    let query = {"match_all": {}},
        type = req.body.type,
        from = req.body.from,
        size = req.body.size,
        fields = req.body.fields,
        sort = req.body.sort;
    let compacted_query = compact_query(req.body.query);
    if(compacted_query){
        query = build_query(compacted_query);
    }
    //for the time being
    return elastic_model.findAll(type, query, from * size, size, fields, sort).then((r) => {
        let response = prep_response(r,from,size);
        res.json(response)

    }, function (error) {
        res.sendStatus(400, error)
    })
}

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


function findAggregations(req, res) {
    let type = req.body.type,
        query = {"match_all": {}},
        compacted_query = false,
        fields = req.body.fields;
    if(req.body.query && req.body.query.hasOwnProperty('query')) {
        compacted_query = compact_query(req.body.query.query);
        if(compacted_query){
            query = build_query(compacted_query);
        }
    }
    let body  = create_agg_body(fields);
    query = query;
    return elastic_model.findAggregations(type,body, query).then(r=>{
        res.json(r)
    }, e=>{
        res.sendStatus(400,e)
    })
}


exports.findOperations = findOperations;
exports.findAggregations = findAggregations;
