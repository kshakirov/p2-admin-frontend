let jwt = require('jsonwebtoken'),
    config = require('config'),
    pimsConfig = config.get('config'),
    token_expiration = pimsConfig.ldap.tokenExpiration,
    token_secret = pimsConfig.ldap.secret;

function verify_token(token) {
    try {
        var decoded = jwt.verify(token, token_secret);
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


function generate_token(name) {
    let token = jwt.sign({user: name}, token_secret, {expiresIn: token_expiration});
    return token;
}


exports.getToken = get_token;
exports.verifyToken = verify_token;
exports.generateToken = generate_token;