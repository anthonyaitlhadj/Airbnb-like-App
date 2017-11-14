var express = require('express');
var router = express.Router();

var Users = require('../controllers/Users');

/* GET Récupère la liste des utilisateurs */
router.get('/', Users.index);

/* POST Création d'un nouvel utilisateur */
router.post('/register', Users.create);

/* PUT Modification d'un utilisateur */
router.put('/update/:id', Users.update);

/* DELETE Suppression d'un utilisateur */
router.delete('/delete/:id', Users.delete);

/*POST permet au user de se connecter*/
router.get('/login', Users.connect);
module.exports = router;