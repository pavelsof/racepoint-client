/* ѣ */
(function() {
	
	'use strict';
	
	var TeamController = function($scope, $routeParams, $location, messageService, teamList, authHttp) {
		
		$scope.team = teamList.getTeam($routeParams.id);
		
		$scope.remove = function() {
			authHttp({
				url: '/teams/',
				method: 'DELETE',
				data: {
					id: parseInt($routeParams.id)
				}
			})
			.success(function(data, status, headers, config) {
				messageService.setDone("Team deleted.");
				$location.path('/teams');
			})
			.error(function(data, status, headers, config) {
				messageService.setError(data);
			});
		};
		
	};
	
	angular.module('racepoint')
	.controller('TeamController', TeamController);
	
})();
