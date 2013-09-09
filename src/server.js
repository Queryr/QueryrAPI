'use strict';

var express = require('express');
var http = require('http');

var routes = require('./routes');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/src/public'));

if (app.get('env') === 'development') {
	app.use(express.errorHandler());
}

exports.app = app;

exports.start = function(log) {
	routes.setup(app);

	http.createServer(app).listen(
		app.get('port'),
		function() {
			log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
		}
	);
};