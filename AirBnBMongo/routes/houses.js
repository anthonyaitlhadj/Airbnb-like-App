var express = require('express');
var router = express.Router();
var houses = require('../models/House');
if (houses) {console.log('ok')}

/* GET Récupère la liste des maisons */
router.get('/listhouses', houses.index);

/* POST Création d'une nouvelle maison */
router.post('/house', houses.create);

/* PUT Modification d'une maison */
router.put('/update/:id(\\d+)', houses.update);

/* DELETE Suppression d'une maison */
router.delete('/delete/:id(\\d+)', houses.delete);

router.get('/', function(req, res){
    res.render('house');
    console.log('la page creation maison a été affichée')
});

/* GET houses listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router;