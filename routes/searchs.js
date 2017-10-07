var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/:name', function(req, res) {
    var data = fs.readFile("databnb.json", 'utf8',function read(err, data) {
        obj = JSON.parse(data);
        console.log(obj);
    })
})

module.exports = router;
