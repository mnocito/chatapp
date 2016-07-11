var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/message')
var Message = mongoose.model('Message')
/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('index');
});
router.get('/room/:id', function(req, res) {
	res.render('index')
})
module.exports = router;