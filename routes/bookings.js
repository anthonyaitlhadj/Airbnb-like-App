var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var router = express.Router();

router.get('/', function(req, res) {
    res.status(406).json({"error": "Bad parameters"});
});

router.post('/create', function(req, res) {
    var idUser = req.body.idUser;
    var email = req.body.email;
    var msisdn = req.body.msisdn;
    var idHouse = req.body.idHouse;
    var date = req.body.date;
    if (!idUser || !email || !msisdn || !idHouse || !date) {
        res.status(406).json({'error':'Missing parameters. parameters are idUser, email, msisdn, idHouse and date'})
    } else {
        fs.readFile('databnb.json', 'utf8', function (err, data){
            if (err){
                throw err
            } else {
                var jsonFile = JSON.parse(data);
                var id = !jsonFile.bookings.length > 0 ? 0 : jsonFile.bookings[jsonFile.bookings.length-1].id + 1;
                jsonFile.bookings.push({id: id, idUser: idUser, email: email, msisdn: msisdn, idHouse: idHouse, date: date});
                var json = JSON.stringify(jsonFile);
                fs.writeFile('databnb.json', json, 'utf8', function () {
                    res.json({'success' : idUser + " " + email + " " + msisdn + " " + idHouse + " pour le " + date})
                });
            }
        });
    }
});

router.put('/update/:id', function (req, res) {
    var idUser = req.body.idUser;
    var email = req.body.email;
    var msisdn = req.body.msisdn;
    var idHouse = req.body.idHouse
    var date = req.body.date;
    if (!idUser || !email || !msisdn || !idHouse || !date) {
        res.status(406).json({'error':'Missing parameters. parameters are username, email, msisdn, idHouse and date'})
    } else {
        fs.readFile('databnb.json', 'utf8', function (err, jsonFile) {
            if (err) {
                throw err
            } else {
                var jsonFile = JSON.parse(jsonFile);
                var search = _.findIndex(jsonFile.bookings, {id: parseInt(req.params.id)});
                if (search >= 0) {
                    jsonFile.bookings[search] = {id: parseInt(req.params.id), idUser: idUser, email: email, msisdn: msisdn, idHouse: idHouse, date: date};
                    fs.writeFile('databnb.json', JSON.stringify(jsonFile), 'utf8', function () {
                        res.json({'success': "La réservation " + req.params.id + " a été mis à jour : " + idUser + " " + email + " " + idHouse + " " + msisdn + " pour le " + date});
                    });
                } else {
                    res.status(404).json({'error': "id reservation " + req.params.id + " not found"});
                }
            }
        });
    }
});

router.delete('/delete/:id', function (req, res){
    var id = req.body.id;
    var idUser = req.body.idUser;
    var email = req.body.email;
    var msisdn = req.body.msisdn;
    var idHouse = req.body.idHouse;
    var date = req.body.date;
    var data = fs.readFile('databnb.json', 'utf8', function(err, jsonFile){
        if (err) {
            throw err
        } else {
            var jsonFile = JSON.parse(jsonFile);
            var search = _.remove(jsonFile.bookings, {id: parseInt(req.params.id)});
            if (search.length > 0) {
                jsonFile.bookings[search] = {id: parseInt(req.params.id), id: id, idUser: idUser, email: email, msisdn: msisdn, idHouse: idHouse, date: date};
                fs.writeFile('databnb.json', JSON.stringify(jsonFile), 'utf8', function () {
                    res.json({'success' : "reservation has been deleted"});
                });
            } else {
                res.status(404).json({'error': "id reservation " + req.params.id + " not found"});
            }
        }
    });
});

module.exports = router;

