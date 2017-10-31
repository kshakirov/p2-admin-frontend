var LdapClient = require('promised-ldap');
var client = new LdapClient({
    url: 'ldap://10.1.3.23:8389'
});
client.bind('cn=admin,dc=PMD,dc=local', 'gogol,111').then(function(result) {
    console.log("bound");
});

var opts = {
    filter: ('cn=pims'),
    scope: 'sub',
    attributes: []
};

let user_dn = null;

client.search('dc=PMD,dc=local', opts).then( function(res) {
    if(res.entries.length > 0) {
        res.entries.forEach(function (result) {
            console.log(result.object.dn);
            client.bind(result.object.dn, "pims").then(function (reslut) {
                console.log("Bound");
            }, function (error) {
                console.log("Not logged in")
            })
        })
    }else{
        console.log("No such a user")
    }
});






