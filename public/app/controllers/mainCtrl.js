angular.module('mainCtrl', ['dataService'])

.controller('mainController', function($rootScope, $location, AuthHandler, Product, Request, Cart, $window) {

	var vm = this;

	vm.loggedIn = AuthHandler.isLoggedIn();

	Request.pending().success(function(data){
		vm.requests = data;
	});

	Product.all().success(function(data){
		vm.products = data;
	});

	vm.itemsInCart = function(){
		return Cart.getSize();
	};
	
	//check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function(){

		vm.loggedIn = AuthHandler.isLoggedIn();

		AuthHandler.getUser()
			.then(function(data) {

				vm.user = data.data;

			});

	});

	vm.doLogin = function() {

		vm.error = '';

		AuthHandler.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				if (data.success){
					
					$location.path('/home');
					
				}
				else
					vm.error = data.message;
			});

	};


	vm.doLogout = function() {

		AuthHandler.logout();
		Cart.setCart();
		vm.user = '';

		$location.path('/');
		
	};

	vm.addToCart = function(product) {

		product.quantity = parseInt(vm.quantity);
		
		Cart.addToCart(product);

	};

	vm.setCurrentRequest = function(item){
		Request.setCurrent(item);
	};
	
})

.controller('homeController', function(Request, Product, Cart, Order,$location, $modal, AuthHandler){

	var vm = this;

	Request.pending().success(function(data){
		vm.requests = data;
	});

	Product.all().success(function(data){
		vm.products = data;
	});

	vm.itemsInCart = function(){
		return Cart.getSize();
	};

	vm.addToCart = function (product) {

	    var modalInstance = $modal.open({
	      templateUrl: 'app/views/pages/manager/add-to-cart-modal.html',
	      controller: 'addToCartController',
	      backdropClass: 'no-opacity',
	      resolve: {
	        CurrentProduct: function () {
	          return product;
	        }
	      }
	    });

	    modalInstance.result.then(function (quantity) {
	      
	      	product.quantity = parseInt(quantity);
		
			Cart.addToCart(product);


	    }, function () {
	      console.log('Modal dismissed at: ' + new Date());
	    });
	};

	vm.showCart = function (){

		var modalInstance = $modal.open({

			templateUrl : 'app/views/pages/manager/cart.html',
			controller  : 'cartController',
			controllerAs: 'cart',
			backdropClass: 'fixed',
			size:'lg'
		});

		modalInstance.result.then(function () {
	      
	      	var order = {};

			AuthHandler.getUser()
			.then(function(data){
				console.log(data);
				order.user = { name    : data.data.name,
							   username: data.data.username,
							   email   : data.data.email };
				order.products = vm.products;
				
				Order.create(order)
					.then(function(){

						$location.path('/orders/done');
						Cart.setCart();

					});
				
			});

	    });



	};
})

.controller('addToCartController', function($scope, $modalInstance, CurrentProduct){

	$scope.item = CurrentProduct;

	$scope.quantity = 1;

 	$scope.animationsEnabled = true;

  	$scope.ok = function () {
    	$modalInstance.close($scope.quantity);
  	};

  	$scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
  	};

});

