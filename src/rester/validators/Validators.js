'use strict';

module.exports = Validators;

var Validator = require( 'Validator' );

/**
 * Collection of validators.
 *
 * @constructor
 */
function Validators() {
	var validators = {};

	// TODO: Might make sense for having a "Validator" object which is the function as well as
	//       a message string for building validation descriptions and errors.

	/**
	 * Getter/setter for validator callbacks.
	 *
	 * @param {function|string} [validatorFn] A named function. The function's name will be used as
	 *        the validator name. If a string is given, the function will be used as a getter.
	 * @param {string|function} validationExpectation
	 *
	 * @returns {function|null}
	 */
	this.validator = function( validatorFn, validationExpectation ) {
		// GETTER:
		if( typeof validatorFn === 'string' ) {
			return validators[ validatorFn ];
		}

		// SETTER:
		var name = validatorFn.name;

		if( typeof name !== 'string' || name.length < 1 ) {
			throw new Error( 'Validator name has to be given via the validation function\'s ' +
				'function name' );
		}

		validators[ name ] = new Validator( validatorFn, validationExpectation );
	};

	/**
	 * Allows to iterate over the collections validators
	 *
	 * @param {function} callback Receives validator object and validator name as arguments.
	 * @param {*} [context] Context for callback, null if omitted.
	 */
	this.each = function( callback, context ) {
		for( var name in validators ) {
			callback.call(
				context || null,
				validators[ name ], name
			);
		}
	};
}
