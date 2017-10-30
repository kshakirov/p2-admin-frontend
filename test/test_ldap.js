var ldap = require('ldapjs');
var client = ldap.createClient({
    url: 'ldap://10.1.3.23:8389'
});
client.bind('cn=admin,dc=PMD,dc=local', 'gogol,111', function(err) {
    console.log(err);
});

var opts = {
    filter: ('cn=pims'),
    scope: 'sub',
    attributes: []
};

let user_dn = null;

client.search('dc=PMD,dc=local', opts, function(err, res) {
    //console.log(res);

    res.on('searchEntry', function(entry) {
        console.log('entry: ') ;
        console.log(entry.object.dn);
        user_dn = entry.object.dn;
        check_user_password(user_dn);
    });
    res.on('searchReference', function(referral) {
        console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
        console.error('error: ' + err.message);
    });
    res.on('end', function(result) {
        console.log('status: ' + result.status);
    });
});




//cn=admin,dc=PMD,dc=local -b "dc=PMD,dc=local" -w gogol,111
function check_user_password(dn) {
    var userClient = ldap.createClient({
        url: 'ldap://10.1.3.23:8389'
    });
    userClient.bind(dn, "pims", function(err) {
        console.log("Error binding user");
        console.log(err);
    }, function (error) {
        console.log("Dfdfd")
    })
}
