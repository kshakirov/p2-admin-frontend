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
        "args": {"incremental": false, "lastModifiedAfter": "1970-01-01 15:45:20"}
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
                "outputAttributes": [70, 78],
                "preprocSchema": [{
                    "out": "14",
                    "converters": [{
                        "id": 34,
                        "name": "create_brand",
                        "language": "javascript",
                        "code": "function create_brand(name_array, id_array){\n    var length = name_array.length;\n    var brands = [];\n    \n    for(var i=0;i<length;i++){\n        var brand = {};\n        brand.name = name_array[i];\n        brand.id = id_array[i];\n        brands.push(brand);\n    }\n    return brands;\n}",
                        "customAttributes": {"type": "Converter"}
                    }],
                    "in": [{"path": "b_name"}, {"path": "b_external_id"}]
                }],
                "schema": [{"out": "attributes.70", "in": [{"path": "name"}]}, {
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
                }]
            },
            "customAttributes": {"entity": {"uuid": 14}, "export": true}
        }, {
            "id": 99,
            "name": "Csv 2 Pims Test Entity (Product Array)",
            "schema": {
                "entityTypeId": 4,
                "outputAttributes": [43, 42],
                "preprocSchema": [{
                    "out": "19",
                    "converters": [{
                        "id": 35,
                        "name": "create_product",
                        "language": "javascript",
                        "code": "function create_product(name_array, internal_reference_array){\n    var length = name_array.length;\n    var products = [];\n\n    for(var i=0;i<length;i++){\n        var product = {};\n        product.name = name_array[i];\n        product.internal_reference = internal_reference_array[i];\n        products.push(product);\n    }\n    return products;\n}",
                        "customAttributes": {"type": "Converter"}
                    }],
                    "in": [{"path": "p_name"}, {"path": "p_internal_reference"}]
                }],
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
                }, {"out": "attributes.42", "in": [{"path": "name"}]}]
            },
            "customAttributes": {"entity": {"uuid": 4}, "export": true}
        }]
    }
}


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
    return flatten( rows.map(r => {
        return r.schema.preprocSchema.map(p => {
            return p.in.map(pi => {
                return pi.path
            })
        })
    }),1
    )
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

function run(c) {
    let schemata = c.PipelineInfo.transformationSchemata,
        entity_type_id = c.CustomOperation.entityTypeId;

    let schema_rows = get_schema_rows(schemata, entity_type_id);
    //console.log(schema_rows)
    let obj_ids = get_main_entity_rules(schemata,entity_type_id);
    let ids = obj_ids.map(io =>{return io.id});
    console.log(ids);
         get_attributes(ids).then(atts =>{
         let array_ids =get_array_attributes(atts);
         let names  = get_array_out_attributes(obj_ids,array_ids);
         names = names.map(n=>{return [n]});
         console.log(names);
         return names;
     });


}

run(content);
