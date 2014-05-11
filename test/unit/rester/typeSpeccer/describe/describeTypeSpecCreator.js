'use strict';

module.exports = describeTypeSpecCreator;

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var describeTypeSpecInstance = require( './describeTypeSpecInstance' );

var rester = require( '../../../../../' ).rester;
var TypeSpec = rester.typeSpeccer.TypeSpec;
var typeSpecCreators = rester.typeSpeccer.typeSpecCreators;

function describeTypeSpecCreator( name, description ) {
	var typeSpecCreator = typeSpecCreators[ name ];

	describe( '"' + name + '" TypeSpec instance creator', function() {

		it( 'is a function', function() {
			expect( typeSpecCreator ).to.be.a( Function );
		} );
		it( 'returns the given TypeSpec instance', function() {
			var typeSpec = new TypeSpec( name );
			expect( typeSpecCreator( typeSpec ) ).to.be( typeSpec );
		} );

		describe( 'generated instance', function() {
			describeTypeSpecInstance(
				typeSpecCreator( new TypeSpec( name ) ),
				description
			);
		} );
	} );
}
