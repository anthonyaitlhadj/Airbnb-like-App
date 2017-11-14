var express = require('express');
var router = express.Router();

var Houses = require('../controllers/Houses');

/* GET Récupère la liste des maisons */
router.get('/', Houses.index);

/* POST Création d'une nouvelle maison */
router.post('/create', Houses.create);

/* PUT Modification d'une maison */
router.put('/update/:id', Houses.update);

/* DELETE Suppression d'une maison */
router.delete('/delete/:id', Houses.delete);

module.exports = router;