var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var requestSchema = new Schema({

	date      : Number,
	user	  : String,

	products  : [],

	status    : { type : String, default : "pending"},

	processedDate : { type : String, default : "processing" },

	processedBy : { type : String, default : "processing" },

});

module.exports = mongoose.model('Request', requestSchema);