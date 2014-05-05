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
	'with "date" field as instance of Date': [
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
				.field( 'date' )
					.as.instance.of( Date ).or.as.null
			;
		},
		new ModelDesign(
			new ModelFieldMap()
				.set( 'someObj', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.instance, { of: Date } ),
						new ModelField( types.instance, { of: RegExp } )
					]
				} ) )
				.set( 'date', new ModelField( types.mixed, {
					restrictedTo: [
						new ModelField( types.instance, { of: Date } ),
						new ModelField( types.null )
					]
				} ) )
		)
	]
};

describe( 'ModelDesigner', function() {
	var typesArray = _.values( types );

	_.each( designs, function( designCase, designDescription ) {
		var designedModels = {}
		var designerFn = designCase[ 0 ];
		var expectedModel = designCase[ 1 ];
		expect( expectedModel ).to.be.a( ModelDesign );

		var designer;
		var nextModelName;
		var newDesignCase = function( caseDescription ) {
			if( designer ) {
				designedModels[ nextModelName ] = designer.design();
			}
			nextModelName = caseDescription || '(case variation ' + _.keys( designedModels ).length + ')';
			designer = new ModelDesigner( typesArray );
			designer.model();
			return designer;
		};
		designerFn.call( newDesignCase( '*' ), newDesignCase );
		newDesignCase();

		if( _.keys( designedModels ).length > 1 ) {
			// Remove empty model designed when newDesignCase() got called manually.
			delete( designedModels[ '*' ] );
		}

		_.each( designedModels, function( designedModel, designedModelCaseDescription ) {
			if( _.keys( designedModels ).length > 1 ) {
				designDescription += ' ' + designedModelCaseDescription;
			}
			describe( 'designing a ModelDesign ' + designDescription + ' and retrieving it via #design()', function() {
				it( 'is a ModelDesign instance', function() {
					expect( designedModel ).to.be.a( ModelDesign );
				} );

				it( 'looks like expected', function() {
					expect( designedModel.equals( expectedModel ) ).to.be( true );
				} );
			} );
		} );
	} );

} );
