let token_tools = require('./tokenTools'),
    restClient = require('node-rest-client-promise').Client(),
    unauthorized_url = "/rest/security/unauthorized",
    config = require('config'),
    pimsConfig = config.get('config'),
    userManagmentServer = pimsConfig.userManagementServer;


function get_resource(url) {
    let segments = url.split('/');
    return segments[2];
}

function get_permission(method) {
    let methods_2_permissions_map = {
        GET: 2,
        POST: 1,
        DELETE: 3,
        PUT: 4
    };
    return methods_2_permissions_map[method]
}

function get_role(user) {
    return user.roles.join(',')
}

function create_request_url(roleIds, moduleId, externalResourceId, permissionId) {
    return `/rest/security/${roleIds}/${moduleId}/${externalResourceId}/${permissionId}`
}


function proxyReqPathResolver(req) {
    let token = token_tools.getToken(req.headers),
        user = token_tools.verifyToken(token),
        method = req.method,
        url = require('url').parse(req.url).path;
    if (user && user.admin) {
        url = "/rest" + url;
        return url;
    }
    else if (user && user.roles.length > 0) {
        let externalResourceId = get_resource(url),
            moduleId = 1,
            roleIds = get_role(user),
            permissionId = get_permission(method);
        let relative_url = create_request_url(roleIds, moduleId, externalResourceId, permissionId);
        console.log(relative_url);
        return restClient.getPromise(userManagmentServer.url + relative_url).then((r, d) => {
            console.log(r.data);
            if (r.data == true && r.response.statusCode == 200) {
                url = "/rest" + url;
                return url;
            } else {
                return unauthorized_url;
            }
        }, (e) => {
            console.log(e.message)
        })
    } else {
        return unauthorized_url;
    }

}

exports.proxyReqPathResolver = proxyReqPathResolver;