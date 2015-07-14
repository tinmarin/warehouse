var config 	    = require('../config');
var nodeMailer  = require('nodemailer');
var dateFormat  = require('dateformat');
var fs			= require('fs');
var PDFDocument = require('pdfkit');

module.exports.emailOrder = function(order, body) {

	createPDF(order, body, this.sendEmail);

};

module.exports.sendEmail = function(body, filename){

	var transporter = nodeMailer.createTransport({
    	service: config.service,
  		auth: config.auth
	});

	var mailOptions = {
			
		    from: body.from,
		    to: body.to,
		    subject: body.subject,
		    text: body.text
		};

	if(filename) {
		mailOptions.attachments = [{
			filename: filename,
			path	: filename
		}];
	}

	transporter.sendMail(mailOptions, function(error, info){

			if(error) console.log(error);

			else if(filename) {
				fs.unlink(filename);
			}
	});

};

function createPDF(order, body, callback){

	var length = order.products.length;

	var doc = new PDFDocument();

	var hdsupply = [];

	var defaultLeftMargin = 72;
	var defaultRightMargin = 535;
	var secondColumn = 200;
	var thirdColumn = 260;

	var date = dateFormat(order.date, "mm-dd-yyyy");
	var fileName = "Order#"+ order.date+"_"+date+".pdf";
	var madeBy = "Made by: " + order.user;
	var madeByX = defaultRightMargin - doc.widthOfString(madeBy);


	doc.fontSize(14).text("Order # " + order.date).moveDown();

	doc.fontSize(12);

	doc.text("Date: " + date, defaultLeftMargin, doc.y, {lineBreak: false})
		.text("Total: " + length + " items", secondColumn, doc.y, {lineBreak: false})
		.text(madeBy, madeByX, doc.y);

	doc.lineWidth(1)
		.moveTo(defaultLeftMargin,doc.y)
		.lineTo(defaultRightMargin, doc.y)
		.stroke()
		.moveDown();
		

	doc.text("Item #", defaultLeftMargin, doc.y, {lineBreak: false})
		.text("Qty", secondColumn, doc.y, {lineBreak: false})
		.text("Description", thirdColumn, doc.y).moveDown();

	doc.text("Home Depot", defaultLeftMargin, doc.y).moveDown();

	//drawing home depot products
	for (var i = 0 ; i < length ; i++) {
		if(order.products[i].provider == "Home Depot") {

			doc.text(order.products[i].sku, defaultLeftMargin, doc.y, { lineBreak: false})
				.text(order.products[i].quantity, secondColumn, doc.y, {lineBreak:false})
				.text(order.products[i].name, thirdColumn, doc.y).moveDown();

		} else {
			hdsupply.push(order.products[i]);
		}
	}

	doc.moveDown();

	if(hdsupply.length > 0){
		doc.text("HD Supply", defaultLeftMargin, doc.y).moveDown();

		//drawing hd supply products
		for(var j = 0; j < hdsupply.length; j++){

			doc.text(hdsupply[j].sku, defaultLeftMargin, doc.y, { lineBreak: false})
					.text(hdsupply[j].quantity, secondColumn, doc.y, {lineBreak:false})
					.text(hdsupply[j].name, thirdColumn, doc.y);

		}
	}
	
	doc.pipe(fs.createWriteStream(fileName));
	doc.end();

	if (callback && body) callback(body, fileName);

}