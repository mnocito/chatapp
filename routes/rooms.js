var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/message');
require('../models/room');
var Room = mongoose.model('Room');
var Message = mongoose.model('Message');
var rooms = [];
var nicks = {}
module.exports = function(io) {
	io.sockets.on('connection', function(socket) {
		var room;
		socket.on('room', function(room) {
			Room.findOne({
				name: room
			}, function(err, newRoom) {
				if (err) {
					console.log(err);
				}
				if (newRoom) {
					io.in(room).emit("room", {
						room: newRoom
					});
				}
				if (!newRoom) {
					var newRoom1 = new Room();
					newRoom1.name = room;
					newRoom1.save(function(err, dankroom) {
						console.log(dankroom)
						io.in(room).emit("room", {
							room: dankroom
						})
					});
				}
			});
			socket.join(room);
			addtorooms(room)
			console.log(rooms)
		});
		socket.on('newMessage', function(msg) {
			var newMsg = new Message();
			newMsg.createdby = msg.createdby;
			newMsg.body = msg.body; 
			newMsg.room = msg.room;
			newMsg.channel = msg.channel;
			newMsg.date = formatDate(new Date())
			newMsg.save(function(err, dank) {});
			io.in(msg.room).emit('message', newMsg);
		})
		socket.on('joined', function(msg) {
			io.in(msg.room).emit('message', msg);
			nicks[socket.id] = {nickname: msg.createdby, room: msg.room};
			io.in(msg.room).emit('clients', {clients: nicks});
			var leaveMsg = {
				createdby: msg.createdby,
				body: "has left the chat",
				room: msg.room,
				channel: msg.prevChannel
			}
			if (msg.prevChannel) {
				io.in(msg.room).emit('message', leaveMsg);
			}
		})
		socket.on('addChannel', function(msg) {
			Room.findOneAndUpdate({
				name: msg.room
			}, {
				$push: {
					channels: msg.channel
				}
			}, {
				new: true,
				safe: true
			}, function(err, newRoom) {
				console.log("yeah")
				console.log(newRoom)
				if (err) {
					console.log(err);
				}
				if (newRoom) {
					io.in(msg.room).emit("room", {
						room: newRoom
					});
				}
			});
		})
		socket.on('poke', function(poke) {
			io.to(getID(nicks, poke.to)).emit('pokemsg', poke)
		})
		socket.on('disconnect', function() {
			var tempRoom;
			if (nicks[socket.id]) {
				console.log('client disconnect')
				tempRoom = nicks[socket.id].room;
			}
			delete nicks[socket.id]
			io.in(tempRoom).emit('clients', {clients: nicks});
		})
		console.log('client connect');
	});
	return router;
}
// internal functions
function getClients(ar, room) {
	var anon = [];
	for (var k in ar) {
		if (ar[k].room == room) {
			anon.push(ar[k].name)
		}
	}
	return anon;
}
function getID(ar, nickname) {
	for(var key in ar) {
		if(ar[key].nickname == nickname) {
			return key;
		}
	}
}
function addtorooms(room) {
	if (rooms.indexOf(room) == -1) {
		rooms.push(room)
	}
}

function formatDate(date) {
	var minutes;
	if (date.getMinutes() < 10) {
		minutes = "0" + date.getMinutes()
	} else {
		minutes = date.getMinutes()
	}
	return date.getHours() + ":" + minutes;
}