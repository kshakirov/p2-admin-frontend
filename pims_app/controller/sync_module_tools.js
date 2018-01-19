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


function resolveArrayAttributesBySchemata(content) {
    let schemata = content.PipelineInfo.transformationSchemata,
        entity_type_id = content.CustomOperation.entityTypeId;
    let attributes = get_schema_rows(schemata,entity_type_id);
    let obj_ids = get_main_entity_rules(schemata,entity_type_id);
    let ids = obj_ids.map(io =>{return io.id});
    return get_attributes(ids).then(atts =>{
        let array_ids =get_array_attributes(atts);
        let names  = get_array_out_attributes(obj_ids,array_ids);
        names = names.map(n=>{return [n]});
        console.log(names);
        return {
            arrayNames: attributes.concat(names),
            primaryKey: "id"
        };
    });

}

exports.resolveArrayAttributes = resolveArrayAttributes;
exports.resolveArrayAttributesBySchemata = resolveArrayAttributesBySchemata;