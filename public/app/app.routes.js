angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			redirectTo : '/login'
		})
		
		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    		controllerAs: 'login'
		})

		.when('/admin/home', {

			templateUrl : 'app/views/pages/admin-home.html',
			controller  : 'adminController',
			controllerAs: 'admin'
    	
    	})

    	.when('/home', {
    		templateUrl : 'app/views/pages/home.html',
    		controller  : 'homeController',
			controllerAs: 'home'
    	})

    	.when('/users', {

    		templateUrl : 'app/views/pages/users/users.html',
    		controller  : 'userController',
    		controllerAs: 'user'

		})

		.when('/products', {

			templateUrl : 'app/views/pages/products/products.html',
			controller  : 'productController',
			controllerAs: 'product'

		})

		.when('/orders', {

			templateUrl : 'app/views/pages/orders/orders.html',
			controller  : 'orderController',
			controllerAs: 'order'

		})

		.when('/orders/cart', {

			templateUrl : 'app/views/pages/orders/cart.html',
			controller  : 'cartController',
			controllerAs: 'cart'
				
		})

		.when('/orders/done', {

			templateUrl : 'app/views/pages/orders/done.html'

		})

		.when('/requests', {

			templateUrl : 'app/views/pages/requests/requests.html',
			controller  : 'requestController',
			controllerAs: 'request'

		})

		.when('/requests/create', {

			templateUrl : 'app/views/pages/requests/request-create.html',
			controller  : 'requestController',
			controllerAs: 'request'

		})

		.when('/requests/details', {

			templateUrl : 'app/views/pages/requests/request-details.html',
			controller  : 'requestController',
			controllerAs: 'request'

		})

		.when('/requests/inprocess', {

			templateUrl : 'app/views/pages/requests/request-inprocess.html',

		})

		.otherwise({

			templateUrl: 'app/views/pages/404-not-found.html'

		});

	$locationProvider.html5Mode(true);

});