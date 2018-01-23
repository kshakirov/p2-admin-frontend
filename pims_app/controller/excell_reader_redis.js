const fs = require('fs');
let ExcelReader = require('node-excel-stream').ExcelReader,
    config = require('config'),
    pimsConfig = config.get('config'),
    syncModuleTools = require('../controller/sync_module_tools'),
    fileReaderUtils = require('../controller/file_reader_utils'),
    uuidv1 = require('uuid/v1');

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



function read_xlxs(content, attributes_data) {
    let headers = get_excell_fields(attributes_data.excel_headers),
        filename = content.CustomOperation.args.filename,
        batch_size = content.CustomOperation.batchSize || 1500,
        fileName = pimsConfig.filesFolder.uploadPath + "/" + filename,
        rowNum = 0,
        batch = [],
        reader = create_reader(headers, fileName);

    reader.eachRow((rowData, rowNum, sheetSchema) => {
        batch = fileReaderUtils.foldTree(batch, rowData, attributes_data);
        if (batch.length >= batch_size) {
            let cloned_batch = JSON.parse(JSON.stringify(batch));
            fileReaderUtils.pushBatchToRedis(cloned_batch, content);
            batch = [];
        }
        rowNum = rowNum + 1;

    })
        .then(() => {
            console.log(`Parsing Finished, Pushing Remains of Data To Redis: ${batch.length} `);
            batch = fileReaderUtils.releaseCcurrentRow(batch, attributes_data);
            fileReaderUtils.pushBatchToRedis(batch, content);
            batch = [];

        }, e => {
            console.log(e.message);
            fileReaderUtils.clean();
        });

}


function has_schemata(content) {
    let schemata = content.PipelineInfo.transformationSchemata;
    if (schemata && schemata.length > 0)
        return true;
    return false;
}

function processExcel(message) {
    let content = JSON.parse(message.content.toString()),
        pipelineId = content.CustomOperation.pipelineId,
        operationId = uuidv1(),
        entityTypeId = content.CustomOperation.entityTypeId;
    content.CustomOperation.operationId = operationId;
    if (has_schemata(content)) {
        syncModuleTools.resolveArrayAttributesBySchemata(content).then(attributes_data => {
            read_xlxs(content,attributes_data)
        })
    } else {
        syncModuleTools.resolveArrayAttributes(pipelineId, entityTypeId).then(attributes_data => {
            read_xlxs(content,attributes_data)
        })
    }
}

exports.processExcel = processExcel;