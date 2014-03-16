'use strict';

var expect = require( 'expect.js' );
var Assertion = require( '../../../../' ).rester.assert.Assertion;

describe( 'Assertion', function(){

	var assertionType = 'equal';
	var assertionDescriptors = [ 2, 2 ];
	var assertion = new Assertion( assertionType, assertionDescriptors );

	describe( '#getType()', function() {
		it( 'should return constructor value', function() {
			expect( assertion.getType() ).to.equal( assertionType );
		} );
	} );

	describe( '#getDescriptors()', function() {
		it( 'should always return a copy of the internal array', function() {
			expect( assertion.getDescriptors() ).not.to.equal( assertionDescriptors );
			expect( assertion.getDescriptors() ).not.to.equal( assertion.getDescriptors() );
		} );

		it( 'should return an array with all descriptor values given to constructor', function() {
			expect( assertion.getDescriptors() ).to.eql( assertionDescriptors );
		} );
	} );

	describe( '#hasUnknown()', function() {
		it( 'should return false since no unknown given in descriptors', function() {
			expect( assertion.hasUnknown() ).to.be( false );
		} );
	} );

	describe( '#withUnknown()', function() {
		it( 'should return a self-reference since there is no unknown descriptor', function() {
			expect( assertion.withUnknown() ).to.be( assertion );
		} );
	} );
} );
