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

var designs = require( './ModelDesigner.testDesigns.designCases.js' );

describe( 'ModelDesigner', function() {
	var TEST_EXCLUSIVELY = 'only';

	var typesArray = _.values( types );
    var exclusiveDesigns = {};
	_.each( designs, function( designCase, designDescription ) {
		if( designCase.indexOf( TEST_EXCLUSIVELY ) !== -1 ) {
			exclusiveDesigns[ designDescription ] = _.without( designCase, TEST_EXCLUSIVELY );
		}
	} );
	var testDesigns = _.size( exclusiveDesigns ) > 0 ? exclusiveDesigns : designs;
	if( testDesigns === exclusiveDesigns ) {
		console.log( 'WARNING: ' + ( _.size( designs ) - _.size( exclusiveDesigns ) )
			+ ' ModelDesigner design tests skipped due to usage of TEST_EXCLUSIVELY flag.' );
	}

	_.each( testDesigns, function( designCase, designDescription ) {
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

		if( _.size( designedModels ) > 1 ) {
			// Remove empty model designed when newDesignCase() got called manually.
			delete( designedModels[ '*' ] );
		}

		_.each( designedModels, function( designedModel, designedModelCaseDescription ) {
			if( _.size( designedModels ) > 1 ) {
				designDescription += ' ' + designedModelCaseDescription;
			}
			describe( 'designing an anonymous ModelDesign ' + designDescription + ' and retrieving it via #design()', function() {
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
