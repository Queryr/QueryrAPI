var express = require('express');
var api = express();

api.get('/hello.txt', function(req, res){
	res.send('Hello World');
	console.log('Hello World');
});

api.listen(3000);
console.log('Listening on port 3000');