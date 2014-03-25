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

		it( 'throws an error if second param is not a string or function', function() {
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

	describeOkValidatorInstance( new Validator(
		function( value ) {
			return value === true;
		},
		'to be true'
	) );

	describeOkValidatorInstance( new Validator(
		function( value ) {
			return value === true;
		},
		function() {
			return 'to be true';
		}
	) );

	function describeOkValidatorInstance( instance ) {
		describeValidatorInstance(
			instance, [
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
	}
} );
