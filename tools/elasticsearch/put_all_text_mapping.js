let elasticsearch = require('elasticsearch'),
    config = require('config'),
    pimsConfig = config.get('config'),
    restClient = require('node-rest-client-promise').Client(),
    elastic_index = pimsConfig.elasticSearch.indexName,
    metadataUrl = pimsConfig.metadataServer.url,
    entity_type_url = '/rest/entity-types',
    attribute_url_segemnts = ['/rest/entity-types/', '/attributes'],
    flatten = require('array-flatten'),
    client = new elasticsearch.Client({
        host: pimsConfig.elasticSearch.url,
        log: 'trace'
    });


function add_mapping(body, id) {
    let attribute = id.toString();
    body.properties[attribute] = {
        type: "string",
        analyzer: "pims_analyzer"
    };
}

function create_elastic_mapping_req(type) {
    let body = {properties: {}};

    let requestParams = {
        index: elastic_index,
        type: type,
        body
    };

    return requestParams;
}


restClient.getPromise(metadataUrl + entity_type_url).catch((e) => {
    console.log("Cannot connect")
}).then((response) => {
    if (response.data.status === 401) {
        console.log("Authentication failed")
    } else {
        //console.log(response.data);
        let e_types = response.data;
        e_types = e_types.map(et => {
            return et.uuid;
        });
        console.log(e_types);
        let promises = e_types.map(uuid => {
            return restClient.getPromise(metadataUrl + attribute_url_segemnts[0] + uuid.toString() + attribute_url_segemnts[1])
        });
        Promise.all(promises).then(ps => {
            let attributes = ps.map(p => {
                return p.data;
            });
            attributes = attributes.map(attr => {
                let as = attr.filter(a => {
                    return a.valueType.toLowerCase() == 'string'
                });
                return as.map(a => {
                    return {
                        type: a.entityTypeId,
                        id: a.uuid
                    }
                })
            });
            attributes = attributes.filter(a => {
                if (a.length > 0) {
                    return a
                }
            });

            let attr_promises = attributes.map(a => {
                let request = create_elastic_mapping_req(a[0].type);
                a.map(aa =>{
                    add_mapping(request.body, aa.id)
                });
                return client.indices.putMapping(request);

            });
            Promise.all(attr_promises).then(ps =>{
                console.log(ps)
            },err =>{
                console.log(err)
            })
            //console.log(JSON.stringify(attr_promises, null, 2));

        }, err => {
            console.log(err)
        });

    }
});
