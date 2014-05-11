'use strict';

var expect = require( 'expect.js' );
var Assertion = require( '../../../../' ).rester.assert.Assertion;

var assertionsWithUnknownAndResolved = [
	[
		new Assertion( 'ok', [ Assertion.unknown ] ),
		true,
		new Assertion( 'ok', [ true ] ),
	], [
		new Assertion( 'equal', [ Assertion.unknown, 'foo' ] ),
		'foo',
		new Assertion( 'equal', [ 'foo', 'foo' ] ),
	], [
		new Assertion( 'equal', [ false, Assertion.unknown ] ),
		false,
		new Assertion( 'equal', [ false, false ] ),
	], [
		new Assertion( 'not', [
			new Assertion( 'ok', [ Assertion.unknown ] )
		] ),
		false,
		new Assertion( 'not', [
			new Assertion( 'ok', [ false ] )
		] ),
	], [
		new Assertion( 'not', [
			new Assertion( 'equal', [ Assertion.unknown, 42 ] )
		] ),
		24,
		new Assertion( 'not', [
			new Assertion( 'equal', [ 24, 42 ] )
		] ),
	], [
		new Assertion( 'or', [
			new Assertion( 'equal', [ Assertion.unknown, undefined ] ),
			new Assertion( 'ok', [ Assertion.unknown ] )
		] ),
		undefined,
		new Assertion( 'or', [
			new Assertion( 'equal', [ undefined, undefined ] ),
			new Assertion( 'ok', [ undefined ] )
		] )
	], [
		new Assertion( 'and', [
			new Assertion( 'ok', [ Assertion.unknown ] ),
			new Assertion( 'equal', [ Assertion.unknown, Assertion.unknown ] ),
			new Assertion( 'ok', [ Assertion.unknown ] )
		] ),
		true,
		new Assertion( 'and', [
			new Assertion( 'ok', [ true ] ),
			new Assertion( 'equal', [ true, true ] ),
			new Assertion( 'ok', [ true ] )
		] ),
	]
];

for( var i in assertionsWithUnknownAndResolved ) {
	var testCase = assertionsWithUnknownAndResolved[ i ];
	describeAssertionUnknownBehavior( testCase[0], testCase[1], testCase[2] );
}

function describeAssertionUnknownBehavior(
	assertion,
	unknownValue,
	assertionExpectedAfterUnknownResolved
) {
	describe(
		'Assertion of Type "' + assertion.getType() + '" with Assertion.unknown as a descriptor',
		function() {
			describe( '#hasUnknown()', function() {
				it( 'should be true', function() {
					expect( assertion.hasUnknown() ).to.be( true );
				} );
			} );

			describe( '#withUnknown()', function() {
				var newAssertion = assertion.withUnknown( unknownValue );

				it( 'should return a new Assertion instance', function() {
					expect( newAssertion ).to.be.an( Assertion );
					expect( newAssertion ).to.not.be( assertion );
				} );

				it( 'should return an Assertion without unknown', function() {
					expect( newAssertion.hasUnknown() ).to.be( false );
				} );

				it( 'should equal the expected assertion after the replacement', function() {
					expect( newAssertion.equals( assertionExpectedAfterUnknownResolved ) ).to.be( true );
				} );

				it( 'should not equal the assertion expected after the replacement before the replacement', function() {
					expect( assertion.equals( assertionExpectedAfterUnknownResolved ) ).to.be( false );
				} );
			} );
		}
	);
}
