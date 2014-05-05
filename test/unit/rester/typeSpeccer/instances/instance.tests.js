'use strict';

var describeTypeSpecCreator = require( '../describe/describeTypeSpecCreator' );

describe( 'instance TypeSpec instance', function() {
	describeTypeSpecCreator( 'instance', {
		descriptors: {
			'"of" allowing for Date instances': {
				'.of': Date,
				valid: [
					new Date(), new Date( '1.3.2014' ), new Date( Date.now() )
				],
				invalid: [
					0, null, undefined, false, true, 'foo', /./, [], {}
				]
			},
			'"of" allowing for regular expressions': {
				'.of': RegExp,
				valid: [
					new RegExp( '/.*/' ), /[a-z]+/i
				],
				invalid: [
					0, null, undefined, false, true, 'foo', new Date(), [], {}
				]
			}
		}
	} );
} );
