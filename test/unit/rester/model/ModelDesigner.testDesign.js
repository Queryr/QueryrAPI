'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );
var chain = require( '../../../../src/chainy' );

var itThrowsErrorInDslContext = require( './describe/itThrowsErrorInDslContext' );

var rester = require( '../../../../' ).rester;
var ModelDesigner = rester.model.ModelDesigner;
var ModelDesign = rester.model.ModelDesign;
var types = rester.typeSpeccer.basicTypeSpecs;

var typesArray = _.values( types );

function newDesigner() {
	return new ModelDesigner( typesArray );
}
function designerChain( chainArg1 ) {
	return chain( newDesigner() )( chainArg1 );
}

describe( 'ModelDesigner #design()', function() {
	describe( 'without calling #model() first', function() {
		itThrowsErrorInDslContext(
			designerChain( 'design' )
		);
	} );

	describe( 'after #model( name )', function() {
		describeDesignAfterModel( [ 'someName' ] );
	} );

	describe( 'after #model() for anonymous model', function() {
		describeDesignAfterModel( [] );
	} );

	describe( 'designing one model and then another one', function() {
		it( 'returns the expected model', function() {
			function designModelWith( designer ) {
				return designer.model( 'bar' ).field( 'f1' ).as.number.design();
			}
			var design = designModelWith(
				newDesigner().model( 'foo' ).field( 'f1' ).as.string
			);
			expect( design ).to.be.a( ModelDesign );

			var equalDesign = designModelWith( newDesigner() );
			expect( design.equals( equalDesign ) ).to.be.ok();
		} );
	} );
} );

function describeDesignAfterModel( modelParams ) {
	function designModelChain( chainArg1 ) {
		return designerChain.call(
			null,
			'model',
			modelParams.length ? modelParams : undefined
		)( chainArg1 );
	}

	describe( 'after design steps starting but not finishing a topic (e.g. "field")', function() {
		itThrowsErrorInDslContext(
			designModelChain( 'field' )( 'as' )/* someType */( 'design' )
		);
	} );

	describe( 'when #design() has already been called for receiving last model design', function() {
		itThrowsErrorInDslContext(
			designModelChain( 'field' )( 'as' )( 'string' )( 'design' )( 'design' )
		);
	} );
}