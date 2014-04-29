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
	'with "name" field as string': [
		function() {
			this.field( 'name' ).as.string;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'name', new ModelField( types.string ) )
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
	]
};

describe( 'ModelDesigner', function() {
	var typesArray = _.values( types );

	_.each( designs, function( designCase, designDescription ) {
		describe( 'designing a ModelDesign ' + designDescription + 'and retrieving it via #design()', function() {
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
				expect( designedModel.equals( expectedModel ) ).to.be.ok();
			} );
		} );
	} );

} );
