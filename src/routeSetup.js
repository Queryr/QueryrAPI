'use strict';

exports.run = function(app) {
	var routes = require('./routes/index');

	app.get('/', routes.index);

	app.get('/queries', routes.queries.list);
	app.get('/queries/:query', routes.queries.show);
	app.post('/queries/:query', routes.queries.create);
	app.delete('/queries/:query', routes.queries.delete);
	app.get('/queries/:query/results', routes.queries.showResults);

	app.get('/results', routes.results.list);
	app.get('/results/:result', routes.results.show);
	app.delete('/results/:result', routes.results.delete);

	app.post('/run', routes.run.run);
	app.post('/run/:query', routes.run.runQuery);

	app.get('/users/:user', routes.users.listPrivateQueries);
	app.get('/users/:user/queries', routes.users.listPrivateQueries);
	app.get('/users/:user/queries/public', routes.users.listPublicQueries);
	app.get('/users/:user/results', routes.users.listPrivateResults);
	app.get('/users/:user/results/public', routes.users.listPublicResults);

	// TODO: https://github.com/JeroenDeDauw/BeyondWikidata/blob/master/ApiSpec.md
};