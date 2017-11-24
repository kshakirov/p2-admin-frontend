let express = require('express'),
    router = express.Router(),
    rabbit_mq_controller = require("../pims_app/controller/pims_rabbit_mq"),
    csv_controller = require('../pims_app/controller/csv_writer'),
    auth_controller = require('../pims_app/controller/ldap_auth'),
    excell_controller = require('../pims_app/controller/excell_stream'),
    elastic_controller = require("../pims_app/controller/pims_elastic");

router.post('/search', function (req, res) {
    elastic_controller.findAll(req, res);
});

router.post('/notify/batch/:queuePrefix', function (req, res) {
    rabbit_mq_controller.notifyBatch(req, res);
});

router.post('/notify/entity', function (req, res) {
    rabbit_mq_controller.notifyEntity(req, res);
});


router.put('/csv/write/:filename/:uuid', function (req, res) {
    csv_controller.writeCsv(req, res);
});


router.post('/excel/read/:filename', function (req,res) {
   excell_controller.streamXlxs(req,res);
});

router.get('/login', function (req,res) {
    res.render('auth');
});

router.post('/authenticate', function (req,res) {
    auth_controller.authenticate(req, res);
});

module.exports = router;
