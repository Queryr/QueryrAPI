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

	describe( 'value instance validation', function() {
		_.each( description.valid, function( value ) {
			it( 'accepts ' + value + ' as valid', function() {
				expect( function() {
					typeSpec.use()( value );
				} ).to.not.throwError();
			} );
		} );
		_.each( description.invalid, function( value ) {
			it( 'rejects ' + value + ' as invalid', function() {
				expect( function() {
					typeSpec.use()( value );
				} ).to.throwError();
			} );
		} );
	} );

	_.each(
		description.validators || {},
		function( validatorConfig, validatorName ) {
			describe( '#validator( "' + validatorName + '" )', function() {
				describeValidatorInstance(
					typeSpec.validator( validatorName ),
					validatorConfig.valid || [],
					validatorConfig.invalid || []
				);
			} );
		}
	);
}
