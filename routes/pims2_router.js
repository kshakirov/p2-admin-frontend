let express = require('express'),
    config = require('config'),
    pimsConfig = config.get('config'),
    router = express.Router(),
    rabbit_mq_controller = require("../pims_app/controller/pims_rabbit_mq"),
    csv_writer = require('../pims_app/controller/csv_writer'),
    csv_reader = require('../pims_app/controller/csv_reader'),
    auth_controller = require('../pims_app/controller/ldap_auth'),
    excell_controller = require('../pims_app/controller/excell_reader_redis'),
    path = require('path'),
	sseExpress = require('sse-express'),
    fs = require('fs'),
    operations_elastic_controller = require("../pims_app/controller/operations_elastic"),
    elastic_controller = require("../pims_app/controller/pims_elastic"),
    pims_scheduler = require("../pims_app/controller/scheduler"),
    multer = require('multer');


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

router.post('/search/aggregations', function (req, res) {
    operations_elastic_controller.findAggregations(req, res);
});

router.post('/operations', function (req, res) {
    operations_elastic_controller.findOperations(req, res);
});

router.post('/audits', function (req, res) {
    operations_elastic_controller.findOperations(req, res);
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

router.post('/notify/pipeline/immediate/check', function (req, res) {
    rabbit_mq_controller.checkImmediatePipeline(req, res);
});


router.put('/csv/write/:filename/:uuid', function (req, res) {
    csv_writer.writeCsv(req, res);
});
router.delete('/csv/file/:filename', function (req, res) {
    csv_writer.deleteCsv(req, res);
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

router.post('/schedule', function (req, res) {
    pims_scheduler.scheduleOperation(req, res);
});


router.delete('/unschedule/:operationId', function (req, res) {
    pims_scheduler.unscheduleOperation(req, res);
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



module.exports = router;
