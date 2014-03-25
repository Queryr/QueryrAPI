'use strict';

var expect = require( 'expect.js' );
var describeValidatorInstance = require( './describe/describeValidatorInstance' );

var Validator = require( '../../../../' ).rester.validators.Validator;

describe( 'Validator', function() {
	describe( 'constructor', function() {
		it( 'throws an error if first param is not a function', function() {
			expect( function() {
				new Validator();
			} ).to.throwError();
			expect( function() {
				new Validator( 'foo', 'to be *' );
			} ).to.throwError();
		} );

		it( 'throws an error if second param is not a string', function() {
			function fnReturnTrue() {
				return true;
			}
			expect( function() {
				new Validator( fnReturnTrue );
			} ).to.throwError();
			expect( function() {
				new Validator( fnReturnTrue, {} );
			} ).to.throwError();
		} );
	} );

	describeValidatorInstance(
		new Validator(
			function( value ) {
				return value === true;
			},
			'to be true'
		), [
			[ true ]
		], [
			[ false ],
			[ null ],
			[ undefined ],
			[ 42 ],
			[ 'foo' ],
			[ /./ ],
			[ {} ],
			[ [] ],
			[ new Date() ],
			[ function() {} ]
		]
	);
} );
