'use strict';

var expect = require( 'expect.js' );

var Validators = require( '../../../../' ).rester.validators.Validators;
var Validator = require( '../../../../' ).rester.validators.Validator;

describe( 'Validators', function() {
	var validator = new Validator( function() { return true; }, 'to be anything' );
	var validators;

	beforeEach( function() {
		validators = new Validators();
	} );

	it( 'has a length of 0 after construction', function() {
		expect( validators.length ).to.be( 0 );
	} );

	describe( '#set( name, validator )', function() {
		it( 'returns a self-reference', function() {
			expect( validators.set( 'foo', validator ) ).to.be( validators );
		} );

		it( 'should increase the "length" property', function() {
			validators.set( 'foo', validator );
			expect( validators.length ).to.be( 1 );
		} );

		it( 'allows setting the same validator under different names', function() {
			validators.set( 'foo', validator );
			validators.set( 'bar', validator );
			expect( validators.length ).to.be( 2 );
		} );

		it( 'should not increase the "length" property when overwriting a validator', function() {
			validators.set( 'foo', validator );
			validators.set( 'foo', new Validator( function() { return true; }, 'to be *' ) );
			expect( validators.length ).to.be( 1 );
		} );
	} );

	describe( '#get( name )', function() {
		it( 'returns null if no Validator has been set for given name', function() {
			expect( validators.get( 'foo' ) ).to.be( null );
		} );
		
		it( 'returns the Validator instance previously registered under the given name', function() {
			validators.set( 'foo', validator );
			expect( validators.get( 'foo' ) ).to.be( validator );
		} );
	} );
} );