var fs = require('fs');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var _ = require('lodash');


var obj = JSON.parse(fs.readFileSync('databnb.json', 'utf8'));

router.get('/', function(req, res, next) {
    res.status(406).json({"error" : "Bad paramters"});
});
/* GET users listing. */
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  if (!id) {
    res.status(400).json({"error" : "Bad parameters"});
  } else {
    var user = obj.users.id;
    if (!user) res.status(404).json({"error" : "User id not found"});
    else res.json({'user' : user});
  }
});

router.post('/', function(req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    //cryptage du mot de passe
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    // ecriture du json
    fs.readFile('databnb.json', 'utf8', function (err, data){
        if (err){
            throw err
        } else {
            obj = JSON.parse(data);
            var id = !obj.users.length > 0 ? 0 : obj.users[obj.users.length-1].id + 1;
            obj.users.push({id: id, username: name, password: hash});
            var json = JSON.stringify(obj);
            fs.writeFile('databnb.json', json, 'utf8');
        }
    });
    res.json('end')
});

router.patch('/update/:id', function (req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var passwordhash = bcrypt.hashSync(password, salt);
    fs.readFile('databnb.json', 'utf8', function(err, dataJson){
        if (err){
            throw err
        } else {
            dataJson = JSON.parse(dataJson);
            var filter = _.findIndex(dataJson.users, {id : parseInt(req.params.id)});
            if (filter >= 0){
                dataJson.users[filter] = {id : parseInt(req.params.id), name: name, password : passwordhash};
                fs.writeFile('databnb.json', JSON.stringify(dataJson), 'utf8', function () {
                    res.json({'success' : name + " " + password});
                });
            } else {
                res.status(404).json({'error':"id " + req.params.id + " est introuvable"});
            }
        }
    });
});

module.exports = router;
