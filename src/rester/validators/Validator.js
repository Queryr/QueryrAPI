'use strict';

module.exports = Validator;

/**
 * Validator.
 *
 * @param {function} validationFn
 * @param {string|function} validationExpectation A string describing what the validator is expected
 *        to ensure, typically starting with "to be...". E.g. "to be between $1 and $2". $1, $2 and
 *        so on are placeholders for the validationFn's parameters.
 *        Can also be a function to return a string. The function callback will receive all
 *        parameters just like the validation function callback.
 *
 * @constructor
 */
function Validator( validationFn, validationExpectation ) {
	if( typeof validationFn !== 'function' ) {
		throw new Error( 'Validation function callback required' );
	}
	if( typeof validationExpectation !== 'string'
		&& typeof validationExpectation !== 'function'
	) {
		throw new Error( 'Validation expectation not stated. String or function expected.' );
	}

	/**
	 * Returns whether the given value is valid.
	 *
	 * @return boolean
	 */
	this.isValid = validationFn;

	/**
	 * Does a validation using the given value and validation parameters. Throws an error if the
	 * given value is not valid.
	 *
	 * @throws Error if invalid value given.
	 */
	this.validate = function() {
		if( this.isValid.apply( this, arguments ) ) {
			return;
		}
		var optionParams = Array.prototype.slice.call( arguments, 1 );
		var errorMsg = getValidationErrorMsg.apply( null, optionParams );

		throw new Error( errorMsg ); // TODO: Throw custom ValidationError instead.
	};

	var getValidationErrorMsg = typeof validationExpectation === 'function'
		? validationExpectation
		: function () {
			return replaceStringValidationErrorMsgParams( validationExpectation, arguments );
		};

	function replaceStringValidationErrorMsgParams( stringMessage, params ) {
		// TODO: Replace $1 and so fort with option param values.
		return stringMessage;
	}
}
