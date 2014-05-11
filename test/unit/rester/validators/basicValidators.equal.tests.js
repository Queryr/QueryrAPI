'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var describeBasicValidatorsValidator = require( './describe/describeBasicValidatorsValidator' );

describe( 'basicValidators:equal', function() {
	var simpleValues = [
		true, false, null, undefined, 'foo', '', ' ', '0', 42, 0, -1, {}, [], function() {}
	];
	var validArgumentsSet = [];
	var invalidArgumentsSet = [];

	_.each( simpleValues, function( simpleValue, i ) {
		validArgumentsSet.push( [ simpleValue, simpleValue ] );

		_.each( simpleValues, function( anotherSimpleValue, j ) {
			if( i !== j ) {
				invalidArgumentsSet.push( [ simpleValue, anotherSimpleValue ] );
			}
		} );
	} );

	invalidArgumentsSet = invalidArgumentsSet.concat( [
		[ {}, {} ],
		[ [], [] ],
		[ NaN, NaN ]
	] );

	describeBasicValidatorsValidator( 'equal', validArgumentsSet, invalidArgumentsSet );
} );
