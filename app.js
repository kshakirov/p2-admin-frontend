let config = require('config');
let pimsConfig = config.get('config');
let express = require('express'),
    routes = require('./routes'),
    express_proxy = require('express-http-proxy'),
    api = require('./routes/api'),
    pims_routes = require('./routes/pims2_router'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    methodOverride = require('express-method-override'),
    pug = require('pug'),
    metadataProxy = require('./pims_app/proxy/metadata'),
    userManagementProxy = require('./pims_app/proxy/user_management'),
    redis = require("redis"),
    redisClient = redis.createClient(pimsConfig.redis.url),
    operationLog = require('./pims_app/controller/operation_log'),
    pimsRabbit = require('./pims_app/controller/pims_rabbit_mq'),
    syncModuleProxy = require('./pims_app/proxy/sync_module');


let app = module.exports = express();

app.set('port', process.env.PORT || 3004);
app.set('views', __dirname + '/app');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'app')));
app.use(methodOverride());


app.use('/rest',
    express_proxy(pimsConfig.metadataServer.url, {
        proxyReqPathResolver: metadataProxy.proxyReqPathResolver
    })
);

app.use('/management',
    express_proxy(pimsConfig.userManagementServer.url, {
        proxyReqPathResolver: userManagementProxy.proxyReqPathResolver
    })
);

app.use('/sync-module', express_proxy(pimsConfig.syncModule.url, {
    proxyReqPathResolver: syncModuleProxy.proxyReqPathResolver
}));

app.use(bodyParser.urlencoded(
    {
        'extended': 'true',
        parameterLimit: 100000,
        limit: '50mb'
    }
));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json(
    {
        parameterLimit: 100000,
        limit: '50mb'
    }
));                                     // parse application/json
app.use(bodyParser.json(
    {
        type: 'application/vnd.api+json',
        parameterLimit: 100000,
        limit: '50mb'
    })); // parse application/vnd.api+json as json
//app.use(bodyParser({uploadDir:'./uploads'}));

app.use('/control/', pims_routes);
app.use('/auth/', pims_routes);
app.get('/', routes.index);
app.get('/partial/:type/:name', routes.partial);
app.get('*', routes.index);

let server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

let io = require('socket.io')(server);

let counter = 0;
io.on('connection', function (client) {
    console.log("connnected");
    client.on('event', function (data) {
        console.log("Event")
    });
    client.on('disconnect', function () {
        console.log("disconnected")
    });

    redisClient.on("error", function (err) {
        console.log("Error " + err);
    });


    let counter = 0;


});

function intervalFunc() {
    if(io) {
        redisClient.rpop("notifications", function (err, reply) {
            if (reply) {
                let body = JSON.parse(reply),
                    msg = {
                        message: body,
                        id: counter
                    };
                io.emit('log', msg);
                counter++
            }
        });
    }
}

setInterval(intervalFunc, 100);
setInterval(operationLog.syncLog, 50000);

pimsRabbit.startConnenction(io);