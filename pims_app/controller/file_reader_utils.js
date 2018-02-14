let fs = require('fs'),
    config = require('config'),
    pimsConfig = config.get('config'),
    redis = require("redis"),
    redisClient = redis.createClient(pimsConfig.redis.url),
    currentRow = false;

function push_batch_to_redis(batch, content) {
    console.log(`Pushed to Redis ${batch.length} rows`);
    content.Entities = batch;
    redisClient.rpush(["fileList", JSON.stringify(content)], function (err, reply) {
        if (err) {
            console.log("Error");
            console.log(err)
        }
        if (reply) {
            console.log(JSON.parse(reply));
        } else {
            console.log("undefined reply");
        }
    })
}


function has_array_attributes(attributesData) {
    return attributesData.hasOwnProperty('arrayNames') && attributesData.arrayNames.length > 0

}

function set_current_row(row, attributesData) {
    currentRow = JSON.parse(JSON.stringify(row));
    attributesData.arrayNames.map(aa => {
        aa.map(a => {
            currentRow[a] = [];
        })
    })
}

function get_current_row() {
    return currentRow;
}


function create_objs_from_cols(row, attributes_data) {
    let current_row = JSON.parse(JSON.stringify(row));
    let binding = attributes_data.binding;
    Object.keys(binding).map(bb => {
        if (binding[bb]) {
            let t_objs = current_row[binding[bb][0]].map((cr, i) => {
                let t_obj = {};
                binding[bb].map(b => {
                    t_obj[b] = current_row[b][i]
                });
                return t_obj;
            });
            current_row[bb] = t_objs;
        }
    });
    return current_row;
}

function release_current_row(batch, attributesData) {
    if (get_current_row()) {
        let obj_row = create_objs_from_cols(get_current_row(), attributesData);
        batch.push(obj_row);
        unset_current_row();
    }
    return batch;
}

function update_current_row(attributesData, row) {
    let not_empty_keys = attributesData.arrayNames.filter(a => {
        let found = a.find(f => {
            if (row.hasOwnProperty(f) && row[f].length > 0) {
                return f;
            }
        });
        if (found)
            return a;
        return false;
    });
    not_empty_keys.map(kk => {
        kk.map(k => {
            currentRow[k].push(row[k]);
        })
    });
}

function unset_current_row() {
    currentRow = false;
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
                let obj_row = create_objs_from_cols(get_current_row(), attributesData);
                batch.push(obj_row);
                set_current_row(row, attributesData);
            }
        } else if (batch.length > 0) {
            if (currentRow[attributesData.primaryKey] == row[attributesData.primaryKey]) {
                console.log("Row Ids Are Equal, folding ...");
                update_current_row(attributesData, row)
            } else {
                console.log("Row Ids Differ, Releasing The Container, keeping current");
                let obj_row = create_objs_from_cols(get_current_row(), attributesData);
                batch.push(obj_row);
                set_current_row(row, attributesData);
            }
        }
    }
    else {
        batch.push(row);
    }

    return batch;
}

exports.foldTree = fold_tree;
exports.pushBatchToRedis = push_batch_to_redis;
exports.releaseCcurrentRow = release_current_row;
exports.clean = unset_current_row;