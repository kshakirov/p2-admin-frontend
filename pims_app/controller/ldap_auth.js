let ldap = require('ldapjs'),
    config = require('config'),
    pimsConfig = config.get('config'),
    client = ldap.createClient({
        url: pimsConfig.ldap.url
    });


function check_user_password(user_dn, pass) {
    let userClient = ldap.createClient({
        url: pimsConfig.ldap.url
    });
    userClient.bind(user_dn, pass, function (err) {

        if (err == null) {
            console.log("Successfully Logged In");
            return true;
        }
        console.log("Error Logging In");
        return false;
    })
}

function authenticate(req, response) {
    let login = req.body.login,
        pass = req.body.pass,
        r = {
            user: false,
            pass: false
        };

    client.bind('cn=admin,dc=PMD,dc=local', 'gogol,111', function (err) {
        console.log("Binding As Admin ....");
    });

    var opts = {
        filter: (`cn=${login}`),
        scope: 'sub',
        attributes: []
    };

    client.search('dc=PMD,dc=local', opts, function (err, res) {
        let user_dn = false;
        if (err == null) {
            res.on('searchEntry', function (entry) {
                user_dn = entry.object.dn;
                if(check_user_password(user_dn, pass, response)){
                    user_dn = true;
                }
            });
            res.on('end', function (result) {
                if (user_dn) {
                    r.pass = true;
                    r.user = true;
                    response.json(r)
                }else{
                    response.send(401)
                }
            });
        } else {
            console.log(err)
        }
    });
}

exports.authenticate = authenticate;
