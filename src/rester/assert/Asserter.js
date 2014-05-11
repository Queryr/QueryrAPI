'use strict';

module.exports = Asserter;

var Assertion = require( './Assertion' );

/**
 * For executing
 *
 * @param {Validators} validators Validators known to this asserter. All of these validators can be
 *        referenced in given assertions. If a given assertion contains a validator not in this
 *        list, then an exception will be thrown.
 *
 * @constructor
 */
function Asserter( validators ) {

	/**
	 * Asserts a given assertion.
	 *
	 * @example <code>
	 *     var assertIs42 = new Assertion( 'equal', [ Assertion.unknown, 42 ] );
	 *     asserter.assert( assertIs42.withUnknown( 42 ) ); // true
	 * </code>
	 *
	 * @param {Assertion} assertion
	 * @return {Asserter} self-reference
	 *
	 * @trows {Error} If the assertion fails
	 */
	this.assert = function( assertion ) {
		var descriptors = assertion.getDescriptors();
		var validatorParams = this.assertionDescriptorsToValidatorParams( descriptors );
		var validatorName = assertion.getType();
		var validator = validators.get( validatorName );

		if( validator === null ) {
			throw new Error( 'Given assertion requires unknown validator "' + validatorName + '"' );
		}

		var isValid = validator.isValid.apply( validator, validatorParams );
		if( !isValid ) {
			// TODO: Create AssertionError with more detail. Generate a message containing full
			//  assertion details.
			throw new Error( 'assertion failed' );
		}
		return this;
	};

	/**
	 * Turns an assertion's validation descriptors into parameters to be used with an actual
	 * validation.
	 *
	 * @param descriptors
	 * @returns {Array}
	 *
	 * @throws {Error} If Assertion.unknown is not being replaced with an actual value first.
	 */
	this.assertionDescriptorsToValidatorParams = function( descriptors ) {
		var validatorParams = [];
		var descriptor, validatorParam;

		for( var i = 0; i < descriptors.length; i++ ) {
			descriptor = validatorParam = descriptors[ i ];

			if( descriptor === Assertion.unknown ) {
				throw new Error( 'Can not create validator parameter from Assertion.unknown. ' +
					'Use {Assertion}.withUnknown for eliminating the unknown first.' );
			}

			if( descriptor instanceof Assertion ) {
				try{
					this.assert( descriptor );
					validatorParam = true;
				} catch( error ) {
					validatorParam = false;
				}
			}

			validatorParams.push( validatorParam );
		}
		return validatorParams;
	};

}
