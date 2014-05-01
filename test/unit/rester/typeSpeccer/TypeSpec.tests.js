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
			expect( new TypeSpec( 'foo' ).name() ).to.be( 'foo' );
		} );
	} );

	describe( '#descriptor()', function() {
		it( 'returns a self-reference', function() {
			expect( typeSpec.descriptor( 'foo' ) ).to.be( typeSpec );
		} );
	} );

	describe( '#descriptor.get()', function() {
		it( 'returns null if descriptor has not been set', function() {
			expect( typeSpec.descriptor.get( 'unknownDescriptor' ) ).to.be( null );
		} );
	} );

	describe( '#descriptor( name ) and #descriptor.get()', function() {
		it( 'returns a full descriptor object', function() {
			expect(
				typeSpec.descriptor( 'foo' ).descriptor.get( 'foo' )
			).to.eql( {
				validate: TypeSpec.OPTIONAL_DESCRIPTOR,
				compare: TypeSpec.SIMPLE_DESCRIPTOR_EQUALITY
			} );
		} );
	} );

	describe( '#descriptor( object ) and #descriptor.get()', function() {
		it( 'returns an object with omitted values set to default values', function() {
			expect(
				typeSpec.descriptor( {
					name: 'foo'
				} ).descriptor.get( 'foo' )
			).to.eql( {
				validate: TypeSpec.OPTIONAL_DESCRIPTOR,
				compare: TypeSpec.SIMPLE_DESCRIPTOR_EQUALITY
			} );
		} );

		it( 'returns a copy of the object set, not the original instance or the internal one', function() {
			var originalObj = { name: 'foo' };
			var descriptorObj = typeSpec.descriptor( originalObj ).descriptor.get( originalObj.name );
			expect( descriptorObj ).not.to.be( originalObj );
			expect( typeSpec.descriptor.get( originalObj.name ) ).not.to.be( descriptorObj );
		} );
		
		it( 'returns an object with validate and compare fields as given', function() {
			var fn1 = function() {};
			var fn2 = function() {};
			expect(
				typeSpec.descriptor( {
					name: 'foo',
					validate: fn1,
					compare: fn2
				} ).descriptor.get( 'foo' )
			).to.eql( {
				validate: fn1,
				compare: fn2
			} );
		} );
	} );

	describe( '#descriptor( name, validationFn )', function() {
		it( 'returns a full descriptor object with validatorFn as validator', function() {
			var fn1 = function() {};
			expect(
				typeSpec.descriptor( 'foo', fn1 ).descriptor.get( 'foo' )
			).to.eql( {
				validate: fn1,
				compare: TypeSpec.SIMPLE_DESCRIPTOR_EQUALITY
			} );
		} );
	} );

	describe( '#descriptors()', function() {
		it( 'returns an object but not the internal one', function() {
			expect( typeSpec.descriptors() ).to.be.an( Object );
			expect( typeSpec.descriptors() ).not.to.be( typeSpec.descriptors() );
		} );

		it( 'returns all descriptor objects set so far but not as reference to the internal ones', function() {
			typeSpec.descriptor( 'foo' );
			typeSpec.descriptor( 'bar' );
			typeSpec.descriptor( {
				name: 'another'
			} );
			expect( _.keys( typeSpec.descriptors() ) ).to.eql( [ 'foo', 'bar', 'another' ] );
			_.each( typeSpec.descriptors(), function( descriptor, name ) {
				expect( descriptor ).to.eql( typeSpec.descriptor.get( name ) );
				expect( descriptor ).not.to.be( typeSpec.descriptor.get( name ) );
			} );
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

		it( 'throws an error if required descriptor is registered for the type spec but no value '
			+ 'provided for that descriptor',
			function() {
				typeSpec.descriptor( 'foo', TypeSpec.REQUIRED_DESCRIPTOR );
				expect( function() { typeSpec.use(); } ).to.throwError();
			}
		);

		it( 'throws no error if descriptor registered for type but not given if optional descriptor',
			function() {
				typeSpec.descriptor( 'foo', TypeSpec.OPTIONAL_DESCRIPTOR );
				expect( function() { typeSpec.use(); } ).to.not.throwError();
			}
		);

		it( 'registered descriptors not required by default', function() {
			typeSpec.descriptor( 'foo' );
			expect( function() { typeSpec.use(); } ).to.not.throwError();
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