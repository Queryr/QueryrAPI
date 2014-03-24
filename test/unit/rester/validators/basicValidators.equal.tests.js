'use strict';

var expect = require( 'expect.js' );

var validators = require( '../../../../' ).rester.validators;
var Validator = validators.Validator;
var Validators = validators.Validators;

describe( 'basicValidators:equal', function() {
	var basicValidators = new Validators();
	validators.basicValidators( basicValidators );

	var equalValidator = basicValidators.validator( 'equal' );

	var simpleValues = [
		true, false, null, undefined, 'foo', '', ' ', '0', 42, 0, -1, {}, [], Validator
	];
	var validArgumentsSet = [];
	var invalidArgumentsSet = [];

	for( var i = 0; i < simpleValues.length; i++ ) {
		var simpleValue = simpleValues[ i ];
		validArgumentsSet.push( [ simpleValue, simpleValue ] );

		for( var j = 0; j < simpleValues.length; j++ ) {
			if( i === j ) {
				continue;
			}
			var anotherSimpleValue = simpleValues[ j ];
			invalidArgumentsSet.push( [ simpleValue, anotherSimpleValue ] );
		}
	}

	describeParticularValidatorInstance( equalValidator, validArgumentsSet, invalidArgumentsSet );
} );

function describeParticularValidatorInstance( validator, validArgsSet, invalidArgsSet ) {
	it( 'is a Validator', function() {
		expect( validator ).to.be.a( Validator );
	} );

	describe( '#isValid()', function() {
		var i;
		for( i = 0; i < validArgsSet.length; i++ ) {
			var validArgs = validArgsSet[ i ];

			it( 'returns true if arguments for positive validation supplied', function() {
				var isValid = validator.isValid.apply( validator, validArgs );
				expect( isValid ).to.be( true );
			} );
		}
		for( i = 0; i < invalidArgsSet.length; i++ ) {
			var invalidArgs = invalidArgsSet[ i ];

			it( 'returns false if arguments for failing validation supplied', function() {
				var isValid = validator.isValid.apply( validator, invalidArgs );
				expect( isValid ).to.be( false );
			} );
		}
	} );

	describe( '#validate()', function() {
		var i;
		for( i = 0; i < validArgsSet.length; i++ ) {
			var validArgs = validArgsSet[ i ];

			it( 'throws no error if arguments for positive validation supplied', function() {
				expect( function() {
					validator.validate.apply( validator, validArgs );
				} ).to.not.throwError();
			} );
		}
		for( i = 0; i < invalidArgsSet.length; i++ ) {
			var invalidArgs = invalidArgsSet[ i ];

			it( 'throws an error if arguments for failing validation supplied', function() {
				expect( function() {
					validator.validate.apply( validator, invalidArgs );
				} ).to.throwError();
			} );
		}
	} );
}
