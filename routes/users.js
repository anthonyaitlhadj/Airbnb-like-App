var fs = require('fs');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var _ = require('lodash');
var dataFilename = 'databnb.json';

router.get('/', function(req, res, next) {
    res.status(406).json({'error': 406, 'message' : 'mauvais parametre. (users/id/:id/pwd/:pwd)'});
});

router.get('/id/:id/pwd/:pwd', function(req, res, next) {
	var userID = req.params.id,
		userPWD = req.params.pwd;
	if (!userID || !userPWD) {
		res.status(406).json({'error': 406, 'message' : 'mauvais parametre. (users/id/:id/pwd/:pwd)'});
	} else {
		fs.readFile(dataFilename, 'utf8', function (err, data) {
			if (err) {
				throw err
			} else {
				var dataJson = JSON.parse(data);
				var filter = _.findIndex(dataJson.users, {id: parseInt(userID)});
				if (filter >= 0) {
					bcrypt.compare(userPWD, dataJson.users[filter].password, function (err, match) {
						if (!match) {
							res.status(401).json({'error': 401, 'message' : 'authentication mauvais'})
						} else {
							res.json(dataJson.users[filter])
						}
					});
				} else {
					res.status(404).json({'error': 404, 'message' : 'id utilisateur ' + userID + ' est introuvable'});
				}
			}
		});
	}
});

router.post('/create', function(req, res, next) {
    var username = req.body.username,
    	password = req.body.password;
    if (!username || !password) {
        res.status(406).json({'error': 406, 'message' : 'mauvais parametre. les parametres sont username et password'})
    } else {
		//cryptage du mot de passe
		var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

		// ecriture du json
		fs.readFile(dataFilename, 'utf8', function (err, data){
			if (err){
				throw err
			} else {
				var dataJson = JSON.parse(data);
				var userID = !dataJson.users.length > 0 ? 0 : dataJson.users[dataJson.users.length-1].id + 1;
				dataJson.users.push({id: userID, username: username, password: hash});
				var json = JSON.stringify(dataJson);
				fs.writeFile(dataFilename, json, 'utf8', function () {
					res.json({'success': 'utilisateur ' + userID + ' créé (username: ' + username + ' mdp: ' + password + ')'})
				});
			}
		});
    }
});

router.patch('/update/:id/pwd/:pwd', function (req, res, next) {
    var username = req.body.username,
    	password = req.body.password,
		userPWD = req.params.pwd,
    	userID = req.params.id;
	if (!username || !password) {
		res.status(406).json({'error':406,'message':'mauvais parametre. les parametres body sont username et password'})
	} else {
		var passwordhash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		fs.readFile(dataFilename, 'utf8', function (err, dataJson) {
			if (err) {
				throw err
			} else {
				dataJson = JSON.parse(dataJson);
				var filter = _.findIndex(dataJson.users, {id: parseInt(userID)});
				if (filter >= 0) {
					bcrypt.compare(userPWD, dataJson.users[filter].password, function (err, match) {
						if (!match) {
							res.status(401).json({'error': 401, 'message' : 'authentication mauvais'})
						} else {
							dataJson.users[filter] = {id: parseInt(userID), name: username, password: passwordhash};
							fs.writeFile(dataFilename, JSON.stringify(dataJson), 'utf8', function () {
								res.json({'success': 'utilisateur ' + userID + ' mis à jour : ' + username + ' ' + password});
							});
						}
					});
				} else {
					res.status(404).json({'error': 404,'message':'id utilisateur ' + userID+ ' est introuvable'});
				}
			}
		});
	}
});

module.exports = router;
