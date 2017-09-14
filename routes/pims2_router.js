let express = require('express'),
    router = express.Router(),
    rabbit_mq_controller = require("../pims_app/controller/pims_rabbit_mq")
    elastic_controller = require("../pims_app/controller/pims_elastic");

router.post('/search', function (req, res) {
    elastic_controller.findAll(req, res);
});

router.post('/notify', function (req, res) {
    rabbit_mq_controller.notifyModification(req, res);
});

module.exports = router;
