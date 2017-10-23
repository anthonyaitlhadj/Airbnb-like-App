require('../models/House');

var mongoose = require('mongoose'),
    House = mongoose.model('House');

var Houses = {
    index: function (req, res) {

        House.find({}, function (err, houses) {
            if (err) throw err;

            // object of all the users
            console.log(houses);
            res.render('houses/index', {"houses" : houses});
        });


    },
    create: function (req, res) {

        //console.log(req.body, req);
        var h = new House({
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            postalcode: req.body.postalcode
        });

        h.save(function (err) {
            if (err) {

                throw err;
            }
            console.log('L\'Appartement a été crée!');
            console.log(h);
        });

        res.send(req.body);
    },


    update: function (req, res) {

        House.findById(req.params.id, function (err, house) {
            if (err) throw err;

            // change the users location
            house.name = req.body;

            // save the user
            house.save(function (err) {
                if (err) throw err;

                console.log('House successfully updated!');
            });

        });

        res.render('houses/update');
    },
    delete: function (req, res) {

        House.findById(req.params.id, function (err, house) {
            if (err) throw err;

            // delete him
            house.remove(function (err) {
                if (err) throw err;

                console.log('House successfully deleted!');
            });
        });

        res.render('houses/delete');
    }

};

module.exports = Houses;