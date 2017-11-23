let ActiveDirectory = require('activedirectory'),
    config = {
        url: 'ldap://ldap.pmdistributing.com',
        baseDN: 'cn=Users,dc=PMD,dc=local',
    },
    ad = new ActiveDirectory(config),
    user = 'kshakirov',
    username = 'kshakirov@PMD.local',
    password = '6AMPWVhDobB2';

function authenticate_by_samaccount_name(login, pass) {
    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (auth) {
            console.log('Authenticated...');

            var opts = {
                bindDN: username,
                bindCredentials: password
            };
            ad.findUser(opts, login, function (err, user) {
                if (err) {
                    console.log('ERROR: ' +JSON.stringify(err));
                    return null;
                }
                if (! user) {
                    console.log('User: ' + sAMAccountName + ' not found.')
                    return false
                }
                else {
                    console.log('Found User :' + JSON.stringify(user.sAMAccountName));
                    ad.authenticate(user.userPrincipalName, pass, function (err, auth) {
                        if(err){
                            console.log('ERROR: ' + JSON.stringify(err));
                            return null;
                        }
                        if(auth){
                            console.log(`Authenticated  By sAMAccountName [${user.sAMAccountName}]`);
                            return true;
                        }else {
                            console.log('Authentication failed!');
                            return false;
                        }
                    });

                }
            })
        }
        else {
            console.log('Authentication failed!');
        }
    });
}

let result  = authenticate_by_samaccount_name('kshakirov','6AMPWVhDobB2');
console.log(result)

