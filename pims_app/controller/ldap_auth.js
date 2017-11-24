let config = require('config'),
    pimsConfig = config.get('config'),
    tokenTools = require('../proxy/tokenTools'),
    restClient = require('node-rest-client-promise').Client(),
    url = pimsConfig.userManagementServer.url + "/rest/users/login";

let ActiveDirectory = require('activedirectory'),
    ad_config = {
        url: pimsConfig.ldap.url,
        baseDN: pimsConfig.ldap.user.baseDN,
    },
    ad = new ActiveDirectory(ad_config),
    username = pimsConfig.ldap.user.name,
    password = pimsConfig.ldap.user.password;


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
        res.send(401)
    }).then((response) => {
        if (response.data.status === 401) {
            res.send(401)
        } else {
            auth_data.token = create_token_data(response.data);
            auth_data.token = tokenTools.generateToken(auth_data.token);
            res.json(auth_data)
        }
    })
}


function authenticate_active_directory(req, res) {
    let login = req.body.login,
        pass = req.body.password;

    let opts = {
        bindDN: username,
        bindCredentials: password
    };
    ad.findUser(opts, login, function (err, user) {
        if (err) {
            res.sendStatus(401)
        }
        if (!user) {
            res.sendStatus(401)
        }
        else {
            ad.authenticate(user.userPrincipalName, pass, function (err, auth) {
                if (auth) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(401)
                }
            });

        }
    })
}


exports.authenticate = authenticate;
