'use strict';

var express = require('express');
var http = require('http');

var routes = require('./src/routes');
var query = require('./src/routes/query');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/src/views');
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

app.get('/', routes.index);

app.get('/queries', query.list);
app.get('/queries/:query', query.show);
app.post('/queries/:query', query.create);
app.delete('/queries/:query', query.delete);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
