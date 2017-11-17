restClient = require('node-rest-client-promise').Client(),
    unauthorized_url = "/rest/security/unauthorized",
    user = {roles: [3]},
    url = "/entity-types/7/entities/page/0?size=10",
    userManagmentServer = {url: "http://10.1.1.71:9090" + ""};


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
   return  user.roles.join(',')
}

function create_request_url(roleIds, moduleId, externalResourceId , permissionId) {
    return `/rest/security/${roleIds}/${moduleId}/${externalResourceId}/${permissionId}`
}

function is_user_authorized(user, url, method) {
    let externalResourceId = get_resource(url),
        moduleId = 1,
        roleIds= get_role(user),
        permissionId= get_permission(method);
    let relative_url = create_request_url(roleIds,moduleId,externalResourceId,permissionId);

    return restClient.getPromise(userManagmentServer.url + relative_url).then((r) => {
        console.log(r.data);
        if(r.data) {

            url = "/rest" + url;
            return url;
        }else{
            return unauthorized_url;
        }
    })

}

is_user_authorized(user,url, 'DELETE');