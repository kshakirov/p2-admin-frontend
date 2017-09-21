let elastic_model = require("../model/pims_elastic");

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
    let bl = {bool: {}},
        keys = Object.keys(query);
    bl.bool.must = keys.map(function (k) {
        let q = {};
        q.match = {};
        q.match[k] = query[k];
        return q
    })
    return bl;
};

function compact_query(query) {
    if(query) {
        let keys = Object.keys(query),
            parsed_query = {};
        keys = keys.filter((k) => {
            if (query[k].length > 0) {
                return k
            }
        });
        if (keys.length > 0) {
            keys.forEach((k) => {
                parsed_query[k] = query[k]
            })
            return parsed_query
        } else {
            return false;
        }
    }else{
        return false;
    }

}

function findAll(req, res) {
    let query = {"match_all": {}},
        type = req.body.type,
        from = req.body.from,
        size = req.body.size;
    if (compact_query(req.body.query)) {
        query = build_query(req.body.query);
    }
    return elastic_model.findAll(type, query, from * size, size).then((response) => {
        res.json(prep_response(response, from, size));
    }, function (error) {
        res.send(error)
    })
}


exports.findAll = findAll;