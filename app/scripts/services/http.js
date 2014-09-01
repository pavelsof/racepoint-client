/* ѣ */
(function() {
	
	'use strict';
	
	var apiUrlFactory = function() {
		var apiUrl = '';
		if(window.location.search.indexOf('?local') === 0) {
			apiUrl = 'http://localhost:8000/api';
		} else {
			apiUrl = 'http://racepoint.yatcode.com/api';
		}
		return apiUrl;
	};
	
	var authFactory = function() {
		var Auth = {
			token: false,
			init: function() {
				if(localStorage.getItem('authToken')) {
					Auth.token = localStorage.getItem('authToken');
				}
			},
			setToken: function(newToken) {
				Auth.token = newToken;
				localStorage.setItem('authToken', newToken);
			},
			getToken: function() {
				return Auth.token;
			},
			clear: function() {
				Auth.token = '';
				localStorage.removeItem('authToken');
			}
		};
		Auth.init();
		return Auth;
	};
	
	var authHttpFactory = function($http, apiUrl, auth) {
		var authHttp = function(config) {
			config.url = apiUrl + config.url;
			config.headers = config.headers || {};
			config.headers['Racepoint-Token'] = auth.getToken();
			return $http(config);
		};
		return authHttp;
	};
	
	var httpInterceptorFactory = function($q, $location, messageService, auth) {
		var httpInterceptor = function(promise) {
			return promise.then(
				function(response) {
					return response;
				},
				function(response) {
					if(response.status == 403) {
						messageService.setError("Your session has expired.");
						auth.clear();
						$location.path('/');
					}
					return $q.reject(response);
				}
			);
		};
		return httpInterceptor;
	};
	
	
	angular.module('racepoint')
	.factory('apiUrl', apiUrlFactory)
	.factory('auth', authFactory)
	.factory('authHttp', authHttpFactory)
	.factory('httpInterceptor', httpInterceptorFactory);
	
})();
