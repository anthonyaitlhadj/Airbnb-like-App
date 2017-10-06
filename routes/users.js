var fs = require('fs');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var _ = require('lodash');


router.get('/', function(req, res, next) {
    res.status(406).json({"error": "parametre id manquant"});
});

router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	if (!id) {
		res.status(406).json({"error": "parametre id manquant"});
	} else {
		fs.readFile('databnb.json', 'utf8', function (err, data) {
			if (err) {
				throw err
			} else {
				var dataJson = JSON.parse(data);
				var filter = _.findIndex(dataJson.users, {id: parseInt(id)});
				if (filter >= 0) {
					res.json(dataJson.users[filter])
				} else {
					res.status(404).json({'error': "id utilisateur " + req.params.id + " est introuvable"});
				}
			}
		});
	}
});

router.post('/', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password) {
        res.status(406).json({'error':'mauvais parametre. les parametres sont username et password'})
    } else {
		//cryptage du mot de passe
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(password, salt);

		// ecriture du json
		fs.readFile('databnb.json', 'utf8', function (err, data){
			if (err){
				throw err
			} else {
				var dataJson = JSON.parse(data);
				var id = !dataJson.users.length > 0 ? 0 : dataJson.users[dataJson.users.length-1].id + 1;
				dataJson.users.push({id: id, username: username, password: hash});
				var json = JSON.stringify(dataJson);
				fs.writeFile('databnb.json', json, 'utf8', function () {
					res.json({'success' : username + " " + password})
				});
			}
		});
    }
});

router.patch('/update/:id', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
	if (!username || !password) {
		res.status(406).json({'error':'mauvais parametre. les parametres sont username et password'})
	} else {
		var salt = bcrypt.genSaltSync(10);
		var passwordhash = bcrypt.hashSync(password, salt);
		fs.readFile('databnb.json', 'utf8', function (err, dataJson) {
			if (err) {
				throw err
			} else {
				dataJson = JSON.parse(dataJson);
				var filter = _.findIndex(dataJson.users, {id: parseInt(req.params.id)});
				if (filter >= 0) {
					dataJson.users[filter] = {id: parseInt(req.params.id), name: username, password: passwordhash};
					fs.writeFile('databnb.json', JSON.stringify(dataJson), 'utf8', function () {
						res.json({'success': "utilisateur " + req.params.id + " mis à jour : " + username + " " + password});
					});
				} else {
					res.status(404).json({'error': "id utilisateur " + req.params.id + " est introuvable"});
				}
			}
		});
	}
});

module.exports = router;
