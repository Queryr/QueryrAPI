'use strict';

var expect = require( 'expect.js' );

var Validator = require( '../../../../' ).rester.validators.Validator;

describe( 'Validator', function(){
	var validator;

	beforeEach( function() {
		validator = new Validator( function( value ) {
			return value === true;
		}, 'to be true' );
	} );

	describe( 'constructor', function() {
		it( 'throws an error if first param is not a function', function() {
			expect( function() {
				new Validator();
			} ).to.throwError();
			expect( function() {
				new Validator( 'foo', 'to be *' );
			} ).to.throwError();
		} );

		it( 'throws an error if first param is not a function', function() {
			function fnReturnTrue() {
				return true;
			}
			expect( function() {
				new Validator( fnReturnTrue );
			} ).to.throwError();
			expect( function() {
				new Validator( fnReturnTrue, {} );
			} ).to.throwError();
		} );
	} );

	describe( '#isValid()', function() {
		it( 'should be true if valid value is given', function() {
			expect( validator.isValid( true ) ).to.be( true );
		} );

		forEachInvalidValue( function( invalidValue, valueType ) {
			it( 'should be false if invalid ' + valueType + ' value is given', function() {
				expect( validator.isValid( invalidValue ) ).to.be( false );
			} );
		} );
	} );

	describe( '#validate()', function() {
		it( 'should throw no error if valid value is given', function() {
			expect( function() { validator.validate( true ); } ).to.not.throwError();
		} );

		forEachInvalidValue( function( invalidValue, valueType ) {
			it( 'should throw an error if invalid ' + valueType + ' value is given', function() {
				expect( function() { validator.validate( invalidValue ); } ).to.throwError();
			} );
		} );
	} );

	function forEachInvalidValue( callback ) {
		var invalidValues = {
			number: 42,
			undefined: undefined,
			'null': null,
			string: 'foo',
			regex: /./,
			'object literal': {},
			'array literal': [],
			'Date object': new Date()
		};
		for( var valueType in invalidValues ) {
			callback( invalidValues[ valueType ], valueType );
		}
	}
} );
