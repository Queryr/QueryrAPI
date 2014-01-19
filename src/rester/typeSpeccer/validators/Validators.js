'use strict';

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
	 * @param {string|string[]} names At least one name for the validation plus optional aliases.
	 * @param {function} validatorFn
	 *
	 * @returns {function|null}
	 */
	this.validator = function( names, validatorFn ) {
		if( typeof names === 'string' ) {
			names = [ names ];
		}

		// GETTER:
		if( !validatorFn ) {
			return validators[names[0]] || null;
		}

		// SETTER:
		if( typeof validatorFn !== 'function' ) {
			throw 'No callback function given for "' + names[0] + '" validator';
		}

		for( var i = 0; i < names.length; i++ ) {
			validators[names[i]] = validatorFn;
		}
	};
}

module.exports = Validators;
