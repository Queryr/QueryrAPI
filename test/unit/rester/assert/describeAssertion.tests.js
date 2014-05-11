'use strict';

var expect = require( 'expect.js' );

var Assertion = require( '../../../../' ).rester.assert.Assertion;
var describeAssertion = require( '../../../../' ).rester.assert.describeAssertion;

describe( 'describeAssertion', function() {
	var assertions = {
		'Assertion<0 descriptors>':
			new Assertion( 'foo' ),
		'Assertion<3 descriptors, no unknown>':
			new Assertion( 'foo', [ 1, 2, 3, ] ),
		'Assertion<1 descriptors including unknown>':
			new Assertion( 'foo', [ Assertion.unknown ] )
	};

	for( var expectedDescription in assertions ) {
		var assertion = assertions[ expectedDescription ];

		it( 'should return the number of descriptors and whether or not an unknown is being used', function() {
			expect( describeAssertion( assertion ) ).to.equal( expectedDescription );
		} );
	}

	it( 'should throw an error if no assertion is given', function() {
		expect( describeAssertion ).to.throwError();
		expect( function() { describeAssertion( 'foo' ); } ).to.throwError();
	} );
} );
