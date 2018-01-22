let restClient = require('node-rest-client-promise').Client(),
    metadata_base_url = "http://10.1.3.23:8080",
    waterfall = require("promise-waterfall"),
    flatten = require('flatten'),
    sync_base_url = "http://10.1.2.117:4567";

let content = {
    "CustomOperation": {
        "name": "Import Csv Test Entity",
        "id": 42,
        "pipelineId": 23,
        "entityTypeId": 19,
        "batchSize": 1500,
        "args": {"incremental": false, "lastModifiedAfter": "1970-01-01 15:45:20", "filename": "file-1515778162086.csv"}
    },
    "EntityInfo": {"id": null, "entityTypeId": 19},
    "PipelineInfo": {
        "transformationSchemata": [{
            "id": 92,
            "name": "Csv 2 Pims Test Entity (Array)",
            "schema": {
                "entityTypeId": 19,
                "outputAttributes": [99, 100, 98],
                "schema": [{
                    "out": "attributes.99",
                    "converters": [{
                        "id": 16,
                        "name": "str_to_int",
                        "language": "javascript",
                        "code": "function str_to_int(value) {\n    return parseInt(value)\n}",
                        "customAttributes": {"type": "Converter"}
                    }],
                    "in": [{"path": "id"}]
                }, {"out": "attributes.100", "in": [{"path": "description"}]}, {
                    "out": "attributes.98",
                    "in": [{"path": "items"}]
                }, {
                    "out": "uuid",
                    "in": [{
                        "ref": {
                            "name": "Test Entity > pimsId",
                            "isEntityKey": false,
                            "projection": ["uuid"],
                            "entityTypeId": 19,
                            "key": {"99": {"path": "id", "type": "INTEGER"}},
                            "projections": ["uuid"]
                        }
                    }]
                }]
            },
            "customAttributes": {"entity": {"uuid": 19}, "export": true}
        }, {
            "id": 98,
            "name": "Csv 2 Pims Test Entity (Brand Array)",
            "schema": {
                "entityTypeId": 14,
                "outputAttributes": [70, 78, 72, 78],
                "preprocSchema": [{"out": "14", "in": [{"path": "brands"}]}],
                "schema": [{"out": "attributes.70", "in": [{"path": "brand_name"}]}, {
                    "out": "attributes.78",
                    "in": [{
                        "ref": {
                            "name": "Product Brand > pimsId",
                            "isEntityKey": false,
                            "projection": ["uuid"],
                            "entityTypeId": 14,
                            "key": {"78": {"path": "id", "type": "STRING"}},
                            "projections": ["uuid"]
                        }
                    }]
                }, {"out": "attributes.72", "in": [{"path": "b_description"}]}, {
                    "out": "attributes.78",
                    "in": [{"path": "b_external_id"}]
                }]
            },
            "customAttributes": {"entity": {"uuid": 14}, "export": true}
        }, {
            "id": 99,
            "name": "Csv 2 Pims Test Entity (Product Array)",
            "schema": {
                "entityTypeId": 4,
                "outputAttributes": [43, 42, 43],
                "preprocSchema": [{"out": "19", "in": [{"path": "products"}]}],
                "schema": [{
                    "out": "attributes.43",
                    "in": [{
                        "ref": {
                            "name": "Product > pimsId",
                            "isEntityKey": false,
                            "projection": ["uuid"],
                            "entityTypeId": 4,
                            "key": {"43": {"path": "internal_reference", "type": "STRING"}},
                            "projections": ["uuid"]
                        }
                    }]
                }, {"out": "attributes.42", "in": [{"path": "p_name"}]}, {
                    "out": "attributes.43",
                    "in": [{"path": "p_internal_reference"}]
                }]
            },
            "customAttributes": {"entity": {"uuid": 4}, "export": true}
        }]
    }
};


let attributes_regex = /.*attributes\.\d+/;

function get_attributes_ids(schemata) {
    let attrbiutes = schemata.schema.filter(s => {
        if (s.out.match(attributes_regex)) {
            return s;
        }
    });
    return attrbiutes.map(a => {
        let parts = a.out.split(".");
        return {
            id: parseInt(parts[1]),
            out: a.in[0].path
        }

    })
}

