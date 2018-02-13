let restClient = require('node-rest-client-promise').Client(),
    metadata_base_url = "http://10.1.3.23:8080",
    waterfall = require("promise-waterfall"),
    pipe_relative_url = "/sync-module/external-operations/",
    external_systems_relative_url = "/sync-module/external-systems/",
    flatten = require('flatten'),
    sync_base_url = "http://10.1.2.117:4567";

let content = {
    "CustomOperation": {
        "name": "Export 2 Csv Product Brand",
        "id": 48,
        "pipelineId": 75,
        "entityTypeId": 14,
        "batchSize": 1500,
        "args": {
            "incremental": false,
            "lastModifiedAfter": "1970-01-01 15:45:20"
        }
    },
    "EntityInfo": {
        "id": null,
        "entityTypeId": 14
    },
    "PipelineInfo": {}
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
    return rows.map(r => {
        return r.schema.schema.map(p => {
            return p.in.map(pi => {
                return pi.path
            })
        })
    })
        .map(rr => {
            return flatten(rr, 2);
        })
        .map(rr => {
            return rr.filter(r => {
                if (r) return r
            })
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


function get_headers(schemata, entity_type_id) {
    let attrs = flatten(schemata.map(s => {
            return s.schema.schema.map(ss => {
                return ss;
            })
        }).map(s => {
            return s.map(ss => {
                return ss.in[0].path
            })
        })
    ).filter(s => {
        if (s)
            return s;
    });

    console.log(attrs)
}

function run(c) {
    let schemata = c.PipelineInfo.transformationSchemata,
        entity_type_id = c.CustomOperation.entityTypeId;
    get_referenced_entity_attr_ids(schemata, entity_type_id)
}


let check_pipe_schemata = function (pipeline_id, entity_type_id) {
    let url = sync_base_url + pipe_relative_url + pipeline_id;
    let result = {
        success: false,

    };
    return restClient.getPromise(url).then((data) => {
        let pipe = data.data;
        if (check_schemata(pipe, entity_type_id)) {
            let s_system = pipe.externalOperation.sourceSystem,
                t_system = pipe.externalOperation.targetSystem;
            if (check_external_system(s_system, entity_type_id)) {
                if (check_external_system(t_system, entity_type_id)) {
                    result.success = true;
                } else {
                    result.error = "The Target System Does Not Contain Any End Point  For This Entity Type. Go to External Systems and Create the End Point for This Entity Type"
                }
            } else {
                result.error = "The Source System Does Not Contain Any End Point  For This Entity Type. Go to External Systems and Create the End Point for This Entity Type"
            }

        } else {
            console.log("TS Doesn't  Exist");
            result.error = "The Pipe Does Not Contain Any Schemata For This Entity Type. Either Create Schemata or Add an Entry for This Entity Type in the Pipe"
        }
        return result;

    }, (e) => {
        console.log(e)
    })
};


let check_schemata = function (pipe, entity_type_id) {
    let schemata = pipe.externalOperation.transformationSchemata,
        ids = Object.keys(schemata);
    let schema_id = ids.find(i => {
        return i === entity_type_id.toString()
    });
    if (schema_id && schemata[schema_id])
        return true;
    return false;
};

let check_external_system = function (system, entity_type_id) {
    let entities = Object.keys(system.customAttributes.entities);
    system_id = entities.find(i => {
        return i === entity_type_id.toString()
    });
    if (system_id)
        return true;
    return false
};

// check_pipe_schemata(74, 14).then(r => {
//     console.log(r)
// });


function external_system_lacks_entity_entries(entity_type_ids, external_system) {
    let missed_entities  = entity_type_ids.filter(eti=>{
        if(!external_system.customAttributes.entities.hasOwnProperty(eti))
            return true;
    });
    if(missed_entities.length>0){
        return missed_entities.join(',');
    }
    return false;
}

function checkImmediatePipeConfig(entity_type_ids, external_system_ids) {
    let url = sync_base_url + external_systems_relative_url;
    let result = {
        success: false,

    };
    let ext_syss = external_system_ids.map(id=>{
        return restClient.getPromise(url + "/" + id)
    });



    Promise.all(ext_syss).then(r=>{
        let wrong_external_systems = r.map(rr=>{
            return {
                name: rr.data.name,
                missedEntities: external_system_lacks_entity_entries(entity_type_ids,rr.data)
            }
        });
        return wrong_external_systems.filter(wes=>{
            if(!wes.missedEntities)
                return
        });

    },e=>{
        console.log(e)
    })

}

checkImmediatePipeConfig([2, 7, 8], [32,27]);