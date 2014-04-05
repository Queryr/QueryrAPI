'use strict';

var expect = require( 'expect.js' );
var sinon = require( 'sinon' );
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

		it( 'throws an error if fn is not a function, an object or undefined', function() {
			_.each(
				[ 0, null, false, true, 'foo' ],
				function( value ) {
					expect( function() {
						typeSpec.use( value );
					} ).to.throwError();
				}
			);
		} );
	} );

	describe( '#use()', function() {
		it( 'returns a function', function() {
			expect( typeSpec.use() ).to.be.a( Function );
		} );

		it( 'throws an error if descriptors are registered for the type spec', function() {
			typeSpec.descriptor( 'foo' );
			expect( function() { typeSpec.use(); } ).to.throwError();
		} );
	} );

	describe( '#use( descriptors )', function() {
		it( 'returns a function', function() {
			typeSpec.descriptor( 'foo' );
			expect( typeSpec.use( { foo: 'bar' } ) ).to.be.a( Function );
		} );
	} );

	describe( '#use()( value )', function() {
		it( 'returns the given value if it is valid', function() {
			expect( typeSpec.use()( 42 ) ).to.be( 42 );
		} );

		it( 'invokes a function x previously set via #use( x )', function() {
			var spy = sinon.stub().returns( true );
			typeSpec.use( spy );
			typeSpec.use()( 42 );

			expect( spy.calledOnce ).to.be( true );
			expect( spy.calledWith( 42 ) ).to.be( true );
		} );
	} );

	describe( '#use( descriptors )( value )', function() {
		var spyNumberIsValid;
		var spy42IsValid;

		beforeEach( function() {
			spyNumberIsValid = sinon.stub();
			spyNumberIsValid.returns( false );
			spyNumberIsValid.withArgs( sinon.match.number ).returns( true );

			spy42IsValid = sinon.stub();
			spy42IsValid.returns( false );
			spy42IsValid.withArgs( 42 ).returns( true );

			typeSpec.descriptor( 'foo' );
			typeSpec.use( spyNumberIsValid );
			typeSpec.use( spy42IsValid );
		} );
		
		it(
			'throws an error if given value is invalid, responsible function set via #use() got ' +
				'invoked, further function not called',
			function() {
				expect( function() {
					typeSpec.use( { foo: 'bar' } )( 'invalid-value' );
				} ).to.throwError();
				expect( spyNumberIsValid.calledOnce ).to.be( true );
				expect( spy42IsValid.called ).to.be( false );
			}
		);

		it( 'returns the given value if it is valid', function() {
			expect( typeSpec.use( { foo: 'bar' } )( 42 ) ).to.be( 42 );
		} );

		it( 'invokes functions previously set via #use()', function() {
			var descriptors = { foo: 'bar' };
			typeSpec.use( descriptors )( 42 );

			expect( spyNumberIsValid.calledOnce ).to.be( true );
			expect( spyNumberIsValid.calledWith( 42, sinon.match( descriptors ) ) ).to.be( true );

			expect( spy42IsValid.calledOnce ).to.be( true );
			expect( spy42IsValid.calledWith( 42, sinon.match( descriptors ) ) ).to.be( true );
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