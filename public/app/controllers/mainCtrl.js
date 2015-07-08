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

.controller('homeController', function(Request, Product, Cart){

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

	vm.setData = function(product){
		vm.product = product;
	};

	vm.addToCart = function (product) {
/*
	    var modalInstance = $modal.open({
	      templateUrl: 'app/views/pages/manager/add-to-cart-modal.html',
	      controller: 'addToCartController',
	      resolve: {
	        product: function () {
	          return product;
	        }
	      }
	    });*/
	};
})

.controller('addToCartController', function(product){




});


