let  express = require('express');
let  router = express.Router();
let elastic_controller = require("../pims_app/controller/pims_elastic");

router.post('/', function (req, res) {
    elastic_controller.findAll(req,res);
});

module.exports = router;
