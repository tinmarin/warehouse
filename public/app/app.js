angular.module('suppliesApp', [ 'app.routes', 'authService','mainCtrl', 'dataService', 'dataCtrl'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
	
})

.constant("PROVIDERS", [{name: "Home Depot"}, {name:"HD Supply"}]);