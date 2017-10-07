var fs = require('fs');
var _ = require('lodash');
var bcrypt = require('bcrypt');

var express = require('express');
var router = express.Router();
var dataFilename = 'messaging.json';


// data json
var users = require('../databnb.json').users;
var messaging = require('../messaging.json');

// get all chat room existing
router.get('/rooms', function (req, res, next) {
	var mapped = _.map(messaging.chatRooms, _.partialRight(_.pick, ['id', 'name']));
	if (mapped.length > 0) {
		res.json(mapped);
	} else {
		res.status(404).json({error:404, message : 'there are no rooms'});
	}
});

router.post('/rooms/create', function (req, res, next) {
	var roomName = req.body.name;
	if (!roomName) {
		res.status(406).json({error : 406, message : 'wrong body parameters'});
	} else {
		var roomID = !messaging.chatRooms.length > 0 ? 0 : messaging.chatRooms[messaging.chatRooms.length-1].id + 1;
		// insertion room
		messaging.chatRooms.push({id: roomID, name : roomName, messages:[]});
		fs.writeFile(dataFilename, JSON.stringify(messaging), 'utf8', function () {
			res.json(messaging)
		});
	}
});

/**
 * insertion message
 * :room id de la room
 * :user id de l'auteur
 * :pwd mdp de l'auteur
 */
router.post('/messages/create/room/:room_id/user/:user_id/pwd/:pwd', function (req, res, next) {
	var room = req.params.room_id,
		user = req.params.user_id,
		pwd = req.params.pwd,
		messageText = req.body.messageTxt;

	if (!messageText) {
		res.status(406).json({error: 406, message: 'missing parameter : messageTxt'})
	} else {
		var filterRoom = _.findIndex(messaging.chatRooms, {id: parseInt(room)});
		var filterUser = _.findIndex(users, {id: parseInt(user)});

		var errorMsg = '';
		if (filterRoom < 0) errorMsg += '(chat room) ';
		if (filterUser < 0) errorMsg += '(user) ';
		if(errorMsg != ''){
			res.status(404).json({error:404, message: errorMsg + 'not found'});
		} else {

			var messageID = !messaging.chatRooms[filterRoom].messages.length > 0 ? 0 : messaging.chatRooms[filterRoom].messages[messaging.chatRooms[filterRoom].messages.length - 1].id + 1;

			bcrypt.compare(pwd, users[filterUser].password, function (err, match) {
				if (!match) {
					res.status(401).json({error: 401, message: 'forbidden'})
				} else {
					// insertion message
					messaging.chatRooms[filterRoom].messages.push({
						id: messageID,
						user: users[filterUser].id,
						text: messageText,
						date: new Date().toISOString()
					});
					fs.writeFile(dataFilename, JSON.stringify(messaging), 'utf8', function () {
						res.json(messaging.chatRooms[filterRoom])
					});
				}
			});
		}
	}
});

/**
 * recupération chat room
 * get chat room data
 */
router.get('/rooms/:room_id', function (req, res, next) {
	var room = req.params.room_id;
	var filterRoom = _.findIndex(messaging.chatRooms, {id: parseInt(room)});
	if (filterRoom >= 0) {
		res.json(messaging.chatRooms[filterRoom]);
	} else {
		res.status(404).json({error: 404, message:'room messaging '+room+' not found'})
	}
});

/**
 * delete room
 * :room_id is the id of room to delete
 */
router.delete('/rooms/delete/:room_id', function (req, res, next) {
	var room = req.params.room_id;
	var roomRemoved = _.remove(messaging.chatRooms, {id: parseInt(room)});
	if (roomRemoved.length > 0) {
		fs.writeFile(dataFilename, JSON.stringify(messaging), 'utf8', function () {
			res.json({'room removed': roomRemoved});
		});
	} else {
		res.status(404).json({error:404, message : 'nothing to remove'});
	}
});

module.exports = router;
