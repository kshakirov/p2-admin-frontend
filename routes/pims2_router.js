let express = require('express'),
    router = express.Router(),
    rabbit_mq_controller = require("../pims_app/controller/pims_rabbit_mq"),
    csv_controller = require('../pims_app/controller/csv_writer'),
    elastic_controller = require("../pims_app/controller/pims_elastic");

router.post('/search', function (req, res) {
    elastic_controller.findAll(req, res);
});

router.post('/notify/batch', function (req, res) {
    rabbit_mq_controller.notifyBatch(req, res);
});

router.post('/notify/entity', function (req, res) {
    rabbit_mq_controller.notifyEntity(req, res);
});


router.post('/csv/write/:filename/:uuid', function (req, res) {
    csv_controller.writeCsv(req, res);
});

module.exports = router;
