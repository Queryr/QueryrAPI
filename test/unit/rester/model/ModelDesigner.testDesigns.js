'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var rester = require( '../../../../' ).rester;
var ModelDesigner = rester.model.ModelDesigner;
var ModelDesign = rester.model.ModelDesign;
var ModelField = rester.model.ModelField;
var ModelFieldMap = rester.model.ModelFieldMap;
var types = rester.typeSpeccer.basicTypeSpecs;

var designs = {
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
	'with "name" field as string and "width" and "height" as number, order of fields does not matter': [
		function() {
			this
				.field( 'height' ).as.number
				.field( 'width' ).as.number
				.field( 'name' ).as.string
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'width', new ModelField( types.number ) )
				.set( 'name', new ModelField( types.string ) )
				.set( 'height', new ModelField( types.number ) )
		)
	],
	'with "name" field as string or boolean': [
		function() {
			this.field( 'name' ).as.string.or.as.boolean;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'name', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.string ),
						new ModelField( types.boolean )
					]
				} ) )
		)
	],
	'with "address" field as string or null': [
		function() {
			this
				.field( 'address' ).as.string.or.as.null;
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
//	'with "value" field as mixed (string or boolean)': [
//		function() {
//			this
//				.field( 'value' ).as.mixed.restricted.to(
//					new ModelField( types.string ),
//					new ModelField( types.boolean )
//				)
//			;
//		},
//		new ModelDesign(
//			new ModelFieldMap()
//				.set( 'value', new ModelField( types.mixed, {
//					restrictedTo: [
//						new ModelField( types.string ),
//						new ModelField( types.boolean )
//					]
//				} ) )
//		)
//	],
//	'with "name" field as string or null': [
//		function() {
//			this.field( 'name' ).as.string.or.null;
//		},
//		new ModelDesign(
//			new ModelFieldMap()
//				.set( 'name', new ModelField( types.string ) )
//		)
//	]
};

describe( 'ModelDesigner', function() {
	var typesArray = _.values( types );

	_.each( designs, function( designCase, designDescription ) {
		describe( 'designing a ModelDesign ' + designDescription + ' and retrieving it via #design()', function() {
			var designedModel, expectedModel;

			beforeEach( function() {
				var designer = new ModelDesigner( typesArray );

				var designerFn = designCase[ 0 ];
				expectedModel = designCase[ 1 ];
				expect( expectedModel ).to.be.a( ModelDesign );

				designer.model();
				designerFn.call( designer );
				designedModel = designer.design();
			} );

			it( 'is a ModelDesign instance', function() {
				expect( designedModel ).to.be.a( ModelDesign );
			} );

			it( 'looks like expected', function() {
				expect( designedModel.equals( expectedModel ) ).to.be( true );
			} );
		} );
	} );

} );
