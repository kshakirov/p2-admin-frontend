let fs = require('fs'),
    csvWriter = require('csv-write-stream'),
    converter = require('json-2-csv'),
    writer = csvWriter();


function writeCsv(req, res) {
    let fileName = req.body.filename,
        data = req.body.data;

    if (!fs.existsSync(fileName))
        writer = csvWriter({headers: Object.keys(data)});
    else
        writer = csvWriter({sendHeaders: false});

    writer.pipe(fs.createWriteStream(fileName, {flags: 'a'}));
    writer.write(data);
    writer.end();
    res.json({result: true})
}

exports.writeCsv = writeCsv;