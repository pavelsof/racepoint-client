/* ѣ */
(function() {
	
	'use strict';
	
	var app = angular.module(
		'racepoint',
		[
			'ngRoute'
		]
	);
	
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/', {
			controller: 'GatewayController',
			templateUrl: 'views/gateway.html'
		})
		.when('/teams', {
			controller: 'TeamsController',
			templateUrl: 'views/teams/list.html'
		})
		.when('/teams/add', {
			controller: 'AddTeamController',
			templateUrl: 'views/teams/add.html'
		})
		.when('/teams/:id', {
			controller: 'TeamController',
			templateUrl: 'views/teams/single.html'
		})
		.when('/logbook', {
			controller: 'LogbookController',
			templateUrl: 'views/logbook/main.html'
		})
		.when('/stats', {
			controller: 'StatsController',
			templateUrl: 'views/stats/main.html'
		})
		.otherwise({
			redirectTo: '/'
		});
	}]);
	
	app.config(['$httpProvider', function($httpProvider) {
		$httpProvider.responseInterceptors.push('httpInterceptor');
	}]);
	
	app.run(['$rootScope', 'messageService', function($rootScope, messageService) {
		$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
			messageService.setError("The app wanted to commit suicide.");
		});
	}]);
	
})();
