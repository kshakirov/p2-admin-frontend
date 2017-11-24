const fs = require('fs');
var ExcelReader = require('node-excel-stream').ExcelReader;
var ExcelWriter = require('node-excel-stream').ExcelWriter;

function get_excell_fields(headers) {
    return headers.map((header) => {
        return {
            name: header,
            key: header,
        }
    })
}


function create_reader(headers, filename) {
    let dataStream = fs.createReadStream(filename);
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
    let headers = get_excell_fields(req.body.headers),
        filename = req.params.filename,
        reader = create_reader(headers, filename),
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
            pagination.results.push(rowData);
        }
        if (rowNum == start + pageSize + 1) {
            pagination.next = rowNum - 1;
        }

    })
        .then(() => {
            console.log('done parsing');
            res.json(pagination);
        }, e => {
            res.sendStatus(500);
        });

}

exports.streamXlxs = stream_xlxs;