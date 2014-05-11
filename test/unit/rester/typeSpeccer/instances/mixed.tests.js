'use strict';

var describeTypeSpecCreator = require( '../describe/describeTypeSpecCreator' );

var rester = require( '../../../../../' ).rester;
var basicTypeSpecs = rester.typeSpeccer.basicTypeSpecs;
var TypeSpec = rester.typeSpeccer.TypeSpec;
var ModelField = rester.model.ModelField;
var Assertion = rester.assert.Assertion;

var customType1 = new TypeSpec( 'customType' )
	.validator(
		'42Only',
		function ( value ) {
			return value === 42;
		},
		'to be 42'
	);
var customType2 = new TypeSpec( 'customType2' )
	.validator(
		function fooOnly( value ) {
			return value.toLowerCase() === 'foo';
		},
		'to be "foo"'
	);

describe( 'mixed TypeSpec instance', function() {
	describeTypeSpecCreator( 'mixed', {
		valid: [ 0, null, undefined, false, true, 'foo', /./, new Date(), [], {} ],
		invalid: [],
		descriptors: {
			'"restrictedTo" allowing for mixed type of string and number': {
				'.restrictedTo': [
					new ModelField( basicTypeSpecs.string ),
					new ModelField( basicTypeSpecs.number )
				],
				valid: [
					'', ' ', 'foo', -1, 0, 42, 0.5, 1.337, -0.0001
				],
				invalid: [
					null, undefined, false, true, /./, new Date(), [], {}
				]
			},
			'"restrictedTo" allowing for mixed type of number and boolean': {
				'.restrictedTo': [
					new ModelField( basicTypeSpecs.number ),
					new ModelField( basicTypeSpecs.boolean )
				],
				valid: [
					-1, 0, 42, 0.5, 1.337, -0.0001, true, false
				],
				invalid: [
					null, undefined, '', '42', /./, new Date(), [], {}
				]
			},
			'"restrictedTo" allowing for number 42 and "foo" by using custom types and their validators': {
				'.restrictedTo': [
					new ModelField( customType1, {}, new Assertion( '42Only', Assertion.unknown.only ) ),
					new ModelField( customType2, {}, new Assertion( 'fooOnly', Assertion.unknown.only ) ),
				],
				valid: [
					'foo', 'Foo', 'FOO', 42
				],
				invalid: [
					null, undefined, true, false, '', '42', 1, 0, 43, 0.42, /./, new Date(), [], {}
				]
			}
		}
	} );
} );
