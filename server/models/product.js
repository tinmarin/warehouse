var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var productSchema   = new Schema({

	name		: { type: String, required: true},
	keywords 	: { type: String, required: true},
	unitsPack	: { type: Number, required: true},
	provider 	: { type: String, required: true},
	sku			: { type: String, required: true, index: { unique: true }},
	limit       : Number,
	stock       : Number, 
	permanent   : { type : Boolean, default: false},  
	description : { type : String, required: true}

});

module.exports = mongoose.model('Product', productSchema);

