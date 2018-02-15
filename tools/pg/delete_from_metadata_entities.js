let metadataConnection = require('./metadata_connection');

const db = metadataConnection.connectMetadata();

let entity_type_id = process.argv[2].toString(),
    tables = ['entity'];


let queries = tables.map(t => {
    return db.any(`DELETE   FROM ${t} WHERE entitytypeid = $1`, [entity_type_id])
});

Promise.all(queries).then(rs => {
    let responses = rs.map(rr => {
        return rr.map(r => {
            return r.id
        })
    });
    console.log(responses)
}, e => {
    console.log(e)
});


