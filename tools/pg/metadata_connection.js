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


function connect_metadata() {
    const db = pgp(cn);
    return db;
}



exports.connectMetadata = connect_metadata;