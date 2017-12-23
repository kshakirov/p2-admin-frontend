let express = require('express'),
    router = express.Router(),
    rabbit_mq_controller = require("../pims_app/controller/pims_rabbit_mq"),
    csv_writer = require('../pims_app/controller/csv_writer'),
    csv_reader = require('../pims_app/controller/csv_reader'),
    auth_controller = require('../pims_app/controller/ldap_auth'),
    excell_controller = require('../pims_app/controller/excell_stream'),
    path = require('path'),
	sseExpress = require('sse-express'),
    fs = require('fs'),
    elastic_controller = require("../pims_app/controller/pims_elastic"),
    multer = require('multer'),
   	redis = require("redis"),
    redisClient = redis.createClient('redis://10.1.3.23');


let storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        let datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
let upload = multer({ //multer settings
    storage: storage
}).single('file');


router.post('/search', function (req, res) {
    elastic_controller.findAll(req, res);
});

router.post('/search/make_sortable/', function (req, res) {
    elastic_controller.makeSortable(req, res);
});

router.post('/notify/batch/:queuePrefix', function (req, res) {
    rabbit_mq_controller.notifyBatch(req, res);
});

router.post('/notify/entity', function (req, res) {
    rabbit_mq_controller.notifyEntity(req, res);
});


router.put('/csv/write/:filename/:uuid', function (req, res) {
    csv_writer.writeCsv(req, res);
});


router.post('/excel/read/:filename', function (req, res) {
    excell_controller.streamXlxs(req, res);
});

router.post('/csv/read/:filename', function (req, res) {
    csv_reader.readCsv(req, res);
});

router.get('/login', function (req, res) {
    res.render('auth');
});

router.post('/authenticate', function (req, res) {
    auth_controller.authenticate(req, res);
});

router.post('/file-upload', upload, (req, res) => {
    if (req.file && req.file.filename) {
        let filename = req.file.filename;
        res.json({
            fileName: filename
        })
    }

});


router.post('/file-download', (req, res) => {
    let filename = req.body.filename;
    let filePath = path.join(__dirname, '..', 'files', filename);

    try {
        let stat = fs.statSync(filePath);
        let fileToSend = fs.readFileSync(filePath);
        res.set('Content-Type', 'text/plain');
        res.set('Content-Length', stat.size);
        res.set('Content-Disposition', filename);
        res.send(fileToSend);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('File not found!');
        } else {
            throw err;
        }
        res.sendStatus(404)
    }

});

router.get('/notify/', sseExpress, function (req, res) {


    redisClient.on("error", function (err) {
        console.log("Error " + err);
    });




    let counter = 0;
    function intervalFunc() {
        redisClient.rpop("notifications", function (err, reply) {
            if(reply){

                let body = JSON.parse(reply);
                console.log(body);
                res.sse('connected', {
                    message: body,
                    id: counter
                });
                counter++
            }else{
                res.sse('connected', {
                    message: {},
                    id: -100
                });
                counter++
            }

        });

    }

    setInterval(intervalFunc, 1500);
});

module.exports = router;
