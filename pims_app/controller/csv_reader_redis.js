let fs = require('fs'),
    config = require('config'),
    pimsConfig = config.get('config'),
    redis = require("redis"),
    redisClient = redis.createClient(pimsConfig.redis.url),
    syncModuleTools = require('../controller/sync_module_tools'),
    currentRow = false,
    fileReaderUtils = require('../controller/file_reader_utils'),
    uuidv1 = require('uuid/v1'),
    csv = require("fast-csv");


function read_csv(content, attributes_data) {
    let filename = content.CustomOperation.args.filename,
        batch_size = content.CustomOperation.batchSize || 1500,
        fileName = pimsConfig.filesFolder.uploadPath + "/" + filename,
        rowNum = 0,
        batch = [];


    if (fs.existsSync(fileName)) {
        let stream = fs.createReadStream(fileName);
        console.log(`Parsing CSV  from ${fileName} started`);
        csv
            .fromStream(stream, {headers: true})
            .on("data", function (row) {
                batch = fileReaderUtils.foldTree(batch, row, attributes_data);
                if (batch.length >= batch_size) {
                    let cloned_batch = JSON.parse(JSON.stringify(batch));
                    fileReaderUtils.pushBatchToRedis(cloned_batch, content);
                    batch = [];
                }
                rowNum = rowNum + 1;
            })
            .on("error", function (error) {
                console.log(error)
            })
            .on("end", function () {
                console.log(`Parsing Finished, Pushing Remains of Data To Redis: ${batch.length} `);
                batch = fileReaderUtils.releaseCcurrentRow(batch, attributes_data);
                fileReaderUtils.pushBatchToRedis(batch, content);
                batch = [];
                fileReaderUtils.pushBatchToRedis(batch, content);
            });

    } else {
        console.log(`${fileName} Does Not Exist`)
    }
}


function has_schemata(content) {
    let schemata = content.PipelineInfo.transformationSchemata;
    if (schemata && schemata.length > 0)
        return true;
    return false;
}

function processCsv(message) {
    let content = JSON.parse(message.content.toString()),
        pipelineId = content.CustomOperation.pipelineId,
        operationId = uuidv1(),
        entityTypeId = content.CustomOperation.entityTypeId;
    content.CustomOperation.operationId = operationId;
    if (has_schemata(content)) {
        syncModuleTools.resolveArrayAttributesBySchemata(content).then(attributes_data => {
            read_csv(content, attributes_data);
        })
    } else {
        syncModuleTools.resolveArrayAttributes(pipelineId, entityTypeId).then(attributes_data => {
            console.log(attributes_data);
            read_csv(content, attributes_data)
        })
    }


}

exports.processCsv = processCsv;