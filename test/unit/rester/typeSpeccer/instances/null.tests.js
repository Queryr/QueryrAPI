'use strict';

var describeTypeSpecCreator = require( '../describe/describeTypeSpecCreator' );

describe( 'null TypeSpec instance', function() {
	describeTypeSpecCreator( 'null', {
		valid: [ null ],
		invalid: [ 0, undefined, false, true, 'foo', /./, new Date(), [], {} ]
	} );
} );
