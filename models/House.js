var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HouseSchema = new Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalcode: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }
});

exports.model = mongoose.model('House', HouseSchema, 'houses');