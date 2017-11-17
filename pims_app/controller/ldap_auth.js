let config = require('config'),
    pimsConfig = config.get('config'),
    admin_path = pimsConfig.ldap.admin.path,
    admin_pass = pimsConfig.ldap.admin.pass,
    tokenTools = require('../proxy/tokenTools'),
    restClient = require('node-rest-client-promise').Client(),
    url = pimsConfig.userManagementServer.url + "/rest/users/login",
    LdapClient = require('promised-ldap');


let client = new LdapClient({
    url: pimsConfig.ldap.url
});


function authenticate_ldap(request, response) {
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


function create_token_data(data) {
    return {
        name: data.login,
        admin: data.admin,
        roles: data.roles.map(function (r) {
            return r.id;
        })
    }
}

function authenticate(req, res) {

    let args = {
            data: {login: req.body.login, password: req.body.pass},
            headers: {"Content-Type": "application/json"}
        },
        auth_data = {
            login: req.body.login,
            token: null
        }

    restClient.postPromise(url, args).catch((e) => {
        console.log(e);
        res.send(401)
    }).then((response) => {
        if(response.data.status=== 401){
            console.log("Failed");
            res.send(401)
        }else {
            auth_data.token = create_token_data(response.data);
            console.log(auth_data);
            auth_data.token = tokenTools.generateToken(auth_data.token);
            console.log(auth_data);
            res.json(auth_data)
        }
    })
}

exports.authenticate = authenticate;
