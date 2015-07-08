var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var orderSchema   = new Schema({

	date		: Number,
	user		: String,
	
	products	: [],

	delivered   : { type: Boolean, default: false},

	deliveredAt : { type: String, default: "pending"}

});

module.exports = mongoose.model('Order', orderSchema);