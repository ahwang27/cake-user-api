var express = require('express');
var router = express.Router();

var dataController = require('../controllers/data-controller');
var auth = require('../controllers/auth');

router.get('/', auth.verifyToken, dataController.index);
router.post('/byday', dataController.getDayInformation);
router.post('/impressionsbyday', dataController.getImpressions);

module.exports = router;