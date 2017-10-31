let jwt = require('jsonwebtoken'),
    config = require('config'),
    pimsConfig = config.get('config'),
    ldap_secret = pimsConfig.ldap.secret;

function verify_token(token) {
    try {
        var decoded = jwt.verify(token, ldap_secret);
        return decoded.user;
    } catch (err) {
        return false;
    }
}

function get_token(headers) {
    let authorization = headers['authorization'];
    let token = authorization.split(" ");
    return token[1];
}

exports.getToken = get_token;
exports.verifyToken = verify_token;