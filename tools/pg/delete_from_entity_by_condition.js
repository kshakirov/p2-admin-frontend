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


db.any(`DELETE   FROM entity WHERE entitytypeid = $1`, [entity_type_id]);


