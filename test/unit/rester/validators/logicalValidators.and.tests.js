'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var describeLogicalValidatorsValidator = require( './describe/describeLogicalValidatorsValidator' );

describe( 'logicValidators:and', function() {
	describeLogicalValidatorsValidator(
		'and',
		[
			[ true, true ],
			[ 1, 1 ],
			[ true, 1 ],
			[ 'foo', true ],
			[ {}, [] ],
			[ true, true, true ],
			[ ' ', '1', '0' ]
		], [
			[ true /*, undefined */ ],
			[ false, true ],
			[ false, false ],
			[ false, false, true ],
			[ true, true, false ],
			[ 0, true ],
			[ '', 0 ]
		]
	);
} );
