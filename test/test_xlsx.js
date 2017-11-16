const fs = require('fs');
var ExcelReader = require('node-excel-stream').ExcelReader;
var ExcelWriter = require('node-excel-stream').ExcelWriter;
let dataStream = fs.createReadStream('../product_categories.xlsx'),
    headers = ['Id','name','complete_name','pc_name','pc_id','pc_complete_name'];

function get_excell_fields(headers) {
    return headers.map((header) => {
        return {
            name: header,
            key: header,
        }
    })
}



headers = get_excell_fields(headers);


let reader = new ExcelReader(dataStream, {
    sheets: [{
        name: 'Sheet1',
        rows: {
            headerRow: 1,
            allowedHeaders: headers
        }
    }]
});
console.log('starting parse');
reader.eachRow((rowData, rowNum, sheetSchema) => {
    console.log(rowNum);
    //console.log(rowData);
    return false;
})
    .then(() => {
        console.log('done parsing');
    });