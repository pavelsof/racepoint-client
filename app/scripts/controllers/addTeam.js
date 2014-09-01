/* ѣ */
(function() {
	
	'use strict';
	
	var AddTeamController = function($scope, $location, messageService, authHttp) {
		
		$scope.team = {
			name: "",
			players: [
				{name: ""},
				{name: ""},
				{name: ""},
				{name: ""}
			]
		};
		
		$scope.submit = function() {
			var players = [];
			angular.forEach($scope.team.players, function(player, key) {
				players.push(player.name);
			});
			
			authHttp({
				url: '/teams/',
				method: 'PUT',
				data: {
					name: $scope.team.name,
					players: players
				}
			})
			.success(function(data, status, headers, config) {
				messageService.setDone("Team added!");
				$location.path('/teams');
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
	.controller('AddTeamController', AddTeamController);
	
})();
