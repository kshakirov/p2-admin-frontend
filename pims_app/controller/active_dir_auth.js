let ActiveDirectory = require('activedirectory'),
    config = require('config'),
    pimsConfig = config.get('config'),
    ad_config = {
        url: pimsConfig.ldap.url,
        baseDN: pimsConfig.ldap.user.baseDN,
    },
    ad = new ActiveDirectory(ad_config),
    username = pimsConfig.ldap.user.name,
    password = pimsConfig.ldap.user.password;

function authenticate_active_directory(login, pass) {

    let opts = {
        bindDN: username,
        bindCredentials: password
    };
    ad.findUser(opts, login, function (err, user) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            return null;
        }
        if (!user) {
            console.log('User: ' + sAMAccountName + ' not found.');
            return false
        }
        else {
            console.log('Found User :' + JSON.stringify(user.sAMAccountName));
            ad.authenticate(user.userPrincipalName, pass, function (err, auth) {
                if (err) {
                    console.log('ERROR: ' + JSON.stringify(err));
                    return null;
                }
                if (auth) {
                    console.log(`Authenticated  By sAMAccountName [${user.sAMAccountName}]`);
                    return true;
                } else {
                    console.log('Authentication failed!');
                    return false;
                }
            });

        }
    })
}

exports.authenticate = authenticate_active_directory;
