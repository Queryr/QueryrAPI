'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var rester = require( '../../../../' ).rester;
var ModelDesigner = rester.model.ModelDesigner;
var ModelDesign = rester.model.ModelDesign;
var ModelField = rester.model.ModelField;
var ModelFieldMap = rester.model.ModelFieldMap;
var Assertion = rester.assert.Assertion;
var types = rester.typeSpeccer.basicTypeSpecs;

/**
 * For debugging purposes.
 * Can be used as value within a test case array to force the test runner to execute this test only.
 *
 * TODO: Will only work with testDesigns test, will break other usage of this object!
 */
var TEST_EXCLUSIVELY = 'only';

module.exports = {
	'with "isNew" field as boolean': [
		function() {
			this.field( 'isNew' ).as.boolean;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'isNew', new ModelField( types.boolean ) )
		)
	],
	'with "length" field as number': [
		function() {
			this.field( 'length' ).as.number;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'length', new ModelField( types.number ) )
		)
	],
	'with "value" field as mixed': [
		function() {
			this.field( 'value' ).as.mixed;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'value', new ModelField( types.mixed ) )
		)
	],
	'with "name" field as string': [
		function() {
			this.field( 'name' ).as.string;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'name', new ModelField( types.string ) )
		)
	],
	'with one field defined twice, second definition overwrites first one': [
		function() {
			this
				.field( 'length' ).as.string // overwrite in next line;
				.field( 'length' ).as.number
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'length', new ModelField( types.number ) )
		)
	],
	'with "name" field as string and "width" and "height" as number': [
		function( newCase ) {
			newCase()
				.field( 'height' ).as.number
				.field( 'width' ).as.number
				.field( 'name' ).as.string
			;
			newCase()
				.field( 'width' ).as.number
				.field( 'name' ).as.string
				.field( 'height' ).as.number
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'width', new ModelField( types.number ) )
				.set( 'name', new ModelField( types.string ) )
				.set( 'height', new ModelField( types.number ) )
		)
	],
	'with mixed type of string and boolean': [
		function( newCase ) {
			newCase( 'using featured short syntax' )
				.field( 'value' ).as.string.or.as.boolean
			;
			newCase( 'using "mixed" type directly together with optional "restrictedTo" descriptor' )
				.field( 'value' ).as.mixed.restrictedTo( [
					new ModelField( types.string ),
					new ModelField( types.boolean )
				] )
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'value', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.string ),
						new ModelField( types.boolean )
					]
				} ) )
		)
	],
	'with "name" field as string, boolean, number or null': [
		function( newCase ) {
			newCase()
				.field( 'name' ).as.string.or.as.boolean.or.as.number.or.as.null;
			newCase()
				.field( 'name' ).as.number.or.as.boolean.or.as.null.or.as.string;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'name', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.string ),
						new ModelField( types.boolean ),
						new ModelField( types.number ),
						new ModelField( types.null )
					]
				} ) )
		)
	],
	'with "address" field as string or null': [
		function() {
			this.field( 'address' ).as.string.or.as.null;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'address', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.string ),
						new ModelField( types.null )
					]
				} ) )
		)
	],
	'with "date" field as instance of Date (required descriptor test)': [
		function() {
			this.field( 'date' ).as.instance.of( Date );
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'date', new ModelField( types.instance, { of: Date } ) )
		)
	],
	'with "date" field as instance of Date or null': [
		function( newCase ) {
			newCase( 'instance.of 1st')
				.field( 'date' ).as.instance.of( Date ).or.as.null
			;
			newCase( 'instance.of 2nd')
				.field( 'date' ).as.null.or.as.instance.of( Date )
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'date', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.instance, { of: Date } ),
						new ModelField( types.null )
					]
				} ) )
		)
	],
	'with "someObj" field as Date or RegExp instance': [
		function() {
			this
				.field( 'someObj' )
					.as.instance.of( Date )
					.or
					.as.instance.of( RegExp )
					.or
					.as.instance.of( Function )
				.field( 'date' )
					.as.instance.of( Date ).or.as.null
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'someObj', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.instance, { of: Date } ),
						new ModelField( types.instance, { of: RegExp } ),
						new ModelField( types.instance, { of: Function } )
					]
				} ) )
				.set( 'date', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.instance, { of: Date } ),
						new ModelField( types.null )
					]
				} ) )
		)
	],
	'with "length" field as number and field length restriction between 1 and 1000': [
		function() {
			this
				.field( 'length' ).as.number
					.between( 1, 1000 );
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'length', new ModelField(
					types.number,
					{},
					new Assertion( 'between', [ Assertion.unknown, 1, 1000 ] )
				) )
		)
	],
	'with "foo" field as string or as number restricted to value between 1 and 1000': [
		function( newCase ) {
			newCase()
				.field( 'foo' )
					.as.number.between( 1, 1000 )
					.or
					.as.string
			;
			newCase()
				.field( 'foo' )
					.as.string
					.or
					.as.number.between( 1, 1000 )
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'foo', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.string ),
						new ModelField( types.number, {},
							new Assertion( 'between', [ Assertion.unknown, 1, 1000 ] )
						)
					]
				} ) )
		)
	],
	'with "foo" field as string or as number with several restrictions': [
		function( newCase ) {
			newCase()
				.field( 'foo' )
					.as.string
					.or
					.as.number
						.above( 0 )
						.odd()
						.below( 42 )
			;
			newCase()
				.field( 'foo' )
					.as.number
						.above( 0 )
						.odd()
						.below( 42 )
					.or
					.as.string
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'foo', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.string ),
						new ModelField( types.number, {},
							new Assertion( 'and', [
								new Assertion( 'above', [ Assertion.unknown, 0 ] ),
								new Assertion( 'odd' ),
								new Assertion( 'below', [ Assertion.unknown, 42 ] ),
							]
						) )
					]
				} ) )
		)
	],
	'with "foo" field as number with several restrictions using "or" following one assertion': [
		function() {
			this
				.field( 'foo' )
					.as.string
					.or
					.as.number
							.above( 0 )
							.odd()
							.below( 42 )
						.or
							.above( 42 )
						.or
							.below( -42 )
					.or
					.as.null
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'foo', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.string ),
						new ModelField( types.null ),
						new ModelField( types.number, {},
							new Assertion( 'or', [
								new Assertion( 'and', [
									new Assertion( 'above', [ Assertion.unknown, 0 ] ),
									new Assertion( 'odd' ),
									new Assertion( 'below', [ Assertion.unknown, 42 ] ),
								] ),
								new Assertion( 'above', [ Assertion.unknown, 42 ] ),
								new Assertion( 'below', [ Assertion.unknown, -42 ] )
							] )
						)
					]
				} ) )
		)
	],
	'with "foo" field as number with several restrictions using "or"': [
		function() {
			this
				.field( 'foo' )
					.as.string
					.or
					.as.number
							.above( 0 )
							.odd()
							.below( 42 )
						.or
							.above( 42 )
							.even()
							.below( 99 )
						.or
							.below( 0 )
							.odd()
							.above( -42 )
					.or
					.as.null
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'foo', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.string ),
						new ModelField( types.null ),
						new ModelField( types.number, {},
							new Assertion( 'or', [
								new Assertion( 'and', [
									new Assertion( 'above', [ Assertion.unknown, 0 ] ),
									new Assertion( 'odd' ),
									new Assertion( 'below', [ Assertion.unknown, 42 ] ),
								] ),
								new Assertion( 'and', [
									new Assertion( 'above', [ Assertion.unknown, 42 ] ),
									new Assertion( 'even' ),
									new Assertion( 'below', [ Assertion.unknown, 99 ] ),
								] ),
								new Assertion( 'and', [
									new Assertion( 'below', [ Assertion.unknown, 0 ] ),
									new Assertion( 'odd' ),
									new Assertion( 'above', [ Assertion.unknown, -42 ] ),
								] )
							] )
						)
					]
				} ) )
		)
	]
};