let fs = require('fs'),
    config = require('config'),
    pimsConfig = config.get('config'),
    csv = require("fast-csv");


function readCsv(req, res) {
    let start = parseInt(req.body.start) || 0,
        pagination = {
            last: 0,
            start: 0,
            next: 0,
            results: []
        },
        fileName = req.params.filename,
        pageSize = parseInt(req.body.pageSize) || 1500;

    pagination.start = start;
    fileName = pimsConfig.filesFolder.uploadPath + "/" + fileName;
    let stream = fs.createReadStream(fileName);
    console.log(`Parsing CSV  from ${fileName} started`);
    let rowNum = 0;

    csv
        .fromStream(stream, {headers: true})
        .on("data", function (data) {
            pagination.last += 1;
            if (rowNum >= start + 1 && rowNum < start + pageSize + 1) {
                pagination.results.push(data);
            }
            if (rowNum == start + pageSize + 1) {
                pagination.next = rowNum - 1;
            }

            if(rowNum>=start + pageSize + 1){
                //console.log(`Ready to exit ${rowNum} `);
                stream.destroy();
                this.emit("end");
            }

            rowNum = rowNum + 1;
        })
        .on("end", function () {
            console.log("End is caught");
            stream.destroy();
            res.json(pagination);
            console.log("Life after death")
        });

}

exports.readCsv = readCsv;