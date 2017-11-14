require('../models/User');

var mongoose = require('mongoose'),
    User = mongoose.model('User');

var Users = {
    index: function (req, res) {

        User.find({}, function (err, users) {
            if (err) throw err;

            // object of all the users
            console.log(users);
            res.send({"users" : users});
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

        if (Object.keys(req.body).length === 0) {
            return res.status(406).json('rien a mettre à jour')
        }
      
        User.findByIdAndUpdate(req.params.id, {$set: req.body}, {runValidators : true, new: true, context: 'query'}, function (err, user) {
            if (err) {
                var error = [];
                if (err.name == 'ValidationError') {
                    Object.entries(err.errors).forEach(function(val, key) {
                        error.push({field: val[0], message: val[1].message});
                    }, this);
                    return res.status(500).json(error)
                };
            }
            res.json({'updated': user})
        });
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

        res.json({success : true});
    },



    connect : function(req, res){

        /*------VALEURS RENTREES-----*/

        var log = {
            email : req.query.email,
            password : req.query.password
        };
        console.log('--------Informations rentrées LogIn--------');
        console.log('infos rentrées : ');
        console.log('email : ' + log.email);
        console.log('password : ' + log.password);

        /*-----VERIFICATION EXISTENCE EMAIL DANS BDD-----*/

        User.findOne({ 'email' : log.email, 'password' : log.password}, function(err, userStock){
            if (!userStock) {
                console.log('Can\'t find admin user. Please create one');
                res.json({success : false});
            } else {
                res.json(userStock)
            }
        });

    },

    disconnect : function(req, res){
        session.destroy();
    }

};

module.exports = Users;