let get_pipeline = function (pipeline_id, entity_type_id) {
    let url = sync_base_url + "/sync-module/external-operations/" + pipeline_id;
    return restClient.getPromise(url).then((data) => {
        let schemata = data.data.externalOperation.transformationSchemata;
        if (schemata.hasOwnProperty(entity_type_id)) {
            return get_attributes_ids(schemata[entity_type_id].schema);
        } else {
            return false;
        }
    }, (e) => {
        console.log(e)
    })
};

let get_attribute = function (url) {
    return restClient.getPromise(url).then((data) => {
        return data.data;
    })
};

let get_attributes = function (ids) {
    let url = metadata_base_url + "/rest/entity-types/1/attributes/";
    let actions = ids.map(i => {
        return get_attribute(url + i)
    });
    return Promise.all(actions).then(p => {
        return p
    }, e => {
        console.log(e);
        return false;
    })
};


function get_array_attributes(atts) {
    let array_type = atts.filter(a => {
        if (a.valueType.toLowerCase() === 'array' || a.valueType.toLowerCase() === 'enum') {
            return a;
        }
    });
    return array_type.map(a => {
        return a.uuid
    })
}

function get_array_out_attributes(id_objs, array_ids) {
    let out_array_names = id_objs.filter(obj => {
        if (array_ids.includes(obj.id)) {
            return obj;
        }
    });
    return out_array_names.map(o => {
        return o.out
    })
}

// get_pipeline(23, 19).then(id_objs =>{
//     let ids = id_objs.map(io =>{return io.id});
//      get_attributes(ids).then(atts =>{
//          let array_ids =get_array_attributes(atts);
//          let names  = get_array_out_attributes(id_objs,array_ids);
//          console.log(names);
//          return names;
//      });
//
//
//  });


function get_schema_rows(schemata, entity_type_id) {
    let rows = schemata.filter(s => {
        if (s.schema.entityTypeId != entity_type_id) {
            console.log(`Referenced entity ${s.name} of entity type ${s.schema.entityTypeId}`)
            return s;
        }
    });
    rows = flatten(rows);
    return flatten(rows.map(r => {
            return r.schema.preprocSchema.map(p => {
                return p.in.map(pi => {
                    return pi.path
                })
            })
        }), 1
    )
}


function get_referenced_entity_rules(schemata, entity_type_id) {
    let rows = flatten(schemata.filter(s => {
        if (s.schema.entityTypeId != entity_type_id) {
            console.log(`Referenced entity ${s.name} of entity type ${s.schema.entityTypeId}`);
            return s;
        }
    }));
    return  rows.map(r => {
        return r.schema.schema.map(p => {
            return p.in.map(pi => {
                return pi.path
            })
        })
    })
    .map(rr=>{
        return flatten(rr,2);
    })
    .map(rr=>{
        return rr.filter(r=>{if(r) return r})
    })

}


function get_main_entity_rules(schemata, entity_type_id) {
    let main_schema = schemata.find(s => {
        if (s.schema.entityTypeId == entity_type_id) {
            console.log(`Main entity ${s.name} of entity type ${s.schema.entityTypeId}`);
            return s;
        }
    });
    return get_attributes_ids(main_schema.schema)
}

function run2(c) {
    let schemata = c.PipelineInfo.transformationSchemata,
        entity_type_id = c.CustomOperation.entityTypeId;

    let schema_rows = get_schema_rows(schemata, entity_type_id);
    //console.log(schema_rows)
    let obj_ids = get_main_entity_rules(schemata, entity_type_id);
    let ids = obj_ids.map(io => {
        return io.id
    });
    console.log(ids);
    get_attributes(ids).then(atts => {
        let array_ids = get_array_attributes(atts);
        let names = get_array_out_attributes(obj_ids, array_ids);
        names = names.map(n => {
            return [n]
        });
        console.log(names);
        return names;
    });


}

function run(c) {
    let schemata = c.PipelineInfo.transformationSchemata,
        entity_type_id = c.CustomOperation.entityTypeId;
    let ref_rules = get_referenced_entity_rules(schemata, entity_type_id);
    console.log(ref_rules);
    let new_csv_cols = flatten(get_schema_rows(schemata, entity_type_id));
    console.log(new_csv_cols);
}

run(content);
