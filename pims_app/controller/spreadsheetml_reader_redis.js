const fs = require('fs');
let ExcelReader = require('node-excel-stream').ExcelReader,
    XLSX = require('xlsx'),
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


function read_worksheet_to_json_list(filename, worksheet = 'Line Items') {
    let workbook = XLSX.readFile(filename);
    return XLSX.utils.sheet_to_json(workbook.Sheets[worksheet]);

}


function read_xlxs(content, attributes_data) {

    let filename = content.CustomOperation.args.filename,
        batch_size = content.CustomOperation.batchSize || 1500,
        fileName = pimsConfig.filesFolder.uploadPath + "/" + filename,
        rowNum = 0,
        batch = [],
        list = read_worksheet_to_json_list(fileName);

    list.forEach(row => {
        batch = fileReaderUtils.foldTree(batch, row, attributes_data);
        if (batch.length >= batch_size) {
            let cloned_batch = JSON.parse(JSON.stringify(batch));
            fileReaderUtils.pushBatchToRedis(cloned_batch, content);
            batch = [];
        }
        rowNum = rowNum + 1;

    });

    console.log(`Parsing Finished, Pushing Remains of Data To Redis: ${batch.length} `);
    batch = fileReaderUtils.releaseCcurrentRow(batch, attributes_data);
    fileReaderUtils.pushBatchToRedis(batch, content);
    batch = [];


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
            read_xlxs(content, attributes_data)
        })
    } else {
        syncModuleTools.resolveArrayAttributes(pipelineId, entityTypeId).then(attributes_data => {
            read_xlxs(content, attributes_data)
        })
    }
}

exports.processExcel = processExcel;