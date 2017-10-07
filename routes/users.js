var fs = require('fs');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var _ = require('lodash');

var dataFilename = 'databnb.json';
var databnb = require('../databnb.json');

router.get('/', function(req, res, next) {
    res.status(406).json({error: 406, message : 'mauvais parametre. (users/id/:id/pwd/:pwd)'});
});

router.get('/id/:id/pwd/:pwd', function(req, res, next) {
	var userID = req.params.id,
		userPWD = req.params.pwd;
	if (!userID || !userPWD) {
		res.status(406).json({error: 406, message : 'mauvais parametre. (users/id/:id/pwd/:pwd)'});
	} else {
		var filter = _.findIndex(databnb.users, {id: parseInt(userID)});
		if (filter >= 0) {
			// vérification du mot de passe pour modification
			bcrypt.compare(userPWD, databnb.users[filter].password, function (err, match) {
				if (!match) {
					res.status(401).json({error: 401, message : 'authentication mauvais'})
				} else {
					res.json(databnb.users[filter])
				}
			});
		} else {
			res.status(404).json({error: 404, message : 'id utilisateur ' + userID + ' est introuvable'});
		}
	}
});

router.post('/create', function(req, res, next) {
    var username = req.body.username,
    	password = req.body.password;
    if (!username || !password) {
        res.status(406).json({error: 406, message : 'mauvais parametre. les parametres sont username et password'})
    } else {
		//cryptage du mot de passe
		var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

		// ecriture du json
		var userID = !databnb.users.length > 0 ? 0 : databnb.users[databnb.users.length-1].id + 1;
		databnb.users.push({id: userID, username: username, password: hash});
		fs.writeFile(dataFilename, JSON.stringify(databnb), 'utf8', function () {
			res.json({success: 'utilisateur ' + userID + ' créé (username: ' + username + ' mdp: ' + password + ')'})
		});
    }
});

router.patch('/update/:id/pwd/:pwd', function (req, res, next) {
    var username = req.body.username,
    	password = req.body.password,
		userPWD = req.params.pwd,
    	userID = req.params.id;
	if (!username || !password) {
		res.status(406).json({error:406,message:'mauvais parametre. les parametres body sont username et password'})
	} else {
		var passwordhash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		var filter = _.findIndex(databnb.users, {id: parseInt(userID)});
		if (filter >= 0) {
			// verification du mot de passe pour modification
			bcrypt.compare(userPWD, databnb.users[filter].password, function (err, match) {
				if (!match) {
					res.status(401).json({error: 401, message : 'authentication mauvais'})
				} else {
					databnb.users[filter] = {id: parseInt(userID), username: username, password: passwordhash};
					fs.writeFile(dataFilename, JSON.stringify(databnb), 'utf8', function () {
						res.json({success: 'utilisateur ' + userID + ' mis à jour : ' + username + ' ' + password});
					});
				}
			});
		} else {
			res.status(404).json({error: 404,message:'id utilisateur ' + userID + ' est introuvable'});
		}
	}
});

module.exports = router;
