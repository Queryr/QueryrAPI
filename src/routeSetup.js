'use strict';

exports.run = function(app) {
	var routes = require('./routes/index');

	var sys = require("sys");


	app.get('/', function(req, res, next ) {
		//res.send('foo');
		next();
	} );

	app.use('/foo/bar', function(req, res, next ) {
		//res.send('/foo/bar');
		next();
	} );

	app.use('/foo', function(req, res, next ) {
		res.send('foo');
		next();
	} );


	// TODO: could use "pluralize" for resource.via.plural()
	var rester = require( 'rester' );
	rester = function() {
		// TODO
	};

	var restApi = rester();

	var Model = rester.model.Model;
	var fields = rester.model.fields;

	var models = require( './models' ); // Queryr models

	models.QueryrModel = Model.extend( {} );


	models.Query =

	restApi.resource( 'query' )
		.via.path( '/queries' )
		.model( models.Query )
	;
	restApi.resource( 'result' )
		.via.path( '/results' )
	;
	restApi.resource( 'user' )
		.via.path( '/users' )
		// TODO: describe structure, e.g. field "queries" and its type
	;
	restApi.resource( 'entity' )
		.via.path( '/entities' )
	;


	app.get('/', routes.index);

	app.get('/queries', routes.queries.list);
	app.get('/queries/:query', routes.queries.show);
	app.post('/queries/:query', routes.queries.create);
	app.delete('/queries/:query', routes.queries.delete);
	app.get('/queries/:query/results', routes.queries.showResults);

	// TODO: have following instead of "/results" ?
	// '/queries/:query/result' // latest result
	// '/queries/:query/results/:result'

	app.get('/results', routes.results.list);
	app.get('/results/:result', routes.results.show);
	app.delete('/results/:result', routes.results.delete);

	app.post('/run', routes.run.run);
	app.post('/run/:query', routes.run.runQuery);

	app.get('/users/:user', routes.users.show);
	app.get('/users/:user/queries', routes.users.listPrivateQueries);
	app.get('/users/:user/queries/public', routes.users.listPublicQueries);
	app.get('/users/:user/results', routes.users.listPrivateResults);
	app.get('/users/:user/results/public', routes.users.listPublicResults);

	app.get('/entities/:entity', routes.entities.show);
	app.get('/entities/:entity/info', routes.entities.showInfo);

	// TODO: https://github.com/JeroenDeDauw/BeyondWikidata/blob/master/ApiSpec.md
};