var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var router = express.Router();

router.get('/:name', function(req, res) {
    var data = fs.readFile("databnb.json", 'utf8',function (err, data) {
    	var obj = JSON.parse(data);
		var country = _.filter(obj.houses, function(x){
		return x.countryCode == req.params.name;
		});
	res.json(country);
	console.log(country);
    });
})

module.exports = router;
