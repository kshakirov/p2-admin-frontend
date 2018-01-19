let fs = require('fs'),
    config = require('config'),
    pimsConfig = config.get('config'),
    redis = require("redis"),
    redisClient = redis.createClient(pimsConfig.redis.url),
    syncModuleTools = require('../controller/sync_module_tools'),
    currentRow = false,
    uuidv1 = require('uuid/v1');
csv = require("fast-csv");


function push_batch_to_redis(batch, content) {
    console.log(`Pushed to Redis ${batch.length} rows`);
    content.Entities = batch;
    // redisClient.rpush(["fileList", JSON.stringify(content)], function (err, reply) {
    //     if (err) {
    //         console.log("Error");
    //         console.log(err)
    //     }
    //     if (reply) {
    //         console.log(JSON.parse(reply));
    //     } else {
    //         console.log("undefined reply");
    //     }
    // })
}


function has_array_attributes(attributesData) {
    return attributesData.hasOwnProperty('arrayNames') && attributesData.arrayNames.length > 0

}

function set_current_row(row, attributesData) {
    currentRow = JSON.parse(JSON.stringify(row));
    attributesData.arrayNames.map(aa => {
        aa.map(a =>{
            currentRow[a] = [];
        })
    })
}

function get_current_row() {
    return currentRow;
}

function release_current_row(batch) {
    if (currentRow)
        batch.push(currentRow);
    return batch;
}

function update_current_row(attributesData, row) {
    let not_empty_keys = attributesData.arrayNames.filter(a => {
        let found = a.find(f=>{
            if(row.hasOwnProperty(f) && row[f].length > 0){
                return f;
            }
        });
        if(found)
            return a;
        return false;
    });
    not_empty_keys.map(kk =>{
        kk.map(k=>{
            currentRow[k].push(row[k]);
        })
    });
}


function fold_tree(batch, row, attributesData) {
    if (has_array_attributes(attributesData)) {
        if (batch.length == 0 && !currentRow) {
            console.log("First Row, Saving ...");
            set_current_row(row, attributesData);
        } else if (batch.length == 0 && currentRow) {
            if (currentRow[attributesData.primaryKey] == row[attributesData.primaryKey]) {
                console.log("Row Ids Are Equal, folding ...");
                update_current_row(attributesData, row)
            } else {
                console.log("Row Ids Differ, Releasing The Container, keeping current");
                batch.push(get_current_row());
                set_current_row(row, attributesData);
            }
        } else if (batch.length > 0) {
            if (currentRow[attributesData.primaryKey] == row[attributesData.primaryKey]) {
                console.log("Row Ids Are Equal, folding ...");
                update_current_row(attributesData, row)
            } else {
                console.log("Row Ids Differ, Releasing The Container, keeping current");
                batch.push(get_current_row());
                set_current_row(row, attributesData);
            }
        }
    }
    else {
        batch.push(row);
    }

    return batch;
}


function read_csv(content, attributes_data) {
    let filename = content.CustomOperation.args.filename,
        batch_size = content.CustomOperation.batchSize || 1500,
        fileName = pimsConfig.filesFolder.uploadPath + "/" + filename,
        rowNum = 0,
        batch = [],
        stream = fs.createReadStream(fileName);
    console.log(`Parsing CSV  from ${fileName} started`);
    csv
        .fromStream(stream, {headers: true})
        .on("data", function (row) {
            batch = fold_tree(batch, row, attributes_data);
            if (batch.length >= batch_size) {
                let cloned_batch = JSON.parse(JSON.stringify(batch));
                push_batch_to_redis(cloned_batch, content);
                batch = [];
            }

            rowNum = rowNum + 1;
        })
        .on("end", function () {
            console.log(`Parsing Finished, Pushing Remains of Data To Redis: ${batch.length} `);
            batch = release_current_row(batch);
            push_batch_to_redis(batch, content);
            batch = [];
        });

}


function has_schamata(content) {
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
    if (has_schamata(content)) {
        syncModuleTools.resolveArrayAttributesBySchemata(content).then(attributes_data=>{
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