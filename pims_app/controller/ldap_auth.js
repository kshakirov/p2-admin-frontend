let config = require('config'),
    pimsConfig = config.get('config'),
    admin_path = pimsConfig.ldap.admin.path,
    admin_pass = pimsConfig.ldap.admin.pass,
    tokenTools = require('../proxy/tokenTools'),
    LdapClient = require('promised-ldap');
client = new LdapClient({
    url: pimsConfig.ldap.url
});


function authenticate(request, response) {
    client.bind(admin_path, admin_pass).then(function (result) {
        console.log("Binding as Admin To Search");
    });
    let login = request.body.login,
        pass = request.body.pass,
        r = {
            login: null,
            token: null
        };

    var opts = {
        filter: (`cn=${login}`),
        scope: 'sub',
        attributes: []
    };

    let user_dn = null;


    client.search('dc=PMD,dc=local', opts).then(function (results) {
        if (results.entries.length > 0) {
            results.entries.forEach(function (result) {
                let cn = result.object.cn;
                console.log(result.object.dn);
                client.bind(result.object.dn, pass).then(function (auth) {
                    console.log("User Found ...");
                    r.token = tokenTools.generateToken(cn);
                    response.json(r);
                }, function (error) {
                    response.send(401)
                })
            })
        } else {
            response.send(401)
        }
    }, function (error) {
        response.send(401)
    });

}

exports.authenticate = authenticate;
