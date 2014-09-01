/* ѣ */
(function() {
	
	'use strict';
	
	var logbookFactory = function($q, $timeout, authHttp, teamList) {
		
		var Logbook = {
			
			openLogs: [],
			logs: [],
			
			init: function() {
				if(localStorage.getItem('openLogs')) {
					Logbook.openLogs = angular.fromJson(localStorage.getItem('openLogs'));
				}
				if(localStorage.getItem('logs')) {
					Logbook.logs = angular.fromJson(localStorage.getItem('logs'));
				}
			},
			
			sync: {
				error: null,
				
				start: function() {
					var deferred = $q.defer();
					Logbook.sync.upload()
					.then(Logbook.sync.download)
					.then(
						function() {
							localStorage.setItem('logs', angular.toJson(Logbook.logs));
							deferred.resolve();
						},
						function() {
							deferred.reject(Logbook.sync.error);
						}
					);
					return deferred.promise;
				},
				
				upload: function() {
					var promises = [];
					angular.forEach(Logbook.logs, function(log, key) {
						if(!log.synced) {
							var deferred = $q.defer();
							authHttp({
								url: '/log/',
								method: 'PUT',
								data: {
									team_id: log.teamId,
									event_type: log.type,
									timestamp: log.timestamp
								}
							})
							.success(function(data, status, headers, config) {
								log.id = data.id;
								log.synced = true;
								deferred.resolve();
							})
							.error(function(data, status, headers, config) {
								Logbook.sync.error = data;
								deferred.reject();
							});
							promises.push(deferred.promise);
						}
					});
					return $q.all(promises);
				},
				
				download: function() {
					var deferred = $q.defer();
					authHttp({
						url: '/log/',
						method: 'GET'
					})
					.success(function(data, status, headers, config) {
						var logs = [];
						angular.forEach(data, function(item, key) {
							var log = new Logbook.Event(item.teamId, item.type);
							log.teamName = item.teamName;
							log.timestamp = item.timestamp;
							log.isSuccessful = item.isSuccessful;
							log.synced = true;
							logs.push(log);
						});
						Logbook.logs = logs;
						localStorage.setItem('logs', angular.toJson(Logbook.logs));
						deferred.resolve();
					})
					.error(function(data, status, headers, config) {
						Logbook.sync.error = data;
						deferred.reject();
					});
					return deferred.promise;
				}
			},
			
			getOpenLogs: function() {
				return Logbook.openLogs;
			},
			
			getLogs: function() {
				var list = [];
				angular.forEach(Logbook.logs, function(entry, key) {
					list.push({
						id: entry.id,
						synced: entry.synced,
						teamName: entry.teamName,
						type: entry.type,
						timestamp: entry.timestamp
					});
				});
				return list;
			},
			
			addArrival: function(teamId) {
				var team = teamList.getTeam(teamId);
				Logbook.openLogs.push({
					teamId: team.id,
					teamName: team.name,
					timestamp: Date.now()
				});
				localStorage.setItem('openLogs', angular.toJson(Logbook.openLogs));
			},
			
			addDeparture: function(teamId) {
				var openLog = null;
				for(var i = 0; i <= Logbook.openLogs.length; i++) {
					if(Logbook.openLogs[i].teamId == teamId) {
						openLog = Logbook.openLogs[i];
						break;
					}
				}
				if(!openLog) {
					return false;
				}
				
				var arrival = new Logbook.Event(openLog.teamId, 'ARR');
				var departure = new Logbook.Event(openLog.teamId, 'DEP');
				arrival.timestamp = openLog.timestamp;
				arrival.teamName = openLog.teamName;
				departure.teamName = openLog.teamName;
				
				Logbook.openLogs.splice(i, 1);
				Logbook.logs.push(arrival);
				Logbook.logs.push(departure);
				
				localStorage.setItem('openLogs', angular.toJson(Logbook.openLogs));
				localStorage.setItem('logs', angular.toJson(Logbook.logs));
			},
			
			removeLog: function(timestamp) {
				for(var i = 0; i <= Logbook.logs.length; i++) {
					if(timestamp == Logbook.logs[i].timestamp) {
						break;
					}
				}
				if(!Logbook.logs[i].synced) {
					Logbook.logs.splice(i, 1);
					localStorage.setItem('logs', angular.toJson(Logbook.logs));
				}
			},
			
			clear: function() {
				Logbook.openLogs = [];
				Logbook.logs = [];
				localStorage.removeItem('openLogs');
				localStorage.removeItem('logs');
			},
			
			Event: function(teamId, type) {
				var Event = {
					id: null,
					synced: false,
					teamId: null,
					teamName: null,
					type: null,
					timestamp: null,
					isSuccessful: false
				};
				
				Event.teamId = teamId;
				Event.type = type;
				Event.timestamp = Date.now();
				
				return Event;
			}
			
		};
		
		Logbook.init();
		return Logbook;
	};
	
	
	angular.module('racepoint')
	.factory('logbook', logbookFactory);
	
})();
