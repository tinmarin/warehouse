angular.module('dataService', [])

.factory('User', function($http) {

	var userFactory = {};

	userFactory.get = function(id) {
		return $http.get('/auth/users/' + id);
	};

	userFactory.all = function() {
		return $http.get('/auth/users');
	};

	userFactory.create = function(userData) {
		return $http.post('/auth/users', userData);
	};

	userFactory.update = function(id, userData) {
		return $http.put('/auth/users/' + id, userData);
	};

	userFactory.delete = function(id) {
		return $http.delete('/auth/users/' + id);
	};

	return userFactory;

})

.factory('Product', function($http) {

	var productFactory = {};

	productFactory.get = function(id) {
		return $http.get('/api/products/' + id);
	};

	productFactory.all = function() {
		return $http.get('/api/products');
	};

	productFactory.create = function(productData) {
		return $http.post('/api/products', productData);
	};

	productFactory.update = function(id, productData) {
		return $http.put('/api/products/' + id, productData);
	};

	productFactory.delete = function(id) {
		return $http.delete('/api/products/' + id);
	};

	productFactory.exist = function(sku){

		//TODO send request for product existence
		return false;

	};

	return productFactory;

})

.factory('Order', function($http){

	var orderFactory = {};

	orderFactory.all = function(){
		return $http.get('/api/orders');
	};

	orderFactory.create = function(orderData){
		return $http.post('/api/orders', orderData);
	};

	return orderFactory;

})

.factory('Request', function($http, $window) {

	var requestFactory = {};
	var _current = {};

	requestFactory.get = function(id) {
		return $http.get('/api/requests/' + id);
	};

	requestFactory.all = function() {
		return $http.get('/api/requests');
	};

	requestFactory.pending = function(){
		return $http.post('/api/requests', {status: 'pending'});
	};

	requestFactory.create = function(requestData) {
		return $http.post('/api/requests', requestData);
	};

	requestFactory.updateRequestStatus = function(id, data){
		return $http.put('/api/requests/'+id, data);
	};

	requestFactory.updateProductAsSaved =function(id, productList){
		return $http.put('/api/requests/'+id, {products: productList});
	};

	requestFactory.setCurrent = function(req){
		if(req)
			$window.localStorage.setItem('currentRequest', JSON.stringify(req));
		else
			$window.localStorage.removeItem('currentRequest');
	};

	requestFactory.getCurrent = function(){
		if(!$window.localStorage.getItem('currentRequest'))
			return {};
		return JSON.parse($window.localStorage.getItem('currentRequest'));
	};

	requestFactory.markProductAsSaved = function(index){
		_current = this.getCurrent();
		_current.products[index].status = "saved";

		this.setCurrent(_current);

	};

	return requestFactory;

})

.factory('Cart', function($window){

	var _cart = [];

	var cartFactory = {};

	var alreadyInCart = function(product){

 		var i = 0;

 		while(i < _cart.length){

 			if(_cart[i]._id == product._id){

 				_cart[i].quantity += product.quantity;
 				return true;
 			}

 			i++;

 		}

		return false;

	};

	cartFactory.addToCart = function(product){
		
		_cart = this.getCart();

		if(!alreadyInCart(product)) 

			_cart.push(product);

		this.setCart(_cart);
	};

	cartFactory.setCart = function(newCart){

		if(newCart)
			$window.localStorage.setItem('cart', JSON.stringify(newCart));
		else
			$window.localStorage.removeItem('cart');
		
	};

	cartFactory.getCart = function(){
		
		if(!$window.localStorage.getItem('cart'))
			return [];
		return JSON.parse($window.localStorage.getItem('cart'));
	};

	cartFactory.getSize = function(){
		return this.getCart().length;
	};

	cartFactory.removeItem = function(index){

		_cart = this.getCart();
		
		_cart.splice(index, 1);

		this.setCart(_cart);

		return this.getCart();
	};

	cartFactory.decreaseQuantity = function(index){

		_cart = this.getCart();

		_cart[index].quantity -= 1;

		this.setCart(_cart);

		return this.getCart();

	};

	cartFactory.increaseQuantity = function(index){

		_cart = this.getCart();

		_cart[index].quantity += 1;

		this.setCart(_cart);

		return this.getCart();

	};
	return cartFactory;

});