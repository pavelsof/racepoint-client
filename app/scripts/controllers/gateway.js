/* ѣ */
(function() {
	
	'use strict';
	
	var GatewayController = function($scope, $http, $location, messageService, apiUrl, auth) {
		
		$scope.input = {
			password: ""
		};
		
		$scope.submit = function() {
			messageService.setInfo("Loading...");
			$http({
				url: apiUrl + '/auth/',
				method: 'POST',
				data: $scope.input
			})
			.success(function(data, status, headers, config) {
				auth.setToken(data.token);
				if(data.role == 'REG') {
					$location.path('/teams');
				}
				else {
					$location.path('/logbook');
				}
			})
			.error(function(data, status, headers, config) {
				if(status == 400) {
					messageService.setError(data);
				}
				else {
					messageService.setError("Could not talk to server.");
				}
			});
		};
		
	};
	
	angular.module('racepoint')
	.controller('GatewayController', GatewayController);
	
})();
