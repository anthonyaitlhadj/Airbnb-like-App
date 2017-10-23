require('../models/User');

var mongoose = require('mongoose'),
    User = mongoose.model('User');

var Users = {
    index: function (req, res) {

        User.find({}, function (err, users) {
            if (err) throw err;

            // object of all the users
            console.log(users);
            res.render('users/index', {"users" : users});
        });


    },
    create: function (req, res) {

        //console.log(req.body, req);
        var u = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        u.save(function (err) {
            if (err) {

                throw err;
            }
            console.log('L\'user a été crée!');
            console.log(u);
        });

        //res.json(u);
        res.send(req.body);
    },


    update: function (req, res) {

        User.findById(req.params.id, function (err, user) {
            if (err) throw err;

            // change the users location
            user.name = req.body;

            // save the user
            user.save(function (err) {
                if (err) throw err;

                console.log('User successfully updated!');
            });

        });

        res.render('users/update');
    },
    delete: function (req, res) {

        User.findById(req.params.id, function (err, user) {
            if (err) throw err;

            // delete him
            user.remove(function (err) {
                if (err) throw err;

                console.log('User successfully deleted!');
            });
        });

        res.render('users/delete');
    },



    connect : function(req, res){

        /*------VALEURS RENTREES-----*/

        connect = {
            email : req.body.email,
            password : req.body.password
        };
        console.log('--------Informations rentrées LogIn--------');
        console.log('infos rentrées : ');
        console.log('email : ' + connect.email);
        console.log('password : ' + connect.password);

        /*-----VERIFICATION EXISTENCE EMAIL DANS BDD-----*/

        User.findOne({ 'email' : connect.email, 'password' : connect.password}, function(err, userStock){
            if (!userStock) {
                console.log('Can\'t find admin user. Please create one');
                res.render('users/Inscription');
            }

            else{
                var password = req.body.password;
                var adminPass = userStock.pwd;
                if (password == adminPass) {
                    req.session.email = userStock.email;
                }
                res.redirect('http://localhost:3000/home');
            }
        });

    },

    disconnect : function(req, res){
        session.destroy();
    }

};

module.exports = Users;