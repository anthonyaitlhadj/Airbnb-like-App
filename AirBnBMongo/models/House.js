var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    address: {type: String, required: true},
    city: {type: String, required: true},
    country: {type: String, required: true},
    postalcode: {type: String, required: true, unique: true},
    createdOn: {type: Date, default: Date.now}
});

exports.model = mongoose.model('House', schema, 'houses');