/* ѣ */
(function() {
	
	'use strict';
	
	var networkFactory = function() {
		var Network = {
			
			init: function() {
				
			}
			
		};
		
		Network.init();
		return Network;
	};
	
	
	angular.module('racepoint')
	.factory('network', networkFactory);
	
})();
