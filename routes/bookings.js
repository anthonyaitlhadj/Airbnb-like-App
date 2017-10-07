var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var router = express.Router();

router.get('/', function(req, res) {
    res.status(406).json({"error": "Bad parameters"});
});

router.post('/create', function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var msisdn = req.body.msisdn;
    var date = req.body.date;
    if (!username || !email || !msisdn || !date) {
        res.status(406).json({'error':'Missing parameters. parameters are username, email, msisdn and date'})
    } else {
        fs.readFile('databnb.json', 'utf8', function (err, data){
            if (err){
                throw err
            } else {
                var jsonFile = JSON.parse(data);
                var id = !jsonFile.bookings.length > 0 ? 0 : jsonFile.bookings[jsonFile.bookings.length-1].id + 1;
                jsonFile.bookings.push({id: id, username: username, email: email, msisdn: msisdn, date: date});
                var json = JSON.stringify(jsonFile);
                fs.writeFile('databnb.json', json, 'utf8', function () {
                    res.json({'success' : username + " " + email + " " + msisdn + " pour le " + date})
                });
            }
        });
    }
});

router.put('/update/:id', function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var msisdn = req.body.msisdn;
    var date = req.body.date;
    if (!username || !email || !msisdn || !date) {
        res.status(406).json({'error':'Missing parameters. parameters are username, email, msisdn and date'})
    } else {
        fs.readFile('databnb.json', 'utf8', function (err, jsonFile) {
            if (err) {
                throw err
            } else {
                var jsonFile = JSON.parse(jsonFile);
                var search = _.findIndex(jsonFile.bookings, {id: parseInt(req.params.id)});
                if (search >= 0) {
                    jsonFile.bookings[search] = {id: parseInt(req.params.id), username: username, email: email, msisdn: msisdn, date: date};
                    fs.writeFile('databnb.json', JSON.stringify(jsonFile), 'utf8', function () {
                        res.json({'success': "La réservation " + req.params.id + " a été mis à jour : " + username + " " + email + " " + msisdn + " pour le " + date});
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
    var username = req.body.username;
    var email = req.body.email;
    var msisdn = req.body.msisdn;
    var date = req.body.date;
    fs.readFile('databnb.json', 'utf8', function(err, jsonFile){
        if (err) {
            throw err
        } else {
            var jsonFile = JSON.parse(jsonFile);
            var search = _.findIndex(jsonFile.bookings, {id: parseInt(req.params.id)});
            if (search >= 0) {
                jsonFile.bookings[search] = {id: parseInt(req.params.id), id: id, username: username, email: email, msisdn: msisdn, date: date};
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

