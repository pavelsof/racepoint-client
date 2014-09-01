/* ѣ */
(function() {
	
	'use strict';
	
	var statsFactory = function($q, authHttp) {
		
		var Stats = {
			
			data: [],
			
			load: function() {
				var deferred = $q.defer();
				authHttp({
					url: '/stats/',
					method: 'GET'
				})
				.success(function(data, status, headers, config) {
					Stats.data = data;
					deferred.resolve();
				})
				.error(function(data, status, headers, config) {
					deferred.reject(data);
				});
				return deferred.promise;
			}
			
		};
		
		return Stats;
	};
	
	
	angular.module('racepoint')
	.factory('stats', statsFactory);
	
})();
