let fs = require('fs');
let CsvReadableStream = require('csv-reader');

let inputStream = fs.createReadStream('../files/product_uoms.csv', 'utf8');
//let start = parseInt(req.body.start) || 0,
    let start =  0,
    pagination = {
        last: 0,
        start: 0,
        next: 0,
        results: []
    },
    //pageSize = parseInt(req.body.pageSize) || 1500;
    pageSize = 1500;

pagination.start = start;
console.log('starting parse');
let rowNum =0;
inputStream
    .pipe(CsvReadableStream({parseNumbers: true, parseBooleans: true, trim: true}))
    .on('data', function (row) {
        pagination.last += 1;

        if (rowNum >= start + 1 && rowNum < start + pageSize + 1) {
            pagination.results.push(row);
        }
        if (rowNum == start + pageSize + 1) {
            pagination.next = rowNum - 1;
        }

        rowNum = rowNum +1;
    })
    .on('end', function (data) {
        console.log('No more rows!');
        console.log(pagination)
    });
