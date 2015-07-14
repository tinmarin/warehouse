angular.module('authService', [])

.factory('AuthHandler', function($http, $q, AuthToken, $cacheFactory, $rootScope, Request){
	
	var authHandlerFactory = {};

	authHandlerFactory.login = function(username, password) {

		return $http.post('/auth/authenticate', {
			username: username,
			password: password
		})
			.success(function(data) {
				AuthToken.setToken(data.token);

				return data;
			});

	};

	authHandlerFactory.logout = function() {

		AuthToken.setToken();
		Request.setCurrent();
		$cacheFactory.get('$http').removeAll();

	};

	authHandlerFactory.isLoggedIn = function() {

		if (AuthToken.getToken())
			return true;
		else
			return false;

	};

	//TODO: complete this
	authHandlerFactory.isAdmin = function(){
		
	};

	authHandlerFactory.getUser = function() {

		if (AuthToken.getToken())
			return $http.get('/auth/me', { cache: true });
		else 
			return $q.reject({message: 'User has no token'});

	};

	return authHandlerFactory;
})

.factory('AuthToken', function($window) {

	var authTokenFactory = {};

	authTokenFactory.getToken = function() {

		return $window.localStorage.getItem('token');

	};

	authTokenFactory.setToken = function(token) {

		if (token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');

	};

	return authTokenFactory;

})

.factory('AuthInterceptor', function($q, $location, AuthToken){

	var authInterceptorFactory = {};

	authInterceptorFactory.request = function(config) {

		var token = AuthToken.getToken();

		if (token)
			config.headers['x-access-token'] = token;
		else 
			$location.path('/login');

		return config;

	};

	authInterceptorFactory.responseError = function(response) {

		if (response.status === 403) {

			AuthToken.setToken();
			$location.path('/login');

		}

		return $q.reject(response);

	};

	return authInterceptorFactory;

});