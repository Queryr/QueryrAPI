'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var rester = require( '../../../../' ).rester;
var ModelDesigner = rester.model.ModelDesigner;
var ModelDesign = rester.model.ModelDesign;
var types = rester.typeSpeccer.basicTypeSpecs;

var typesArray = _.values( types );

var designs = require( './ModelDesigner.testDesigns.designCases.js' );

function newDesigner() {
	return new ModelDesigner( typesArray );
}

describe( 'ModelDesigner #models()', function() {
	var fn = function() {};
	var designModels = _.map( designs, function( designCase, caseDescription ) {
			var designerFn = designCase[ 0 ];
			if( designerFn.length ) {
				return fn; // filter newCase() cases
			}
			return designerFn;
		} );
	designModels = _.without( designModels, fn );
	designModels = designModels.concat( designModels ); // design each model twice

	var designer = newDesigner();
	var individuallyDesignedModels = {};

	_.each( designModels, function( designerFn, i ) {
		var modelName = ( i + 1 ) + '.';
		function designModelWithDesigner( designer ) {
			designer.model( modelName );
			designerFn.call( designer );
			return designer;
		}

		designModelWithDesigner( designer ); // model will be received later via designs()
		individuallyDesignedModels[ modelName ] = designModelWithDesigner( newDesigner() ).design();
	} );

	var designerModels = designer.models();
	_.each( individuallyDesignedModels, function( individuallyDesignedModel, modelName ) {
		it( 'contains ' + modelName + ' model defined', function() {
			expect( designerModels[ modelName ].equals( individuallyDesignedModel ) ).to.be.ok();
		} );
	} );
} );
