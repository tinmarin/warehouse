angular.module('dataCtrl', ['dataService'])

.controller('userController', function(User) {

	var vm = this;

	User.all().
		success(function(data) {

			vm.users = data;

		});

	vm.deleteUser = function(id) {

		User.delete(id)
			.success(function(data) {

				User.all()
					.success(function(data) {
						vm.users = data;
					});
			});

	};

	vm.saveUser = function() {

		vm.message = '';

		User.create(vm.userData)
			.success(function(data) {

				vm.userData = {};
				vm.message = data.message;
				User.all()
					.success(function(data) {
						vm.users = data;
					});

			});

	};

	vm.updateUser = function() {

		vm.message = '';

		User.update(vm.userData._id, vm.userData)
			.succes(function(data) {

				vm.userData = {};

				vm.message = data.message;

			});

	};

})

.controller('productController', function($scope, Product, PROVIDERS) {

	var vm = this;

	Product.all().success(function(data){
		vm.products = data;
	});

	vm.PROVIDERS = PROVIDERS;
	
	vm.createProduct = function() {

		vm.message = '';
		Product.create(vm.productData)
			.success(function(data){
				console.log(data.message);
				vm.message = data.message;
				$scope.productForm.$setPristine();
				vm.productData = {};
				Product.all()
					.success(function(data){
						vm.products = data;
					});
			});
	};

	vm.deleteProduct = function(id) {

		console.log('am trying to delete ' + id);
		Product.delete(id)
			.success(function(data) {

				Product.all()
					.success(function(data) {
						vm.products = data;
					});
			});

	};
})

.controller('cartController', function(Order, Cart, AuthHandler, $location){

	var vm = this;

	vm.products = Cart.getCart();

	vm.removeItem = function(index){

		vm.products = Cart.removeItem(index);

	};

	vm.itemsInCart = function(){
		return Cart.getSize();
	};

	vm.removeAll = function(){

		vm.products = [];
		Cart.setCart();
	};

	vm.decreaseQuantity = function(index){

		if(vm.products[index].quantity > 1)

			vm.products = Cart.decreaseQuantity(index);

	};

	vm.increaseQuantity = function(index){
		vm.products = Cart.increaseQuantity(index);
	};

	vm.createOrder = function(){

		var order = {};

		AuthHandler.getUser()
			.then(function(data){
				
				order.user = data.data.name;
				order.products = vm.products;
				
				Order.create(order)
					.then(function(){

						$location.path('/orders/done');
						Cart.setCart();

					});
				
			});
	};

})

.controller('orderController', function(Order){

	var vm = this;

	Order.all().success(function(data){

		vm.orders = data;

	});

})

.controller('requestController', function($location, Request, Product, AuthHandler, Cart){

	var vm = this;

	vm.products = [];

	vm.productData = {};

	vm.currentRequest = Request.getCurrent();

	Request.pending().success(function(data){
		vm.pendingRequests = data;
	});

	Request.all().success(function(data){
		vm.requests = data;
	});

	vm.addPendingProduct = function(){

		if(!Product.exist(vm.requestProduct.sku)){

			vm.products.push({

				'name': vm.requestProduct.name,
				'sku' : vm.requestProduct.sku,
				'url' : vm.requestProduct.url,
				'priority' : vm.requestProduct.priority,
				'status' : 'not saved'

			});

			vm.requestProduct = {};

		} else {
			vm.addProductError = "Existing product. Check product list";
		}
	};

	vm.deletePendingProduct = function(index){

		vm.products.splice(index, 1);

	};

	vm.savePendingRequest = function() {

		var request = {};

		AuthHandler.getUser()
			.then(function(data){
				
				request.user = data.data.name;
				request.products = vm.products;
				
				Request.create(request)
					.then(function(){
						$location.path('/requests/inprocess');
						vm.products = [];
					});
			});
	};

	vm.setCurrentRequest = function(req){
		Request.setCurrent(req);
	};

	vm.cancelRequest = function(id){

		AuthHandler.getUser()
			.then(function(data){

				Request.updateRequestStatus(id, {
					status: "cancelled",
					user: data.data.name
				})

				.then(function(){
					Request.all().success(function(data){
						vm.requests = data;
					});
				});
			});
	};

	vm.processRequest = function(){

		AuthHandler.getUser()
			.then(function(data){

				Request.updateRequestStatus(vm.currentRequest._id, {
					status: "processed",
					user: data.data.name
				}).then(function(){
					$location.path('/requests');
				});
			});
	};

	vm.fillForm = function(index){
		vm.index = index;
		var product = vm.currentRequest.products[index];
		vm.productData.name = product.name;
		vm.productData.sku = product.sku;
	};

	vm.saveProduct = function() {

		vm.message = '';
		Product.create(vm.productData)
			.success(function(data){
				
				vm.message = data.message;

				vm.currentRequest.products[vm.index].status = "saved";

				Request.updateProductAsSaved(vm.currentRequest._id, vm.currentRequest.products)
					.then(function(){

						Request.markProductAsSaved(vm.index);

						vm.productData = {};
					});
				
			});
	};

	//TODO make a call inside to saveProduct func
	vm.createAndAddToCart = function(){

		vm.message = '';
		Product.create(vm.productData)
			.success(function(data){
				
				vm.message = data.message;

				vm.currentRequest.products[vm.index].status = "saved";

				Request.updateProductAsSaved(vm.currentRequest._id, vm.currentRequest.products)
					.then(function(){
						
						Request.markProductAsSaved(vm.index);

						vm.productData.quantity = vm.productData.limit;
		
						Cart.addToCart(vm.productData);

						vm.productData = {};
					});
				
			});
		
	};
});

















