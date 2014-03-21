'use strict';

var expect = require( 'expect.js' );
var Assertion = require( '../../../../' ).rester.assert.Assertion;
var describeAssertion = require( '../../../../' ).rester.assert.describeAssertion;

function buildTestAssertions() {
	return  [
		new Assertion( 'foo' ),
		new Assertion( 'ok', [ true ] ),
		new Assertion( 'ok', [ Assertion.unknown ] ),
		new Assertion( 'equals', [ Assertion.unknown, 42 ] ),
		new Assertion( 'equals', [ 'foo', Assertion.unknown ] ),
		new Assertion( 'equals', [ 'foo', 'foo' ] ),
		new Assertion( 'equals', [ 'foo', 'bar' ] ),
	];
}

describe( 'Assertion#equals()', function() {
	describe( 'with two equal Assertions, one created with omitted 2nd constructor param', function() {
		it( 'should be equal', function() {
			var a1 = new Assertion( 'x', [] );
			var a2 = new Assertion( 'x' );

			expect( a1.equals( a2 ) ).to.be( true );
			expect( a2.equals( a1 ) ).to.be( true );
		} );
	} );

	var testAssertionsSet = buildTestAssertions();
	for( var i in testAssertionsSet ) {
		var testAssertion = testAssertionsSet[ i ];
		var otherAssertions = testAssertionsSet.filter( function( elem ) {
			return elem !== testAssertion;
		} );

		describe( 'on ' + describeAssertion( testAssertion ), function() {
			describe( 'with equal Assertion as another instance', function() {
				it( 'should be equal', function() {
					var anotherTestAssertion = buildTestAssertions()[ i ];
					expect( testAssertion.equals( anotherTestAssertion ) ).to.be( true );
					expect( anotherTestAssertion.equals( testAssertion ) ).to.be( true );
				} );
			} );

			describeAssertionEqualsForAssertion( testAssertion, otherAssertions );
		} );
	}
} );

function describeAssertionEqualsForAssertion( assertion, otherAssertions ) {
	describe( 'with same object', function() {
		it( 'should be equal', function() {
			expect( assertion.equals( assertion ) ).to.be( true );
		} );
	} );

	for( var i = 0; i < otherAssertions.length; i++ ) {
		var otherAssertion = otherAssertions[ i ];
		describe( 'with ' + describeAssertion( otherAssertion ), function() {
			it( 'should not be equal', function() {
				expect( assertion.equals( otherAssertion ) ).to.be( false );
				expect( otherAssertion.equals( assertion ) ).to.be( false);
			} );
		} );
	}

	describeAssertionEqualsNotEqualToUnrelatedValue( assertion );
}

function describeAssertionEqualsNotEqualToUnrelatedValue( assertion ) {
	var unrelatedValues = {
		number: 42,
		undefined: undefined,
		string: 'foo',
		regex: /./,
		'object literal': {},
		'array literal': [],
		'Date object': new Date()
	};
	for( var valueType in unrelatedValues ) {
		var unrelatedValue = unrelatedValues[ valueType ];
		describe( 'with unrelated "' + valueType + '" value ' + unrelatedValue, function() {
			it( 'should not be equal', function() {
				expect( assertion.equals( unrelatedValue ) ).to.be( false );
			} );
		} );
	}
}
