/* ѣ */
(function() {
	
	'use strict';
	
	var LogbookController = function($scope, messageService, teamList, logbook) {
		
		/* common */
		$scope.teams = [];
		teamList.load().then(
			function() {
				$scope.teams = teamList.getAll();
			},
			function(error) {
				messageService.setError(error);
			}
		);
		
		/* internal navigation */
		$scope.nav = {
			tab: 2,
			log: null
		};
		$scope.$watch('nav.tab', function(newValue) {
			if(newValue === 0) {
				$scope.arrival = {
					team: null
				};
			} else if(newValue == 1) {
				$scope.openLogs = logbook.getOpenLogs();
			} else {
				$scope.logs = logbook.getLogs();
			}
		});
		
		/* add arrival */
		$scope.addArrival = function() {
			if($scope.arrival.team) {
				logbook.addArrival($scope.arrival.team);
				$scope.nav.tab += 1;
			}
		};
		
		
		/* open logs */
		$scope.addDeparture = function(teamId) {
			logbook.addDeparture(teamId);
			$scope.nav.tab += 1;
		};
		
		/* past logs */
		$scope.sync = function() {
			messageService.setInfo("Syncing...");
			logbook.sync.start()
			.then(
				function() {
					$scope.logs = logbook.getLogs();
					messageService.setDone("Synchronised!");
				},
				function(error) {
					messageService.setError(error);
				}
			);
		};
		$scope.removeLog = function(logTimestamp) {
			logbook.removeLog(logTimestamp);
			$scope.nav.tab -= 1;
		};
		
		/* init */
		$scope.sync();
		
	};
	
	angular.module('racepoint')
	.controller('LogbookController', LogbookController);
	
})();
