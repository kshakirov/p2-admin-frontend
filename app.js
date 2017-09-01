let express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    methodOverride = require('express-method-override'),
   // router = express.Router(),
    errorhandler = require('errorhandler'),
    proxy = require('http-proxy-middleware');
    pug = require('pug');
    logger = require('express-logger');


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
app.use(logger({path: "logs/logfile.txt"}));
//app.use(bodyParser());
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//TODO move it to separate module
let options = {
    target: 'http://10.1.1.71:8080', // target host
    changeOrigin: true,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
        // add custom header to request
        proxyReq.setHeader('x-added', 'foobar');
        console.log('PimsReq: ', Date.now());
        // or log the req
    }
};

// create the proxy (without context)

let options_sync_module = {
    target: 'http://10.1.1.135:4567', // target host
    changeOrigin: true,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
        // add custom header to request
        proxyReq.setHeader('x-added', 'foobar');
        console.log('SyncModuleReq: ', Date.now());
        // or log the req
    }
};

// create the proxy (without context)
let pims_proxy = proxy(options),
    sync_module_proxy = proxy(options_sync_module);





app.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
});

app.use('/rest',pims_proxy);
app.use('/sync-module',sync_module_proxy);
function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    proxyReq.setHeader('x-added', 'foobar');
    // or log the req
}

let  pims2_routers = require('./routes/pims2_router');
app.use('/pims2', pims2_routers);
app.get('/', routes.index);
app.get('/partial/:type/:name', routes.partial);
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});