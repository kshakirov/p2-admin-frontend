const pgp = require('pg-promise')();
let config = require('config'),
    pimsConfig = config.get('config'),
    metadataDb = pimsConfig.postgres.metadata;

const cn = {
    host: metadataDb.host,
    port: metadataDb.port,
    database: metadataDb.database,
    user: metadataDb.user,
    password: metadataDb.password
};

const db = pgp(cn);

let entity_type_id = 14,
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



