let restClient = require('node-rest-client-promise').Client(),
    config = require('config'),
    pimsConfig = config.get('config'),
    pipe_relative_url = "/sync-module/external-operations/",
    attribute_relative_url = "/rest/entity-types/1/attributes/",
    metadata_base_url = pimsConfig.metadataServer.url,
    flatten = require('flatten'),
    sync_base_url = pimsConfig.syncModule.url;


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
    let url = sync_base_url + pipe_relative_url + pipeline_id;
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
    let url = metadata_base_url + attribute_relative_url;
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


function resolveArrayAttributes(pipelineId, entityTypeId) {
    return get_pipeline(pipelineId, entityTypeId).then(id_objs => {
        let ids = id_objs.map(io => {
            return io.id
        });
        return get_attributes(ids).then(atts => {
            let array_ids = get_array_attributes(atts);
            let array_names = get_array_out_attributes(id_objs, array_ids);
            console.log(array_names);
            return {
                arrayNames: array_names,
                primaryKey: "id"
            };
        });


    });
}

function get_schema_rows(schemata, entity_type_id) {
    let rows = schemata.filter(s => {
        if (s.schema.entityTypeId != entity_type_id) {
            console.log(`Referenced entity ${s.name} of entity type ${s.schema.entityTypeId}`);
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


function get_out_attributes(c) {
    let schemata = c.PipelineInfo.transformationSchemata,
        entity_type_id = c.CustomOperation.entityTypeId;
    return get_schema_rows(schemata, entity_type_id);
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

function bind_array_cols_2_new_cols(attributes, new_csv_cols) {
    let binding = {},
        i = 0;
    new_csv_cols.map(n => {
        binding[n] = attributes[i];
        i = i + 1;
    });
    return binding;
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

function get_headers(schemata) {
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

    return attrs
}


function remove_duplicates(attributes, names) {
    names = attributes.concat(names);
    return names.map(n=>{
        return Array.from(new Set(n))
    })
}

function resolveArrayAttributesBySchemata(content) {
    let schemata = content.PipelineInfo.transformationSchemata,
        entity_type_id = content.CustomOperation.entityTypeId,
        attributes = get_referenced_entity_rules(schemata, entity_type_id),
        new_csv_cols = flatten(get_schema_rows(schemata, entity_type_id)),
        excel_headers = get_headers(schemata),
        binding = bind_array_cols_2_new_cols(attributes, new_csv_cols);


    //let attributes = get_schema_rows(schemata,entity_type_id);
    let obj_ids = get_main_entity_rules(schemata, entity_type_id);
    let ids = obj_ids.map(io => {
        return io.id
    });
    return get_attributes(ids).then(atts => {
        let array_ids = get_array_attributes(atts);
        let names = get_array_out_attributes(obj_ids, array_ids);
        names = names.filter(n => { if(n) return true;}).map(n=>{return [n]});

        console.log(names);
        return {
            arrayNames: remove_duplicates(attributes,names),
            primaryKey: "id",
            new_csv_cols: new_csv_cols,
            binding: binding,
            excel_headers: excel_headers
        };
    });

}

let checkOperationSettings = function (pipe_id, entity_type_id) {
    let url = sync_base_url + pipe_relative_url + pipe_id;
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


exports.checkOperationSettings = checkOperationSettings;
exports.resolveArrayAttributes = resolveArrayAttributes;
exports.resolveArrayAttributesBySchemata = resolveArrayAttributesBySchemata;