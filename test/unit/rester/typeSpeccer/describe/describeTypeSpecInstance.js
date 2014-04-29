'use strict';

module.exports = describeTypeSpecInstance;

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var describeValidatorInstance = require( '../../validators/describe/describeValidatorInstance' );

var rester = require( '../../../../../' ).rester;
var TypeSpec = rester.typeSpeccer.TypeSpec;

function describeTypeSpecInstance( typeSpec, description ) {
	it( 'is a TypeSpec instance', function() {
		expect( typeSpec ).to.be.a( TypeSpec );
	} );

	testValueInstanceValidation( typeSpec.use( {} ), {
		valid: description.valid,
		invalid: description.invalid
	} );

	_.each(
		description.validators || {},
		function( config, validatorName ) {
			describe( '#validator( "' + validatorName + '" )', function() {
				describeValidatorInstance(
					typeSpec.validator( validatorName ),
					config.valid || [],
					config.invalid || []
				);
			} );
		}
	);

	_.each(
		description.descriptors,
		function( config, descriptorsDescription ) {
			var descriptors = {};
			_.each( config, function( descriptorValue, descriptorName ) {
				if( descriptorName.charAt( 0 ) !== '.' ) {
					return;
				}
				descriptorName = descriptorName.substr( 1 );
				descriptors[ descriptorName ] = descriptorValue;
			} );

			var descriptorsLength = _.values( descriptors ).length;
			if( descriptorsLength === 0 ) {
				throw new Error( 'descriptors test should provide some descriptor values' );
			}

			describe( 'with ' + descriptorsLength + ' descriptors ' + descriptorsDescription, function() {
				testValueInstanceValidation( typeSpec.use( descriptors ), {
					valid: config.valid,
					invalid: config.invalid
				} );
			} );
		}
	);

	function testValueInstanceValidation( valueConstructor, values ) {
		describe( 'value instance validation', function() {
			_.each( values.valid, function( value ) {
				it( 'accepts ' + value + ' as valid', function() {
					expect( function() {
						valueConstructor( value );
					} ).to.not.throwError();
				} );
			} );
			_.each( values.invalid, function( value ) {
				it( 'rejects ' + value + ' as invalid', function() {
					expect( function() {
						valueConstructor( value );
					} ).to.throwError();
				} );
			} );
		} );
	}
}