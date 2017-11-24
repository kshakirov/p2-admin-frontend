let restClient = require('node-rest-client-promise').Client(),
    userManagmentServer = {url: "http://10.1.3.23:9090"},
    search_url = userManagmentServer.url + "/rest/users/findByLogin/",
    url = userManagmentServer.url + "/rest/users/login";




function is_external_authentication(user) {
    return user.properties.external_authentication;
}


function find_user(req, res) {
    let login = req.body.login;
    restClient.getPromise(search_url + login).catch((e) => {
        res.send(401)
    }).then((response) => {
        if (response.data.hasOwnProperty("id")) {
            console.log(response.data.id);
            if(is_external_authentication(response.data)){
                console.log("External")
            }else{
                console.log("Internal")
            }
        } else {
            res.send(401)
        }
    })
}


let req = {
        body: {
            login: "kshakirov"
        }
    },
    res = {send: function (status) {
        console.log(status)
    }};

find_user(req, res);



