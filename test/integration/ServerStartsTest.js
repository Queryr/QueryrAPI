'use strict';

var api = require('../../');

exports['test'] = {

	setUp: function(done) {
		done();
	},

	'test can start server': function(test) {
		test.expect(1);

		var server = api.server;

		// This ensures the log function is getting called at least once.
		server.start( function() {
			test.ok(true);
			test.done();
		} );

		// TODO: assert is serving

		server.stop();

		// TODO: assert stopped serving
	}

};