var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var schema = new Schema({
    user_id: {type: String, required: true},
    msisdn: {type: String, required: true},
    beginDate: {type: String, required: true},
    endDate: {type: String, required: true, unique: true},
    createdOn: {type: Date, default: Date.now}
});

exports.model = mongoose.model('Booking', schema, 'bookings');