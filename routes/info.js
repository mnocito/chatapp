var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/message')
var Message = mongoose.model('Message')
router.get('/chat/:roomname/:channelname', function(req, res) {
	Message.find({
		room: req.params.roomname,
		channel: req.params.channelname
	}, function(err, msgs) {
		res.send({
			messages: msgs
		});
	});
})
router.get('/rooms', function(req, res) {
	res.send({
		rooms: rooms
	});
})
module.exports = router;