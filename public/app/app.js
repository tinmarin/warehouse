angular.module('suppliesApp', [ 'app.routes', 'authService','mainCtrl', 'dataService', 'dataCtrl', 'ui.bootstrap.modal'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
	
})

.constant("PROVIDERS", ["Home Depot","HD Supply"]);