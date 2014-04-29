'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );
var chain = require( '../../../../src/chainy' );

var rester = require( '../../../../' ).rester;
var ModelDesigner = rester.model.ModelDesigner;
var ModelDesign = rester.model.ModelDesign;
var ModelField = rester.model.ModelField;
var ModelFieldMap = rester.model.ModelFieldMap;
var types = rester.typeSpeccer.basicTypeSpecs;

describe( 'ModelDesigner', function() {
	var typesArray = _.values( types );

	function newDesigner() {
		return new ModelDesigner( typesArray );
	}

	_.each( typesArray, function( typeSpec ) {
		var designerOfSingleType = new ModelDesigner( [ typeSpec ] );

		describe( '#' + typeSpec.name(), function() {
			describe( 'on instance with one usable field type "' + typeSpec.name() + '"', function() {
				_.each( _.without( typesArray, typeSpec ), function( otherTypeSpec ) {
					it(
						'is the only member for modelling a field type; "'
							+ otherTypeSpec.name() + '" is undefined',
						function() {
							expect( designerOfSingleType[ otherTypeSpec.name() ] ).to.be( undefined );
						}
					);
				} );

				itIsADefinedGetter( designerOfSingleType, typeSpec.name() );

				describeMemberThrowingErrorInDslContext(
					chain( newDesigner() )( typeSpec.name() )
				);

				describeMemberThrowingErrorInDslContext(
					chain( newDesigner() )( 'model' )( typeSpec.name() )
				);
			} );

			itIsADefinedGetter( newDesigner(), typeSpec.name() );
		} );
	} );

	function describeMemberThrowingErrorInDslContext( dslChain ) {
		var contextPathPieces = dslChain.pieces().slice( 1, -1 );
		var contextPath = _.map( contextPathPieces, function( piece ) {
			if( !( piece instanceof chain.ContextMemberPiece ) ) {
				throw new Error( 'expected a chain of member functions executed on the context object' );
			}
			return '#' + piece.memberName + '(' + piece.memberCallArgs.length + ' args)';
		} );
		it( 'throws an error if invoked after ' + contextPath, function() {
			dslChain.go( function( step ) {
				if( step.isLast ) {
					expect( step ).to.throwError();
				}
				else {
					expect( step ).to.not.throwError();
				}
			} );
		} );
	}
} );

function itIsADefinedGetter( object, getterName ) {
	it( 'is a defined getter', function() {
		expect(
			Object.getOwnPropertyDescriptor( object, getterName ).get
		).to.be.ok();
	} );
}
