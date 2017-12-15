let jwt = require('jsonwebtoken'),
    config = require('config'),
    cookie = require('cookie'),
    pimsConfig = config.get('config'),
    token_expiration = pimsConfig.ldap.tokenExpiration,
    token_secret = pimsConfig.ldap.secret;

function verify_token(token) {
    try {
        var decoded = jwt.verify(token, token_secret);
        return decoded;
    } catch (err) {
        return false;
    }
}

function get_token(headers) {
    let authorization = headers['authorization'];
    let token = "";
    if(!authorization){
        console.log(headers['cookie']);
        let cookies = cookie.parse(headers['cookie']);
        token =cookies.token;
        console.log(token);
    }else {
        token = authorization.split(" ");
        token = token[1]
    }
    return token;
}


function generate_token(data) {
    let token = jwt.sign(data, token_secret, {expiresIn: token_expiration});
    return token;
}


exports.getToken = get_token;
exports.verifyToken = verify_token;
exports.generateToken = generate_token;