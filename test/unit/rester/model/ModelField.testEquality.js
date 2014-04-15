'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var describeEqualsComparator = require( '../describeEqualsComparator' );

var rester = require( '../../../../' ).rester;
var ModelField = rester.model.ModelField;
var Assertion = rester.assert.Assertion;
var TypeSpec = rester.typeSpeccer.TypeSpec;

var someType =
	new TypeSpec( 'someType' )
		.validator( 'someValidator', function() { return true; }, 'to be anything' )
		.validator( 'someValidator2', function() { return true; }, 'to be anything too' )
;
var anotherType = new TypeSpec( 'anotherType' );

var assertionOfKnownType = new Assertion( 'someValidator', Assertion.unknown.only );
var assertionOfKnownTypeCopy = new Assertion( 'someValidator', Assertion.unknown.only );
var assertionOfKnownType2 = new Assertion( 'someValidator2', Assertion.unknown.only );

expect( assertionOfKnownType.equals( assertionOfKnownType2 ) ).to.be( false );

describe( 'ModelField#equals()', function() {
	describeEqualsComparator( {
		instanceProvider: function() {
			return {
				'instance with type1 only': [
					new ModelField( someType ),
					new ModelField( someType, {} )
				],
				'instance with type2': [
					new ModelField( anotherType ),
					new ModelField( anotherType, {} )
				],
				'instance with type1 and descriptor property "foo" set to true':
					new ModelField( someType, { foo: true } ),
				'instance with type2 and descriptor property "foo" set to true':
					new ModelField( anotherType, { foo: true } ),
				'instance with type1 and descriptor property "foo" set to 42':
					new ModelField( someType, { foo: 42 } ),
				'instance with type1, empty descriptors and assertion1': [
					new ModelField( someType, undefined, assertionOfKnownType ),
					new ModelField( someType, {}, assertionOfKnownType ),
					new ModelField( someType, {}, assertionOfKnownTypeCopy )
				],
				'instance with type1, empty descriptors and assertion2': [
					new ModelField( someType, undefined, assertionOfKnownType2 ),
					new ModelField( someType, {}, assertionOfKnownType2 )
				]
			};

		}
	} );
} );
