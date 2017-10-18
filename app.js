let config = require('config');
let  pimsConfig = config.get('config');
let express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    pims_routes = require('./routes/pims2_router'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    methodOverride = require('express-method-override'),
    errorhandler = require('errorhandler'),
    proxy = require('http-proxy-middleware'),
    pug = require('pug'),
    metadataProxy = require('./pims_app/proxy/metadata'),
    syncModuleProxy = require('./pims_app/proxy/sync_module');
//    logger = require('express-logger');


var app = module.exports = express();

/**
 * Configuration
 */



// all environments
app.set('port', process.env.PORT || 3004);
app.set('views', __dirname + '/app');
app.set('view engine', 'pug');
//app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'app')));
//app.use(logger({path: "logs/logfile.txt"}));
//app.use(bodyParser());
app.use(methodOverride());


//TODO move it to separate module
let options = {
    target: pimsConfig.metadataServer.url, // target host
    changeOrigin: true,
    onProxyReq: metadataProxy.onProxyReq
};

let options_sync_module = {
    target: pimsConfig.syncModule.url, // target host
    changeOrigin: true,
    onProxyReq: syncModuleProxy.onProxyReq,
    onProxyRes: syncModuleProxy.onProxyRes,
};

// create the proxy (without context)
let pims_proxy = proxy(options),
    sync_module_proxy = proxy(options_sync_module);


// app.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now())
//     next()
// });

app.use('/rest', pims_proxy);
app.use('/sync-module', sync_module_proxy);

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


//let elastic_controller = require("./pims_app/controller/pims_elastic");
app.use('/control/', pims_routes);
//app.post('/search', elastic_controller.findAll);
app.get('/', routes.index);
app.get('/partial/:type/:name', routes.partial);
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
