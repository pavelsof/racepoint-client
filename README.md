Racepoint
================

Racepoint is a web application to be used by urban race organisers for: 
* Logging of arrival and departure times of teams at control points.
* Registration of teams.
* Providing real-time information about team's progress through the race.

The web application was (and is being) developed for the purposes of [Shemetna Varna](http://shemetna-varna.org) – an urban race organised in Varna on an annual basis. Racepoint is an open source project and contributions are welcome.

Racepoint consists of a [Django server](http://github.com/pavelsof/racepoint-server) and an AngularJS client. This repository contains the latter.

Initialisation
---
Do something like:
```
git clone && cd
npm install
bower install
grunt build
```
The last one compiles it all into the `build` directory.

Workflow
---
`grunt serve` does `grunt build` and then starts a connect server on localhost:9000.

`karma start test/karma.js` starts the unit test watch.

Contributing
---
Pull requests are welcome. Stuff we need:
* More unit tests.
* E2E tests.

Licence
---
Racepoint is published under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0).
