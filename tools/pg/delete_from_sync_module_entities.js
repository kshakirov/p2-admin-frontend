let syncConnection = require('./sync_connection');

const db = syncConnection.connectSync();

let entity_type_id = process.argv[2].toString(),
    tables = ['golden_source_audit_journal', 'amazon_audit_journal', 'openerp_audit_journal'];


let queries = tables.map(t => {
    return db.any(`DELETE  FROM ${t} WHERE entity_type_id = $1`, [entity_type_id])
});

Promise.all(queries).then(rs => {
    let responses = rs.map(rr => {
        return rr.map(r => {
            return r.pims_id
        })
    });
    console.log(responses)
}, e => {
    console.log(e)
});



