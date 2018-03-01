let schedule = require('node-schedule'),
    config = require('config'),
    pims_rabbit_mq = require('./pims_rabbit_mq'),
    sync_module_tools = require('./sync_module_tools'),
    token_tools = require('../proxy/tokenTools'),
    pimsConfig = config.get('config'),
    custom_operation_relative_url = '/sync-module/custom-sync-operations/',
    restClient = require('node-rest-client-promise').Client(),
    sync_base_url = pimsConfig.syncModule.url,
    dateFormat = require('dateformat');

let jobs = {};


function get_last_run(op) {
    let last_run = op.lastRun;
    if (last_run) {
        last_run = new Date(last_run);
        return dateFormat(last_run, "yyyy-MM-dd HH:mm:ss")
    }
    return "1970-01-01 00:00:00"
}

function add_last_run_2_message(message, last_run) {
    message.CustomOperation.args.lastModifiedAfter = last_run;
    message.CustomOperation.args.incremental = true;
    return message
}


function get_userr(req) {
    let token = token_tools.getToken(req.headers),
        user = token_tools.verifyToken(token);
    return user.name;
}

function getCustomOperation(id) {
    let url = sync_base_url + custom_operation_relative_url + id;
    return restClient.getPromise(url)
}

function is_incremental(custom_operation) {
    return custom_operation.customAttributes.schedule.incremental
}

function run(custom_operation, message, user_login) {
    console.log(`\n Running Operation [${custom_operation.name}] Id [${custom_operation.id}] User [${user_login}] Time Now is ${new Date().toISOString()}`);
    console.log(`Sending Message [${JSON.stringify(message)}] For Operation [${custom_operation.name}] \n`);
    if(is_incremental(custom_operation)) {
        getCustomOperation(custom_operation.id).then(response => {
            let last_run = get_last_run(response.data);
            message = add_last_run_2_message(message, last_run);
            pims_rabbit_mq.sendMessage(message, custom_operation, user_login)
        }, error => {
            console.log(error)
        });
    }else{
        pims_rabbit_mq.sendMessage(message, custom_operation, user_login)
    }


}

function scheduleOperation(req, res) {
    let custom_operation = req.body.operation,
        cron = req.body.operation.customAttributes.schedule.cron,
        message = req.body.message;
    let user_login = get_userr(req);
    console.log(cron);
    let job = schedule.scheduleJob(cron, function () {
        run(custom_operation, message, user_login)
    });

    jobs[custom_operation.id] = job;
    res.sendStatus(200)
}


function unscheduleOperation(req, res) {
    let operationId = req.params.operationId,
        ids = Object.keys(jobs);
    if (ids.find(id => {
            return id === operationId.toString()
        })) {
        let job_to_delete = jobs[operationId];
        job_to_delete.cancel();
        res.sendStatus(200)
    } else {
        res.json({error: "No such operation"})
    }


}

exports.scheduleOperation = scheduleOperation;
exports.unscheduleOperation = unscheduleOperation;