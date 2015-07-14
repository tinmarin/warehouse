var bodyParser 	= require('body-parser');
var Product     = require('../models/product');
var Order 		= require('../models/order');
var ManagerOrder= require('../models/managerOrder');
var Request     = require('../models/request');
var utils       = require('../utils');

var mongoose = require('mongoose');

module.exports = function(app, express) {

	var apiRouter = express.Router();


	//-----------------------
	//   Product routes		|
	//-----------------------
	apiRouter.route('/products')

		.post(function(req, res) {
			

			console.log(req.body);


			//TODO validate existence
			var product = new Product();	
			
			if (req.body.name) 	product.name 			= req.body.name;
			if (req.body.keywords) product.keywords 	= req.body.keywords;
			if (req.body.unitsPack) product.unitsPack 	= req.body.unitsPack;
			if (req.body.provider) product.provider 	= req.body.provider;
			if (req.body.sku) product.sku 				= req.body.sku;
			if (req.body.limit) product.limit 			= req.body.limit;
			if (req.body.stock) product.stock 			= req.body.stock;
			if (req.body.description) product.description 	= req.body.description;
			if (req.body.permanent) product.permanent 	= req.body.permanent;

			
			product.save(function(err) {
				if (err) {
					return res.send(err);
				}
				// return a message
				res.json({message: "Product created!"});
			});

		})

		.get(function(req, res) {

			Product.find({}, function(err, products) {
				if (err) 
					res.send(err);
				// return the products
				res.json(products);
			});
		});

	apiRouter.route('/products/nonpermanent')

		.get(function(req, res){
			Product.find({
	   			 permanent: false
	 		},function(err, products){


	 			res.json(products);

	 		});
		});

	apiRouter.route('/products/:product_id')

		// get the product with that id
		.get(function(req, res) {
			Product.findById(req.params.product_id, function(err, product) {
				if (err) res.send(err);

				// return that product
				res.json(product);
			});
		})

		// update the products with this id
		.put(function(req, res) {
			Product.findById(req.params.product_id, function(err, product) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) 	product.name 			= req.body.name;
				if (req.body.keywords) product.keywords 	= req.body.keywords;
				if (req.body.unitsPack) product.unitsPack 	= req.body.unitsPack;
				if (req.body.provider) product.provider 	= req.body.provider;
				if (req.body.sku) product.sku 				= req.body.sku;

				
				product.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Product updated!' });
				});

			});
		})

		// delete the product with this id
		.delete(function(req, res) {
			Product.remove({
				_id: req.params.product_id
			}, function(err, product) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	//-----------------------
	//   Order routes		|
	//-----------------------

	apiRouter.route('/orders')

		.post(function(req, res) {

			var order = Order({
				user : req.body.user,
				date : Date.now(),
				products : req.body.products
			});

			order.save(function(err) {
				if (err) {
					return res.send(err);
				}

				utils.emailOrder(order, {
					from : "Second Plaza",
					to 	 : "tinmarin60@gmail.com",
					subject: "Second Plaza Order",
					text : "Find order attached! Thank you!"
				});
				
				
				res.json({ message: 'Order submitted!' });

			});

			

		})

		.get(function(req, res) {

			Order.find({}, function(err, orders) {
				if (err) 
					res.send(err);
				// return the users
				res.json(orders);
			});
		});

	apiRouter.route('/orders/managerorder')

		.post(function(req, res) {

			var managerOrder = ManagerOrder({
				user : req.body.user,
				date : Date.now(),
				products : req.body.products
			});

			managerOrder.save(function(err) {
				if (err) {
					return res.send(err);
				}
				/*
				utils.sendEmail({
					from : "Second Plaza",
					to 	 : req.body.user.email,
					subject: "Order confirmation",
					text : "Your order was received. You will be notified as soon as your product arrives to our warehouse."
				});
				*/
				res.json({ message: 'Order submitted!' });

		});
	});

	apiRouter.route('/orders/managerorder').get(function(req, res){
		ManagerOrder.find({}, function(err, orders) {
				if (err) 
					res.send(err);
				// return the users
				return res.json(orders);
			});
	});

	apiRouter.route('/orders/:order_id')

		.get(function(req, res) {
			Order.findById(req.params.order_id, function(err, order) {
				if (err) res.send(err);

				// return that product
				res.json(order);
			});
		})

		
		.put(function(req, res) {
			Order.findById(req.params.order_id, function(err, order) {

				if (err) res.send(err);

				// set the new order information if it exists in the request

				order.date = Date.now();
				if (req.body.id) order.user = req.body.id;
				if (req.body.products) order.products = req.body.products;

				// save the order
				order.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Order updated!' });
				});

			});
		})

		.delete(function(req, res) {
			Order.remove({
				_id: req.params.order_id
			}, function(err, order) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	//-----------------------
	//   Request routes		|
	//-----------------------

	apiRouter.route('/requests')

		.post(function(req, res){

			if(req.body.status) {

				//Find pending requests
				Request.find({status: req.body.status}, function(err, requests) {
					if (err) 
						res.send(err);
					res.json(requests);
				});

			} else {

				var request = new Request({

					date : Date.now(),
					user : req.body.user,
					products : req.body.products

				});

				request.save(function(err) {
					if (err) {
						return res.send(err);
					}
					// return a message
					res.json({ message: 'Request created!' });

				});
			}

		})

		.get(function(req, res){

			Request.find({}, function(err, requests) {
				if (err) 
					res.send(err);
				res.json(requests);
			});

		});

	apiRouter.route('/requests/:request_id')

		.get(function(req, res) {

			Request.findById(req.params.request_id, function(err, request) {
				if (err) res.send(err);
				res.json(request);
			});
		})

		.put(function(req, res){
			Request.findById(req.params.request_id, function(err, request) {

				if (err) res.send(err);

				if (req.body.status) {

					request.status = req.body.status;					
					request.processedDate = Date.now();
					request.processedBy = req.body.user;

				} /*else if (req.body.sku) {
					for (var i = 0; i < request.products.length; i++) {

						console.log(request.products[i].sku == req.body.sku);

						if(request.products[i].sku == req.body.sku){

							request.products[i].status = "saved";
						}
					}
				}	*/

				if (req.body.products){
					request.products = req.body.products;
				}

				console.log(request);
				
				request.save(function(err) {
					if (err) {
						res.send(err);
					}
					res.json({ message: 'Request updated!' });
				});

			});
	
		});

	return apiRouter;

};