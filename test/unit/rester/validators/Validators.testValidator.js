'use strict';

var expect = require( 'expect.js' );
var sinon = require( 'sinon' );

var Validator = require( '../../../../' ).rester.validators.Validator;
var Validators = require( '../../../../' ).rester.validators.Validators;

describe( 'Validators', function(){
	var validators;

	beforeEach( function() {
		validators = new Validators();
	} );

	describe( '#validator( name ) as a getter', function() {
		it( 'should return null when requesting an undefined Validator instance', function() {
			expect( validators.validator( 'foo' ) ).to.be( null );
		} );

		it( 'should return a previously defined Validator', function() {
			var spy = sinon.spy();
			validators.validator(
				function ok( value ) {
					spy();
					return !!value;
				},
				'to be a truthy value'
			);
			var newValidator = validators.validator( 'ok' );

			expect( newValidator ).to.be.a( Validator );

			expect( spy.called ).to.be( false );
			newValidator.validate( true );
			expect( spy.called ).to.be( true );
		} );
	} );

	describe( '#validator( name, validatorFn, validationExpectation )', function() {
		describeDefiningValidatorInstances(
			'someValidator',
			function() {
				return validators.validator(
					function someValidator() { return true; },
					'to be anything'
				);
			}
		);
	} );

	describe( '#validator( name, namedValidatorFn, validationExpectation )', function() {
		describeDefiningValidatorInstances(
			'someValidator',
			function() {
				return validators.validator(
					'someValidator',
					function thisNameToBeIgnored() { return true; },
					'to be anything'
				);
			}
		);
	} );

	describe( '#validator( namedValidatorFn, validationExpectation )', function() {
		describeDefiningValidatorInstances(
			'someValidator',
			function() {
				return validators.validator(
					'someValidator',
					function() { return true; },
					'to be anything'
				);
			}
		);

		describe( 'passing an unnamed function as validator function', function() {
			function addUnnamedFunctionAsValidator() {
				validators.validator(
					function() { return true; },
					'to be true'
				);
			}
			it( 'should throw an error and not increase the "length" property', function() {
				expect( addUnnamedFunctionAsValidator ).to.throwError();
				expect( validators.length ).to.be( 0 );
			} );
		} );
	} );

	function describeDefiningValidatorInstances( definedValidatorName, defineValidatorFn ) {
		describe( 'defining a new Validator', function() {
			it( 'should return a self-reference', function() {
				var returnValue = defineValidatorFn();
				expect( returnValue ).to.be( validators );
			} );

			it( 'should have increased the "length" property', function() {
				defineValidatorFn();
				expect( validators.length ).to.be( 1 );
			} );

			it( 'should create a new Validator instance and add it', function() {
				defineValidatorFn();
				var newValidator = validators.validator( definedValidatorName );

				expect( newValidator ).to.be.a( Validator );
				expect( validators.length ).to.be( 1 );
			} );
		} );

		describe( 'overwriting a previously defined Validator with the same name', function() {
			it( 'should create a new Validator instance', function() {
				defineValidatorFn();
				var oldValidator = validators.validator( definedValidatorName );

				defineValidatorFn();
				var newValidator = validators.validator( definedValidatorName );

				expect( newValidator ).not.to.be( oldValidator );
				expect( newValidator ).to.be.a( Validator );
			} );

			it( 'should not increase the "length" property', function() {
				defineValidatorFn();
				defineValidatorFn();
				expect( validators.length ).to.be( 1 );
			} );
		} );
	}
} );