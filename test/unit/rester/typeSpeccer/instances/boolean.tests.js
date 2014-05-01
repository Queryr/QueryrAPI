'use strict';

var describeTypeSpecCreator = require( '../describe/describeTypeSpecCreator' );

describe( 'boolean TypeSpec instance', function() {
	describeTypeSpecCreator( 'boolean', {
		valid: [ true, false ],
		invalid: [ 0, null, undefined, 'foo', /./, new Date(), [], {} ]
	} );
} );