'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var rester = require( '../../../../' ).rester;
var ModelField = rester.model.ModelField;
var Assertion = rester.assert.Assertion;
var TypeSpec = rester.typeSpeccer.TypeSpec;

var someType =
	new TypeSpec( 'someType' )
		.validator( 'someValidator', function() { return true; }, 'to be anything' )
		.validator( 'someValidator2', function() { return true; }, 'to be anything too' )
;
var assertionOfUnknownType = new Assertion( 'equal', Assertion.unknown.and( [ 'foo' ] ) );
var assertionOfKnownType = new Assertion( 'someValidator', Assertion.unknown.only );
var assertionOfKnownType2 = new Assertion( 'someValidator2', Assertion.unknown.only );
var assertionOfKnownTypeWithoutUnknown = new Assertion( 'someValidator', [ true ] );

expect( assertionOfKnownType.equals( assertionOfKnownType2 ) ).to.be( false );

function newInstance( params ) {
	return new ModelField( params[0], params[1], params[2] );
}

describe( 'ModelField', function() {
	describe( 'constructor', function() {
		var errorCases = {
			'given assertion is not known by used type': [
				someType, {}, assertionOfUnknownType
			],
			'given assertion is known but without unknown as descriptor' : [
				someType, {}, assertionOfKnownTypeWithoutUnknown
			],
			'bad value given instead of TypeSpec': [
				'foo', {}, assertionOfKnownType
			],
			'bad value given instead of Assertion or null': [
				someType, {}, 'foo'
			],
			'bad value given instead of descriptor': [
				someType, 'foo', assertionOfKnownType
			]
		};
		_.each( errorCases, function( constructorParams, caseDescription ) {
			it( 'throws an error if ' + caseDescription, function() {
				expect( function() {
					newInstance( constructorParams );
				} ).to.throwError();
			} );
		} );
	} );

	var cases = {
		'all parameters given, assertion\'s type known by field type': [
			someType, { foo: 'bar' }, assertionOfKnownType
		],
		'assertion omitted': [
			someType, {}
		],
		'null for assertion': [
			someType, {}, null
		],
		'assertion and descriptors omitted': [
			someType
		]
	};
	_.each( cases, function( constructorParams, caseDescription ) {
		describe( '(constructor params: ' + caseDescription + ')', function() {
			describeModelFieldWithConstructorParams( constructorParams );
		} );
	} );
} );

function describeModelFieldWithConstructorParams( constructorParams ) {
	var field;

	beforeEach( function() {
		field = newInstance( constructorParams );
	} );

	describe( 'constructor', function() {
		it( 'creates instance without error', function() {
			expect( newInstance( constructorParams ) ).to.be.a( ModelField );
		} );
	} );

	describe( '#type()', function() {
		it(
			'returns the type given to the constructor)',
			function() {
				expect( newInstance( constructorParams ).type() ).to.be( constructorParams[0] );
			}
		);
	} );

	describe( '#descriptors()', function() {
		it(
			'returns the descriptors given to the constructor or empty object if omitted in constructor',
			function() {
				expect(
					newInstance( constructorParams ).descriptors()
				).to.eql( constructorParams[1] || {} );
			}
		);
		// TODO: test no reference but copy
	} );

	describe( '#descriptors( newDescriptors )', function() {
		it(
			'throws an error if new descriptors are not given as object',
			function() {
				expect( function() {
					field.descriptors( 'foo' );
				} ).to.throwError();
			}
		);
		it(
			'returns an equal instance with the descriptors changed to an object',
			function() {
				var fieldCopy = field.descriptors( { answer: 42 } );
				expectChangedCopy( field, fieldCopy, { descriptors: { answer: 42 } } );
			}
		);
		it(
			'returns an equal instance with the descriptors changed to an empty object',
			function() {
				var fieldCopy = field.descriptors( {} );
				expectChangedCopy( field, fieldCopy, { descriptors: {} } );
			}
		);
	} );

	describe( '#assertion()', function() {
		if( constructorParams[2] instanceof Assertion ) {
			it(
				'returns the assertion given to the constructor)',
				function() {
					expect( field.assertion().equals( constructorParams[2] ) ).to.be( true );
				}
			);
		} else {
			it(
				'returns null',
				function() {
					expect( field.assertion() ).to.be( null );
				}
			);
		}
	} );

	describe( '#assertion( newAssertion )', function() {
		it(
			'throws an error if new assertion is not an Assertion or null',
			function() {
				expect( function() {
					field.assertion( 'foo' );
				} ).to.throwError();
			}
		);
		it(
			'returns an equal instance with the assertion changed to another assertion',
			function() {
				var fieldCopy = field.assertion( assertionOfKnownType2 );
				expectChangedCopy( field, fieldCopy, { assertion: assertionOfKnownType2 }  );
			}
		);
		it(
			'returns an equal instance with the assertion changed to null',
			function() {
				var fieldCopy = field.assertion( null );
				expectChangedCopy( field, fieldCopy, { assertion: null }  );
			}
		);
	} );

	describe( '#copy()', function() {
		it( 'returns an exact copy', function() {
			var fieldCopy = field.copy();
			expectChangedCopy( field, fieldCopy, {} );
		} );
	} );

	describe( '#copy( changes )', function() {
		it( 'returns a copy with overwritten descriptors and assertion', function() {
			var fieldCopy = field.copy( {
				descriptors: { foo: 123 },
				assertion: assertionOfKnownType2
			} );
			expectChangedCopy( field, fieldCopy, {
				descriptors: { foo: 123 },
				assertion: assertionOfKnownType2
			} );
		} );
	} );
}

function expectChangedCopy( field, fieldCopy, changedValues ) {
	expect( fieldCopy ).not.to.be( field );

	_.each( [ 'type', 'descriptors', 'assertion' ], function( fnName ) {
		if( !_.contains( _.keys( changedValues ), fnName ) ) {
			expect( field[ fnName ]() ).to.eql( fieldCopy[ fnName ]() );
		}
	} );
	_.each( changedValues, function( newValue, changedThing ) {
		expect( fieldCopy[ changedThing ]() ).to.eql( newValue );
	} );
}
