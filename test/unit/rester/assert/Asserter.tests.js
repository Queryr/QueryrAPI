'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var assert = require( '../../../../' ).rester.assert;
var Asserter = assert.Asserter;
var Assertion = assert.Assertion;
var describeAssertion = assert.describeAssertion;

var validators = require( '../../../../' ).rester.validators;
var Validators = validators.Validators;
var Validator = validators.Validator;

describe( 'Asserter', function(){
	var asserter;

	beforeEach( function() {
		var basicValidators = validators.basicValidators( new Validators() );
		var logicalValidators = validators.logicalValidators( new Validators() );
		var testValidators = new Validators();

		testValidators
			.set( 'ok', basicValidators.get( 'ok' ) )
			.set( 'equal', basicValidators.get( 'equal' ) )
			.set( 'and', logicalValidators.get( 'and' ) )
			.set( 'foo', new Validator(
				function( value ) {
					return value === 'foo';
				},
				'to be "foo"'
			) );

		asserter = new Asserter( testValidators );
	} );

	var assertTrueIsOk = new Assertion( 'ok', [ true ] );
	var assert42Equals42 = new Assertion( 'equal', [ 42, 42 ] );
	var assertFooIsFoo = new Assertion( 'foo', [ 'foo' ] );

	var validAssertions = [
		assertTrueIsOk,
		assert42Equals42,
		assertFooIsFoo,
		new Assertion( 'and', [ true, true, 1, 'foo' ] ),
		new Assertion( 'and', [
			assertTrueIsOk, assert42Equals42, assertFooIsFoo
		] ),
		new Assertion( 'and', [
			assertTrueIsOk,
			new Assertion( 'and', [
				assert42Equals42,
				assertFooIsFoo
			] )
		] )
	];

	describe( '#assert( validAssertion )', function() {
		_.each( validAssertions, function( assertion ) {
			it(
				'returns self-reference in case of ' + describeAssertion( assertion ),
				function() {
					function assert() {
						return asserter.assert( assertion );
					}
					expect( assert ).not.to.throwError();
					expect( assert() ).to.be( asserter );
				}
			);
		} );
	} );

	var assertFalseIsOk = new Assertion( 'ok', [ false ] );
	var assert0Is42 = new Assertion( 'equal', [ 0, 42 ] );
	var assertBarIsFoo = new Assertion( 'bar', [ 'foo' ] );

	var invalidAssertions = [
		assertFalseIsOk,
		assert0Is42,
		assertBarIsFoo,
		new Assertion( 'and', [
			assertFalseIsOk, assert0Is42, assertBarIsFoo
		] ),
		new Assertion( 'and', [
			assertTrueIsOk, assert42Equals42, assertBarIsFoo
		] )
	];

	describe( '#assert( invalidAssertion )', function() {
		_.each( invalidAssertions, function( assertion ) {
			it(
				'throws an error in case of ' + describeAssertion( assertion ),
				function() {
					function assert() {
						return asserter.assert( assertion );
					}
					expect( assert ).to.throwError();
				}
			);
		} );
	} );

	var assertionsWithUnknown = [
		{
			assertion: new Assertion( 'ok', [ Assertion.unknown ] ),
			validIfUnknown: [ true, 'foo', 42, {} ],
			invalidIfUnknown: [ false, null, undefined, 0, '' ]
		}, {
			assertion: new Assertion( 'equal', [ Assertion.unknown, Assertion.unknown ] ),
			validIfUnknown: [ 0, 42, '', true, false, null, undefined, {}, /./  ],
			invalidIfUnknown: [ NaN ]
		}, {
			assertion: new Assertion( 'foo', [ Assertion.unknown ] ),
			validIfUnknown: [ 'foo' ],
			invalidIfUnknown: [ 'bar', true, {} ]
		}, {
			assertion: new Assertion( 'and', [
				new Assertion( 'equal', Assertion.unknown.and( [ 42 ] ) ),
				new Assertion( 'ok', [ Assertion.unknown ] ),
				assertFooIsFoo
			] ),
			validIfUnknown: [ 42 ],
			invalidIfUnknown: [ 24, /./, 'foo' ]
		}
	];

	describe( '#assert( assertionWithUnknown )', function() {
		_.each( assertionsWithUnknown, function( assertionDescription ) {
			var assertion = assertionDescription.assertion;

			it( 'throws an error because or unresolved unknown', function() {
				expect( function() {
					asserter.assert( assertion );
				} ).to.throwError();
			} );
		} );
	} );

	describe( '#assert( assertion.withUnknown( ... ) )', function() {
		_.each( assertionsWithUnknown, function( assertionDescription ) {
			var assertion = assertionDescription.assertion;

			_.each( assertionDescription.validIfUnknown, function( valueForUnknown ) {
				it(
					'returns self-reference in case of ' + describeAssertion( assertion ) +
						' with unknown set to ' + valueForUnknown,
					function() {
						function assert() {
							return asserter.assert( assertion.withUnknown( valueForUnknown ) );
						}
						expect( assert ).not.to.throwError();
						expect( assert() ).to.be( asserter );
					}
				);
			} );

			_.each( assertionDescription.invalidIfUnknown, function( valueForUnknown ) {
				it(
					'throws an error in case of ' + describeAssertion( assertion ) +
						' with unknown set to ' + valueForUnknown,
					function() {
						function assert() {
							return asserter.assert( assertion.withUnknown( valueForUnknown ) );
						}
						expect( assert ).to.throwError();
					}
				);
			} );
		} );
	} );
} );
