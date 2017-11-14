// var XLSX = require('xlsx')
// var workbook = XLSX.readFile('../product_suppliers.xlsx');
// var sheet_name_list = workbook.SheetNames;
// var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
// console.log(xlData);

const fs = require('fs');
var ExcelReader = require('node-excel-stream').ExcelReader;
var ExcelWriter = require('node-excel-stream').ExcelWriter;
let dataStream = fs.createReadStream('../product_categories.xlsx');

function get_excell_fields(schema) {
    let rules = schema.mapping.schema.schema;
    return rules.map((rule) =>{
        return {
            name: rule.out,
            key: rule.out,
        }
    })
}

let schema = {
    "mapping": {
        "id": 35,
        "name": "Pims 2 Csv Product Category",
        "schema": {
            "schema": [{"out": "Id", "in": [{"uuid": "32", "path": "32.value"}]}, {
                "out": "name",
                "in": [{"uuid": "33", "path": "33.value"}]
            }, {"out": "complete_name", "in": [{"uuid": "34", "path": "34.value"}]}, {
                "out": "pc_name",
                "in": [{"uuid": "35", "path": "35.value.attributes.33.value"}]
            }, {"out": "pc_id", "in": [{"uuid": "35", "path": "35.value.attributes.32.value"}]}, {
                "out": "pc_complete_name",
                "in": [{"uuid": "35", "path": "35.value.attributes.34.value"}]
            }]
        },
        "customAttributes": {"dto": true, "entity": {"uuid": 7}}
    }
};

let headers = get_excell_fields(schema);


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