'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var describeBasicValidatorsValidator = require( './describe/describeBasicValidatorsValidator' );

describe( 'basicValidators:ok', function() {
	var truthy = [
		true, -1, 1, 42, ' ', 'foo', '0', '-1', {}, [], /./, function() {}, new Date()
	];
	var falsy = [
		false, '', null, undefined, 0, NaN
	];

	describeBasicValidatorsValidator(
		'ok',
		_.map( truthy, toArray ),
		_.map( falsy, toArray )
	);
} );

function toArray( value ) {
	return [ value ];
}
