'use strict';

exports.queryr = {

	setUp: function(done) {
		done();
	},

	'no args': function(test) {
		test.expect(1);
		test.equal('awesome', 'awesome', 'should be awesome.');
		test.done();
	}

};
