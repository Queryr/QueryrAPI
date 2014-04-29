'use strict';

var describeTypeSpecCreator = require( '../describe/describeTypeSpecCreator' );

describe( 'string TypeSpec instance', function() {
	describeTypeSpecCreator( 'string', {
		valid: [ '', ' ', 'foo', '42' ],
		invalid: [ 0, null, undefined, false, true, /./, new Date(), [], {} ]
	} );
} );
