var express = require('express');
var router = express.Router();
var users = require('../models/User');
if (users) {console.log('ok')}

/* GET Récupère la liste des utilisateurs */
router.get('/listusers', users.index);

/* POST Création d'un nouvel utilisateur */
router.post('/inscription', users.create);

/* PUT Modification d'un utilisateur */
router.put('/update/:id(\\d+)', users.update);

/* DELETE Suppression d'un utilisateur */
router.delete('/delete/:id(\\d+)', users.delete);

/*POST permet au user de se connecter*/
router.post('/login', users.connect);

/*GET permet de se déconnecter*/
router.get('/deconnexion', function(req, res){
    res.render('users/deconnexion');
    console.log('L\'user s\'est déconnecté!')
});
router.get('/', function(req, res){
    res.render('inscription');
    console.log('la page inscription a été affichée')
});

router.get('/login', function(req, res){
    res.render('login');
    console.log('La page de connexion a été affichée!!');
});
module.exports = router;