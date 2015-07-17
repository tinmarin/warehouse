angular.module('mainCtrl', ['dataService'])

.controller('mainController', function($rootScope, $modal, $location, AuthHandler, Product, Request, Cart, $window, PROVIDERS) {

	var vm = this;

	$rootScope.PROVIDERS = PROVIDERS;

	vm.loggedIn = AuthHandler.isLoggedIn();

	//check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function(){

		vm.loggedIn = AuthHandler.isLoggedIn();

		AuthHandler.getUser()
			.then(function(data) {

				vm.user = data.data;
				if(data.data.username == 'admin') {
					$rootScope.isAdmin = true;
				} else {
					$rootScope.isAdmin = false;
				}
			});

	});

	vm.doLogin = function() {

		vm.error = '';

		AuthHandler.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				if (data.success){

					//TODO implement Roles
					if (vm.loginData.username == 'admin')
						$location.path('/admin/home');
					else 
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

	var elems = document.getElementsByTagName( 'a' );

 

	for ( var i = 0; i < elems.length; i++ ) {

 		elems[ i ].addEventListener( 'click', function(e){

			e.preventDefault();

			console.log("am element # "+ i );

		}	, 'false' );

 	}
	
})

.controller('homeController', function(Request, Product, Cart, Order,$location, $modal, AuthHandler){

	var vm = this;

	Request.pending().success(function(data){
		vm.requests = data;
	});

	Product.getNonPermanent().success(function(data){
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

				order.user = { name    : data.data.name,
							   username: data.data.username,
							   email   : data.data.email };
				order.products = Cart.getCart();
				
				Order.createManagerOrder(order)
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

})

.controller('adminController', function($scope, $location, $modal, AuthHandler, Product, Request, Cart, Order){

	var vm = this;


	Order.managerOrders().success(function(data){
		vm.managersOrders = data;
	});
	
	Request.pending().success(function(data){
		vm.requests = data;
	});

	Product.all().success(function(data){
		vm.products = data;
	});

	vm.itemsInCart = function(){
		return Cart.getSize();
	};

	vm.addToCart = function(product, index) {

		var qty = $('#quantity'+index).val();

		var formName = "addCartForm"+index;

		if(qty > 0 && qty < 100){

			product.quantity = parseInt(qty);
			
			Cart.addToCart(product);

			$('[name=alert'+index+']').hide();
			$('[name=success'+index+']').show();
			$('[name='+formName+']').removeClass('has-error');
			$('#quantity'+index).val("");

		} else {
			$('[name=success'+index+']').hide();
			$('[name=alert'+index+']').show();
			$('[name='+formName+']').addClass('has-error');
		}

		

	};

	vm.setCurrentRequest = function(item){
		Request.setCurrent(item);
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

				order.user = data.data.name;
				order.products = Cart.getCart();
				
				Order.create(order)
					.then(function(){

						$location.path('/orders/done');
						Cart.setCart();

					});
				
			});

	    });



	};


});

