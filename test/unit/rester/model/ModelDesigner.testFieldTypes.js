'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );
var chain = require( '../../../../src/chainy' );

var itThrowsErrorInDslContext = require( './describe/itThrowsErrorInDslContext' );

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

				itThrowsErrorInDslContext(
					chain( newDesigner() )( typeSpec.name() )
				);

				itThrowsErrorInDslContext(
					chain( newDesigner() )( 'model' )( typeSpec.name() )
				);
			} );

			itIsADefinedGetter( newDesigner(), typeSpec.name() );
		} );
	} );
} );

function itIsADefinedGetter( object, getterName ) {
	it( 'is a defined getter', function() {
		expect(
			Object.getOwnPropertyDescriptor( object, getterName ).get
		).to.be.ok();
	} );
}
