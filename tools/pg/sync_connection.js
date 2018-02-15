const pgp = require('pg-promise')();
let config = require('config'),
    pimsConfig = config.get('config'),
    syncDb = pimsConfig.postgres.syncModule;

const cn = {
    host: syncDb.host,
    port: syncDb.port,
    database: syncDb.database,
    user: syncDb.user,
    password: syncDb.password
};

function connect_sync() {
    const db = pgp(cn);
    return db;
}


exports.connectSync = connect_sync;