/* ѣ */

describe('services', function() {
	
	var service = null;
	var backend = null;
	
	beforeEach(module('racepoint'));
	
	describe('logbook', function() {
		beforeEach(function() {
			var mockTeamList = {
				getTeam: function(teamId) {
					return {
						id: teamId,
						name: "team",
						players: ["one", "two", "three", "four"]
					};
				}
			};
			module(function($provide) {
				$provide.value('teamList', mockTeamList);
			});
		});
		beforeEach(inject(function($httpBackend, logbook) {
			backend = $httpBackend;
			service = logbook;
		}));
		
		it('plays well with controllers', function() {
			var lastTeamId = 1;
			var countTeamsHere = 0;
			var countLogEntries = 0;
			
			expect(service.openLogs).toEqual([]);
			expect(service.logs).toEqual([]);
			
			for(var i=0; i < 42; i++) {
				var random = Math.floor(Math.random()*3);
				if(random == 0) {
					service.addArrival(lastTeamId);
					lastTeamId += 1;
					countTeamsHere += 1;
				} else if(random == 1) {
					if(countTeamsHere) {
						var teamToDepart = Math.floor(Math.random()*countTeamsHere);
						teamToDepart = service.openLogs[teamToDepart].teamId;
						service.addDeparture(teamToDepart);
						countTeamsHere -= 1;
						countLogEntries += 2;
					}
				} else {
					if(countLogEntries) {
						var logToRemove = Math.floor(Math.random()*countLogEntries);
						logToRemove = service.logs[logToRemove].timestamp;
						service.removeLog(logToRemove);
						countLogEntries -= 1;
					}
				}
				expect(service.openLogs.length).toEqual(countTeamsHere);
				expect(service.logs.length).toEqual(countLogEntries);
			}
		});
		
		afterEach(function() {
			service.clear();
		});
	});
	
	describe('teamList', function() {
		beforeEach(inject(function($httpBackend, apiUrl, teamList) {
			backend = $httpBackend;
			backend.expectGET(apiUrl + '/teams/')
			.respond([
				{id: 1, name: "Cyrillic Alphabet", players: ["А", "Б", "В", "Г"]},
				{id: 2, name: "Roman Alphabet", players: ["A", "B", "C", "D"]}
			]);
			service = teamList;
		}));
		
		it('should be tested', function() {
			expect(service.teams).toEqual([]);
			service.load();
			backend.flush();
			expect(service.teams.length).toEqual(2);
			expect(service.getTeam(3)).toBe(null);
			
			var cyrillicAlphabet = service.getTeam(1);
			expect(cyrillicAlphabet.id).toEqual(1);
			expect(cyrillicAlphabet.name).toEqual("Cyrillic Alphabet");
			expect(cyrillicAlphabet.players).toEqual(["А", "Б", "В", "Г"]);
		});
		
		afterEach(function() {
			service.clear();
		});
	});
	
});
