'use strict';

module.exports = describeParticularValidatorInstance;

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var Validator = require( '../../../../../' ).rester.validators.Validator;

function describeParticularValidatorInstance( validator, validArgsSet, invalidArgsSet ) {
	it( 'is a Validator instance', function() {
		expect( validator ).to.be.a( Validator );
	} );

	validArgsSet = _.map( validArgsSet, normalizeArgsArray );
	invalidArgsSet = _.map( invalidArgsSet, normalizeArgsArray );

	describe( '#isValid()', function() {
		_.each( validArgsSet, function( args ) {
			it(
				'returns true if arguments [' + args + '] for positive validation supplied',
				function() {
					var isValid = validator.isValid.apply( validator, args );
					expect( isValid ).to.be( true );
				}
			);
		} );
		_.each( invalidArgsSet, function( args ) {
			it(
				'returns false if arguments [' + args + '] for failing validation supplied',
				function() {
					var isValid = validator.isValid.apply( validator, args );
					expect( isValid ).to.be( false );
				}
			);
		} );
	} );

	describe( '#validate()', function() {
		_.each( validArgsSet, function( args ) {
			it(
				'throws no error if arguments [' + args + '] for positive validation supplied',
				function() {
					expect( function() {
						validator.validate.apply( validator, args );
					} ).to.not.throwError();
				}
			);
			it( 'returns a self-reference', function() {
				expect( validator.validate.apply( validator, args ) ).to.be( validator );
			} );
		} );
		_.each( invalidArgsSet, function( args ) {
			it(
				'throws an error if arguments [' + args + '] for failing validation supplied',
				function() {
					expect( function() {
						validator.validate.apply( validator, args );
					} ).to.throwError();
				}
			);
		} );
	} );
}

function normalizeArgsArray( args ) {
	return  _.isArray( args ) ? args : [ args ];
}