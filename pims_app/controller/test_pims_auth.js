let    client = require('node-rest-client-promise').Client();
let url = "http://10.1.1.71:9090/rest/users/login";

function create_token_data(data) {
    return {
        name: data.login,
        admin: data.admin,
        roles: data.roles.map(function (r) {
            return r.id;
        })
    }
}


let args = {
    data: { login: "kshakirov", password: "test" },
    headers: { "Content-Type": "application/json" }
};

client.postPromise(url,args).then((data)=>{
    let token_data = create_token_data(data.data);
    console.log(token_data);
},(e)=>{
    console.log(e)
})