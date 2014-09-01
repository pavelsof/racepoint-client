/* ѣ */
(function() {
	
	'use strict';
	
	var teamListFactory = function($q, authHttp) {
		
		var TeamList = {
			
			teams: [],
			
			init: function() {
				if(localStorage.getItem('teamList')) {
					TeamList.teams = angular.fromJson(localStorage.getItem('teamList'));
				}
			},
			
			load: function() {
				var deferred = $q.defer();
				authHttp({
					url: '/teams/',
					method: 'GET'
				})
				.success(function(data, status, headers, config) {
					TeamList.teams = data;
					localStorage.setItem('teamList', angular.toJson(data));
					deferred.resolve();
				})
				.error(function(data, status, headers, config) {
					deferred.reject(data);
				});
				return deferred.promise;
			},
			
			getAll: function() {
				return TeamList.teams;
			},
			
			getTeam: function(teamId) {
				for(var i = 0; i < TeamList.teams.length; i++) {
					if(TeamList.teams[i].id == teamId) {
						return TeamList.teams[i];
					}
				}
				return null;
			},
			
			clear: function() {
				TeamList.teams = [];
				localStorage.removeItem('teamList');
			}
		};
		
		TeamList.init();
		return TeamList;
	};
	
	
	angular.module('racepoint')
	.factory('teamList', teamListFactory);
	
})();
