'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var Assertion = require( '../../../../' ).rester.assert.Assertion;
var describeAssertion = require( '../../../../' ).rester.assert.describeAssertion;

var describeEqualsComparator = require( '../describeEqualsComparator' );

describe( 'Assertion#equals()', function() {
	describeEqualsComparator( {
		instanceProvider: function() {
			var ret = {};
			var assertions =  [
				[
					new Assertion( 'foo' ),
					new Assertion( 'foo', [] )
				],
				new Assertion( 'ok', [ true ] ),
				new Assertion( 'ok', [ Assertion.unknown ] ),
				new Assertion( 'equals', [ Assertion.unknown, 42 ] ),
				new Assertion( 'equals', [ 'foo', Assertion.unknown ] ),
				new Assertion( 'equals', [ 'foo', 'foo' ] ),
				new Assertion( 'equals', [ 'foo', 'bar' ] ),
			];
			_.each( assertions, function( equalAssertions, i ) {
				// describeAssertion() might not generate an unique description, so include i.
				equalAssertions = _.isArray( equalAssertions ) ? equalAssertions : [ equalAssertions ];
				ret[ '(' + i + ')' + describeAssertion( equalAssertions[0] ) ] = equalAssertions;
			} );
			return ret;
		}
	} );
} );
