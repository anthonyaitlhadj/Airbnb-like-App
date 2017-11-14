var express = require('express');
var router = express.Router();

var Bookings = require('../controllers/Bookings');

/* GET Récupère la liste des reservations */
router.get('/', Bookings.index);

/* POST Création d'une nouvelle reservation */
router.post('/create/:user_id', Bookings.create);

/* PUT Modification d'une reservation */
router.put('/update/:id', Bookings.update);

/* DELETE Suppression d'une reservation */
router.delete('/delete/:id', Bookings.delete);

module.exports = router;