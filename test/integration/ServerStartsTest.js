'use strict';

var api = require('../../');

exports['test'] = {

	setUp: function(done) {
		done();
	},

	'test can start server': function(test) {
		test.expect(1);

		var server = api.server;
		// TODO

		test.equal('awesome', 'awesome', 'should be awesome.');
		test.done();
	}

};