let metadataConnection = require('./metadata_connection'),
    syncConnection = require('./sync_connection'),
    queryMetadata = "TRUNCATE entity",
    querySync = "TRUNCATE golden_source_audit_journal CASCADE; " +
        "TRUNCATE openerp_audit_journal CASCADE ;" +
        "TRUNCATE golden_source_audit_journal CASCADE ;"

const metadataDb = metadataConnection.connectMetadata(),
    syncDb = syncConnection.connectSync();


metadataDb.any(queryMetadata).then(r =>{
    console.log(`Query [${queryMetadata}] Successfully Executed`)
}, e =>{

});


syncDb.any(querySync).then(r =>{
    console.log(`Query [${querySync}] Successfully Executed`)
}, e =>{

});