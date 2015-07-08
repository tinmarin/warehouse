var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var managerOrderSchema = new Schema({

	date        : Number,
	user        : {},

	products    : [],

	status      : { type: String, default: "pending"}

});


module.exports = mongoose.model('ManagerOrder', managerOrderSchema);