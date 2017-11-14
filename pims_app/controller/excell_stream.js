const fs = require('fs');
var ExcelReader = require('node-excel-stream').ExcelReader;
var ExcelWriter = require('node-excel-stream').ExcelWriter;

function get_excell_fields(schema) {
    let rules = schema.mapping.schema.schema;
    return rules.map((rule) => {
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


function create_reader(headers) {
    let dataStream = fs.createReadStream('product_categories.xlsx');
    let reader = new ExcelReader(dataStream, {
        sheets: [{
            name: 'Sheet1',
            rows: {
                headerRow: 1,
                allowedHeaders: headers
            }
        }]
    });
    return reader;
}


function stream_xlxs(req, res) {
    let schema = req.body.schema;
    let headers = get_excell_fields(schema),
        reader = create_reader(headers),
        start = parseInt(req.body.start) || 0,
        pagination = {
            last: 0,
            start: 0,
            next: 0,
            results: []
        },
        pageSize = parseInt(req.body.pageSize) || 1500;

    pagination.start = start;
    console.log('starting parse');
    reader.eachRow((rowData, rowNum, sheetSchema) => {
        pagination.last += 1;
        if (rowNum >= start + 1 && rowNum < start + pageSize + 1) {
            console.log(rowNum);
            pagination.results.push(rowData);
        }
        if (rowNum == start + pageSize + 1) {
            pagination.next = rowNum - 1;
        }

    })
        .then(() => {
            console.log('done parsing');
            res.json(pagination);
        });

}

exports.streamXlxs = stream_xlxs;