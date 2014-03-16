'use strict';

var expect = require( 'expect.js' );
var Assertion = require( '../../../../' ).rester.assert.Assertion;

describe( 'Assertion.unknown', function() {
	it( 'should not be undefined', function() {
		expect( Assertion.unknown ).to.be.an( 'object' );
	} );

	it( 'should be equal to itself', function() {
		expect( Assertion.unknown ).to.equal( Assertion.unknown );
	} );
} );
