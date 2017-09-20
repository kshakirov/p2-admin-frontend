let Client  = require('node-rest-client').Client;
let client = new Client(),
    times = 10000,
    url= 'http://localhost:3004/control/csv/write',
    rows = [];

for(let i=0;i<times;i++){
    rows.push({
        data: {
            name: `name ${i}`,
            id: i
        }, filename: "test.csv"
    })
}

rows.forEach((r)=>{
    var args = {
        data: r,
        headers: { "Content-Type": "application/json" }
    };
    client.post(url, args, function (data, response) {
        console.log(data);
    });
})
