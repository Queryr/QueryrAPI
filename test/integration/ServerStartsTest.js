'use strict';

var api = require('../../');
var http = require('http');
var server = api.server;

function httpGet(url, callback) {
	var request = http.get(url);
	request.on("response", function(response) {
		var receivedData = "";
		response.setEncoding("utf8");

		response.on("data", function(chunk) {
			receivedData += chunk;
		});
		response.on("end", function() {
			callback(response, receivedData);
		});
	});
}

exports.test = {

	setUp: function(done) {
		done();
	},

	'test can start server': function(test) {
		test.expect(1);

		var server = api.server;

		// This ensures the log function is getting called at least once.
		server.start( function() {
			test.ok(true);
			server.stop();
			test.done();
		} );
	},

	'test can get home page': function(test) {
		test.expect(2);

		server.start();

		httpGet("http://localhost:3000", function(response, receivedData) {
			var foundHomePage = receivedData.indexOf("Welcome to") !== -1;
			test.ok(foundHomePage, "home page should contain the test marker");

			var noBackdoor = receivedData.indexOf("backdoor") === -1;
			test.ok(noBackdoor, "home page should not contain any backdoor");

			server.stop();
			test.done();
		});
	}

};
