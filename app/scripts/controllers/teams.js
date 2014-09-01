/* ѣ */
(function() {
	
	'use strict';
	
	var TeamsController = function($scope, messageService, teamList) {
		
		$scope.teams = [];
		
		var promise = teamList.load();
		promise.then(
			function() {
				$scope.teams = teamList.getAll();
				messageService.setDone("Synchronised!");
			},
			function(error) {
				messageService.setError(error);
			}
		);
		
	};
	
	angular.module('racepoint')
	.controller('TeamsController', TeamsController);
	
})();
