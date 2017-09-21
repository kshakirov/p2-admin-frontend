let express = require('express'),
    router = express.Router(),
    rabbit_mq_controller = require("../pims_app/controller/pims_rabbit_mq"),
    csv_controller = require('../pims_app/controller/csv_writer'),
    elastic_controller = require("../pims_app/controller/pims_elastic");

router.post('/search', function (req, res) {
    elastic_controller.findAll(req, res);
});

router.post('/notify', function (req, res) {
    rabbit_mq_controller.notifyModification(req, res);
});


router.post('/csv/write/:filename', function (req, res) {
    csv_controller.writeCsv(req, res);
});

module.exports = router;
