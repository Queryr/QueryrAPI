'use strict';

exports.setup = function(app) {
	var routes = require('./routes/index');

	app.get('/', routes.index);

	app.get('/queries', routes.queries.list);
	app.get('/queries/:query', routes.queries.show);
	app.post('/queries/:query', routes.queries.create);
	app.delete('/queries/:query', routes.queries.delete);
	app.get('/queries/:query/results', routes.queries.showResults);

	// TODO: https://github.com/JeroenDeDauw/BeyondWikidata/blob/master/ApiSpec.md
};