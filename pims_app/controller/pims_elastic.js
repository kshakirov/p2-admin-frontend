let elastic_model = require("../model/pims_elastic");

function resolve_references(response, references) {
    let refs_hash = {};
    response.content.map(item => {
        references.map(r => {
            refs_hash[item[r.attributeId]] =
                {
                    type: r.entityTypeId,
                    id: item[r.attributeId]
                }
        });
    });
    let keys = Object.keys(refs_hash);
    let docs = keys.map(key => {
        if (refs_hash[key].id) {
            return {
                type: refs_hash[key].type.toString(),
                _id: refs_hash[key].id.toString(),
            }
        } else {
            return false;
        }
    });
    docs = docs.filter(d => {
        if (d)
            return true;
    });
    return docs;

}

function replace_references(content, docs, names) {
    let docs_hash = {};
    docs.docs.map(doc => {
        docs_hash[doc._id] = {
            type: doc._type,
            name: doc._source[names[doc._type]]
        }
    });

    let r_r = content.map(r => {
        let keys = Object.keys(r);
        let n_r = {};
        keys.map(k => {
            let value = r[k];
            if (docs_hash.hasOwnProperty(value)) {
                n_r[k] = docs_hash[value].name;
            } else {
                n_r[k] = value;
            }
        })
        return n_r;
    });
    return r_r;
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
    let bl = {bool: {}},
        keys = Object.keys(query);
    bl.bool.must = keys.map(function (k) {
        let q = {};
        q.match = {};
        q.match[k] = query[k];
        return q
    });
    return bl;
}


function has_query_reference(compacted_query, references, names) {
    let has = [];
    references.map(r => {
        if (compacted_query.hasOwnProperty(r.attributeId)) {
            if (names.hasOwnProperty(r.entityTypeId)) {
                let resolved_attr_id = names[r.entityTypeId];
                has.push({
                    entityTypeId: r.entityTypeId,
                    attributeId: resolved_attr_id,
                    originalAttributeId: r.attributeId,
                    search: compacted_query[r.attributeId]
                })
            }
        }
    });
    if (has.length == 0)
        return false;
    return has;
}

function compact_query(query) {
    if (query) {
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
            });
            return parsed_query
        } else {
            return false;
        }
    } else {
        return false;
    }

}

function build_msearch_query(reference_query) {
    let result = [];
    reference_query.map(r => {
        result.push(
            {index: null, type: r.entityTypeId}
        );
        let query = {
            bool: {
                must: {
                    match: {}
                }
            }
        };
        query.bool.must.match[r.attributeId.toString()] = r.search;
        result.push({query: query})
    });
    return result;

}


function replace_resolved_query(r, references, query) {
    let queries = r.responses.map(r =>{
        if(r.hits.hits.length> 0){
            let hit = r.hits.hits[0];
            let queryId = references.find(ref =>{
                if(ref.entityTypeId.toString() == hit['_type'])
                    return ref;
            });
            if(queryId){
                queryId = queryId.attributeId;
            }
            return {
                id: hit['_id'],
                type: hit['_type'],
                queryId: queryId.toString()
            }
        }
    });
    queries.map(q =>{
       query.bool.must.map( m => {
           if(m.match.hasOwnProperty(q.queryId)){
               m.match[q.queryId] = q.id;
           }
       })
    });
    return query;

}


function base_find(type, query, from, size, fields, references, names, res) {
    return elastic_model.findAll(type, query, from * size, size, fields).then((response) => {
        response = prep_response(response, from, size);
        let refs = resolve_references(response, references);
        return elastic_model.multiGet(refs).then(p => {
            if (p && p.hasOwnProperty('docs')) {
                response.content = replace_references(response.content, p, names);
            }
            res.json(response);
        }, e => {
            res.send(response.content)
        });

    }, function (error) {
        res.sendStatus(400, error)
    })
}


function findAll(req, res) {
    let query = {"match_all": {}},
        reference_query = false,
        type = req.body.type,
        from = req.body.from,
        size = req.body.size,
        fields = req.body.fields,
        names = req.body.referenceNames,
        references = req.body.references;
    let compacted_query = compact_query(req.body.query);
    if (compacted_query) {
        query = build_query(compacted_query);
        reference_query = has_query_reference(compacted_query, references, names);
        if (reference_query) {
            let mquery = build_msearch_query(reference_query);
            return elastic_model.multiSearch(mquery).then(r => {
                let q = replace_resolved_query(r, references, query);
                base_find(type,q, from , size, fields, references,names, res)
            }, error => {
                console.log(error)
            })
        }else {
            base_find(type,query, from , size, fields, references,names, res)
        }
    }else{
        return base_find(type,query, from , size, fields, references,names, res)
    }


}


exports.findAll = findAll;