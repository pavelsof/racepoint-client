/* ѣ */
(function() {
	
	'use strict';
	
	var StatsController = function($scope, messageService, stats) {
		
		$scope.nav = {
			team: 0
		};
		$scope.stats = [];
		
		$scope.sync = function() {
			messageService.setInfo("Downloading...");
			stats.load().then(
				function() {
					$scope.stats = stats.data;
					messageService.setDone("Downloaded!");
				},
				function(error) {
					messageService.setError(error);
				}
			);
		};
		
		$scope.sync();
		
	};
	
	angular.module('racepoint')
	.controller('StatsController', StatsController);
	
})();
