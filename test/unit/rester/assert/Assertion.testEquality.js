'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var Assertion = require( '../../../../' ).rester.assert.Assertion;
var describeAssertion = require( '../../../../' ).rester.assert.describeAssertion;

var describeEqualsComparator = require( '../describeEqualsComparator' );

describe( 'Assertion#equals()', function() {
	describe( 'with two equal Assertions, one created with omitted 2nd constructor param', function() {
		it( 'should be equal', function() {
			var a1 = new Assertion( 'x', [] );
			var a2 = new Assertion( 'x' );

			expect( a1.equals( a2 ) ).to.be( true );
			expect( a2.equals( a1 ) ).to.be( true );
		} );
	} );

	describeEqualsComparator( {
		instanceProvider: function() {
			var ret = {};
			var assertions =  [
				new Assertion( 'foo' ),
				new Assertion( 'ok', [ true ] ),
				new Assertion( 'ok', [ Assertion.unknown ] ),
				new Assertion( 'equals', [ Assertion.unknown, 42 ] ),
				new Assertion( 'equals', [ 'foo', Assertion.unknown ] ),
				new Assertion( 'equals', [ 'foo', 'foo' ] ),
				new Assertion( 'equals', [ 'foo', 'bar' ] ),
			];
			_.each( assertions, function( assertion, i ) {
				// describeAssertion() might not generate an unique description, so include i.
				ret[ '(' + i + ')' + describeAssertion( assertion ) ] = assertion;
			} );
			return ret;
		}
	} );
} );
