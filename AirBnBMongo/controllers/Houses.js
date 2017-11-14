require('../models/House');

var mongoose = require('mongoose'),
    House = mongoose.model('House');

var Houses = {
    index: function (req, res) {

        House.find({}, function (err, houses) {
            if (err) throw err;

            // object of all the users
            console.log(houses);
            res.json({"houses" : houses});
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

        if (Object.keys(req.body).length === 0) {
            return res.status(406).json('rien a mettre à jour')
        }
      
        House.findByIdAndUpdate(req.params.id, {$set: req.body}, {runValidators : true, new: true, context: 'query'}, function (err, house) {
            if (err) {
                var error = [];
                if (err.name == 'ValidationError') {
                    Object.entries(err.errors).forEach(function(val, key) {
                        error.push({field: val[0], message: val[1].message});
                    }, this);
                    return res.status(500).json(error)
                };
            }
            res.json({'updated': house})
        });
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

        res.json('houses/delete');
    }

};

module.exports = Houses;