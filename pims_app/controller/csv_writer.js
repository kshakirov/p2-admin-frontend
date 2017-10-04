let fs = require('fs'),
    csvWriter = require('csv-write-stream'),
    converter = require('json-2-csv'),
    writer = csvWriter();


function convert_body_2_data(body) {
    let data = {},
        keys = Object.keys(body);
    keys.forEach((k)=>{
        data[k] = body[k];
    })
    return data;
}


function writeCsv(req, res) {
    let fileName = req.params.filename,
        data = convert_body_2_data(req.body);

    if (!fs.existsSync(fileName)) {
        console.log( `Created Filename ${fileName}`);
        writer = csvWriter({headers: Object.keys(data)});
    } else {
        console.log( `Appended Filename ${fileName}`);
        console.log(data);
        writer = csvWriter({sendHeaders: false});
    }

    writer.pipe(fs.createWriteStream(fileName, {flags: 'a'}));
    writer.write(data);
    writer.end();
    res.json({result: true})
}

exports.writeCsv = writeCsv;