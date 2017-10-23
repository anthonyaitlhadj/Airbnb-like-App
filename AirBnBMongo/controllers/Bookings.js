require('../models/Booking');

var mongoose = require('mongoose'),
    Booking = mongoose.model('Booking');

var Bookings = {
    index: function (req, res) {

        Booking.find({}, function (err, bookings) {
            if (err) throw err;

            // object of all the users
            console.log(bookings);
            res.render('bookings/index', {"bookings" : bookings});
        });


    },
    create: function (req, res) {

        //console.log(req.body, req);
        var b = new Booking({

            msisdn: req.body.msisdn,
            beginDate: req.body.beginDate,
            endDate: req.body.endDate
        });

        b.save(function (err) {
            if (err) {

                throw err;
            }
            console.log('La réservation a été crée!');
            console.log(b);
        });

        res.send(req.body);
    },


    update: function (req, res) {

        Booking.findById(req.params.id, function (err, booking) {
            if (err) throw err;

            // change the users location
            booking.name = req.body;

            // save the user
            booking.save(function (err) {
                if (err) throw err;

                console.log('Booking successfully updated!');
            });

        });

        res.render('bookings/update');
    },
    delete: function (req, res) {

        Booking.findById(req.params.id, function (err, booking) {
            if (err) throw err;

            // delete him
            booking.remove(function (err) {
                if (err) throw err;

                console.log('Booking successfully deleted!');
            });
        });

        res.render('bookings/delete');
    }

};

module.exports = Bookings;