let Client = require('node-rest-client').Client;
let client = new Client(),
    times = 10,
    url = 'http://localhost:3004/control/csv/write/test.csv/1',
    rows = [];

for (let i = 0; i < times; i++) {
    rows.push({
        data: {
            name: `name ${i}`,
            id: i,
            description: `description ${i}`

        }
    })
}


var args = {
    data: rows,
    headers: {"Content-Type": "application/json"}
};
// client.post(url, args, function (data, response) {
//     console.log(data);
//     console.log(response.status)
// });



var json2csv = require('json2csv');
var fields = ['car', 'price', 'color'];
var myCars = [
    {
        "car": "Audi",
        "price": 40000,
        "color": "blue"
    }, {
        "car": "BMW",
        "price": 35000,
        "color": "black"
    }, {
        "car": "Porsche",
        "price": 60000,
        "color": "green"
    }
];
var csv = json2csv({ data: myCars, fields: fields });
console.log(csv);