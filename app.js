/**
 * Module dependencies
 */

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    methodOverride = require('express-method-override'),
    router = express.Router(),
    errorhandler = require('errorhandler'),
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





app.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
// Routes

// app.get('/', function (req, res) {
//     res.send('Birds home page')
// })

app.get('/', routes.index);

// router.get('/', routes.index);
router.get('/partial/:name', routes.partial);



// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});