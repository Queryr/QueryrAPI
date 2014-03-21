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

describe( 'Assertion.unknown.and()', function() {
	describe( 'with empty array', function() {
		var values = Assertion.unknown.and( [] );

		it( 'should return an array with unknown as only value', function() {
			expect( values ).to.eql( [ Assertion.unknown ] );
		} );
	} );

	describe( 'with multiple values', function() {
		var values = Assertion.unknown.and( [ true, 1, 'foo' ] );

		it( 'should return an array with unknown plus given values', function() {
			expect( values ).to.eql( [ Assertion.unknown, true, 1, 'foo' ] );
		} );
	} );
} );
