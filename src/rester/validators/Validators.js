'use strict';

module.exports = Validators;

var Validator = require( './Validator' );

/**
 * Map of validator objects. Each object is registered under a specific name, the same instance can
 * be registered under various names.
 *
 * @constructor
 */
function Validators() {
	var validators = {};

	/**
	 * Number of validator objects in this collection.
	 *
	 * @type {number}
	 */
	this.length = 0;

	/**
	 * Adds a new Validator into the collection.
	 *
	 * @param {string} name
	 * @param {Validator} validator
	 *
	 * @returns {Validators} self-reference
	 */
	this.set = function( name, validator ) {
		if( !( validator instanceof Validator ) ) {
			throw new Error( 'No instance of Validator given');
		}
		var isOverwrite = !!validators[ name ];

		validators[ name ] = validator;

		if( !isOverwrite ) {
			this.length++;
		}
		return this;
	};

	/**
	 * Returns the Validator associated to the given name. Returns null if unknown name is given.
	 *
	 * @param {string} name
	 * @returns {Validator|null}
	 */
	this.get = function( name ) {
		return validators[ name ] || null;
	};

	/**
	 * Getter/setter for validators. Allows to define a new Validator directly into the collection.
	 *
	 * @param {string} [validatorName] Name of the new validator or name of the value to return.
	 *        Can be omitted if second parameter is a named function.
	 * @param {function} [validatorFn] A named function. The function's name will be used as
	 *        the validator name if first parameter is omitted.
	 * @param {string|function} [validationExpectation]
	 *
	 * @returns {Validator|null|Validators} Requested Validator instance or null if validator not
	 *          defined. Self-reference when used as setter.
	 */
	this.validator = function( name, validatorFn, validationExpectation ) {
		// GETTER:
		if( !validatorFn ) {
			return this.get( name );
		}

		// SETTER:
		if( typeof name !== 'string' ) {
			validationExpectation = validatorFn;
			validatorFn = name;
			name = validatorFn.name;
		}

		if( typeof name !== 'string' || name.length < 1 ) {
			throw new Error( 'Validator name has to be given via the validation function\'s ' +
				'function name' );
		}

		var validator = new Validator( validatorFn, validationExpectation );

		return this.set( name, validator );
	};

	// TODO: Might make sense to add a "add"/"get" member for adding existing Validator instances.

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
