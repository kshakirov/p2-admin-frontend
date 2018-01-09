let fs = require('fs');

let csv = require("fast-csv");
let stream = fs.createReadStream("../files/products.csv");

//let start = parseInt(req.body.start) || 0,
    let start =  0,
    pagination = {
        last: 0,
        start: 0,
        next: 0,
        results: []
    },
    //pageSize = parseInt(req.body.pageSize) || 1500;
    pageSize = 10;

pagination.start = start;
console.log('starting parse');
let rowNum =0;


csv
    .fromStream(stream, {headers : true})
    .on("data", function(data){
        pagination.last += 1;
        if (rowNum >= start + 1 && rowNum < start + pageSize + 1) {
            pagination.results.push(data);
        }
        if (rowNum == start + pageSize + 1) {
            pagination.next = rowNum - 1;
        }
        if(rowNum>=start + pageSize + 1){
            console.log(rowNum);
            console.log("Exit");
            this.emit('end');
            process.exit();
        }

        rowNum = rowNum +1;
        //console.log(rowNum);
    })
    .on("end", function(){
        console.log("done");
        console.log(pagination)
    });
