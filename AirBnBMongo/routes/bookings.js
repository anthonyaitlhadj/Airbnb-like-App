var express = require('express');
var router = express.Router();
var bookings = require('../models/Booking');
if (bookings) {console.log('ok')}

/* GET Récupère la liste des reservations */
router.get('/listbookings', bookings.index);

/* POST Création d'une nouvelle reservation */
router.post('/create', bookings.create);

/* PUT Modification d'une reservation */
router.put('/update/:id(\\d+)', bookings.update);

/* DELETE Suppression d'une reservation */
router.delete('/delete/:id(\\d+)', bookings.delete);

router.get('/', function(req, res){
    res.render('booking');
    console.log('la page reservation a été affichée')
});

/* GET bookings listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router;