'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var TypeSpec = require( '../../../../' ).rester.typeSpeccer.TypeSpec;
var Validators = require( '../../../../' ).rester.validators.Validators;

describe( 'TypeSpec', function() {
	var typeSpec;

	beforeEach( function() {
		typeSpec = new TypeSpec( 'test' );
	} );

	describe( 'constructor', function() {
		it( 'throws an error if name is not a string', function() {
			var nonStringValues = [ 0, null, false, true, undefined, {}, /./, function() {} ];

			_.each( nonStringValues, function( value ) {
				expect( function() {
					new TypeSpec( value );
				} ).to.throwError();
			} );
		} );

		it( 'throws an error if name is an empty string', function() {
			expect( function() {
				new TypeSpec( '' );
			} ).to.throwError();

		} );

		it( 'takes a string as name', function() {
			expect( new TypeSpec( 'foo' ) ).to.be.a( TypeSpec );

		} );
	} );

	describe( '#name()', function() {
		it( 'returns the name given to the constructor', function() {
			var typeSpec = new TypeSpec( 'foo' );
			expect( typeSpec.name() ).to.be( 'foo' );
		} );
	} );

	describe( '#use( fn )', function() {
		it( 'allows to set a function', function() {
			expect( typeSpec.use( function() {} ) ).to.be( typeSpec );
		} );

		it( 'throws an error if fn is not a function', function() {
			var nonFnValues = [ 0, null, false, true, undefined, {}, /./, 'foo' ];

			_.each( nonFnValues, function( value ) {
				expect( function() {
					typeSpec.use( value );
				} ).to.throwError();
			} );
		} );
	} );

	describe( '#validators( validators ).validators()', function() {
		it( 'returns validators', function() {
			var validators = new Validators();
			expect( typeSpec.validators( validators ).validators() ).to.be( validators );
		} );
	} );

	describe( '#property( name, ofType )', function() {
		it( 'throws an error if ofType is neither null nor a TypeSpec instance', function() {
			var nonNullNonTypeSpecValues = [ 0, false, true, {}, /./, 'foo' ];

			_.each( nonNullNonTypeSpecValues, function( value ) {
				expect( function() {
					typeSpec.property( 'foo', value );
				} ).to.throwError();
			} );
		} );

		describe( '.property()', function() {
			it( 'returns TypeSpec instance set via the setter', function() {
				var someType = new TypeSpec( 'someType' );
				expect( typeSpec.property( 'foo', someType ).property( 'foo' ) ).to.be( someType );
			} );
	
			it( 'returns null if null is set via the setter', function() {
				var someType = null;
				expect( typeSpec.property( 'foo', null ).property( 'foo' ) ).to.be( null );
			} );
		} );
	} );
} );