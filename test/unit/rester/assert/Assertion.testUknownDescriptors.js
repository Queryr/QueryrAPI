'use strict';

var expect = require( 'expect.js' );
var Assertion = require( '../../../../' ).rester.assert.Assertion;

describe( 'Assertion with Assertion.unknown given as a descriptor', function(){

	// TODO: Test with different variations of descriptor arrays. Use data provider.
	var assertion = new Assertion( 'equal', [ Assertion.unknown, 2 ] );

	describe( '#hasUnknown()', function() {
		it( 'should be true', function() {
			expect( assertion.hasUnknown() ).to.be( true );
		} );
	} );

	describe( '#withUnknown()', function() {
		it( 'should return a new Assertion instance', function() {
			var newAssertion = assertion.withUnknown( 'foo' );
			expect( newAssertion ).to.be.an( Assertion );
			expect( newAssertion ).to.not.be( assertion );
		} );
	} );
} );
