let token_tools = require('./tokenTools');


function proxyReqPathResolver(req) {
    let token = token_tools.getToken(req.headers),
        user = token_tools.verifyToken(token),
        url = require('url').parse(req.url).path;

    if (user) {
        url = "/sync-module" + url;
        return url;
    } else {
        return url
    }

}

exports.proxyReqPathResolver = proxyReqPathResolver;