let fs = require('fs'),
    config = require('config'),
    pimsConfig = config.get('config'),
    csvWriter = require('csv-write-stream'),
    json2csv = require('json2csv'),
    writer = csvWriter();


function convert_body_2_data(body) {
    let data = {},
        keys = Object.keys(body);
    keys.forEach((k) => {
        data[k] = body[k];
    });
    return data;
}


function get_fields(body) {
    return Object.keys(body[0])
}


function writeCsv(req, res) {
    let fileName = req.params.filename,
        data = req.body;
    fileName = pimsConfig.filesFolder.path + "/" + fileName;
    let fields = get_fields(req.body);
    if (!fs.existsSync(fileName)) {
        console.log(`Created Filename ${fileName}`);
        writer = csvWriter({headers: fields});
        writer = csvWriter({sendHeaders: true});
    } else {
        console.log(`Appended Filename ${fileName}`);
        writer = csvWriter({sendHeaders: false});
    }

    writer.pipe(fs.createWriteStream(fileName, {flags: 'a'}));
    data.map(function (d) {
        writer.write(d);
    });
    writer.end();
    res.json({result: true})
}

function deleteCsv(req, res) {
    let fileName = req.params.filename;
    fileName = pimsConfig.filesFolder.path + "/" + fileName;
    if (fs.existsSync(fileName)) {
        console.log(`File Exists ${fileName}`);
        fs.unlinkSync(fileName);
    } else {
        console.log(`File  ${fileName} Does Not Exist`);

    }
    res.sendStatus(200);

}

exports.writeCsv = writeCsv;
exports.deleteCsv = deleteCsv;