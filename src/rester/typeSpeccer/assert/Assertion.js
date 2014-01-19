'use strict';

module.exports = Assertion;

/**
 * For describing expected validation results.
 *
 * @param {string} validationType
 * @param {Array} validationDescriptors An array of values. Any value to further describe the
 *        validation. Can also contain other assertion instances for nested assertions.
 *        Use Assertion.unknown to indicate a placeholder for a value given when executing the
 *        assertion.
 *
 * @example new Assertion( 'not', [ new Assertion( 'equal', [ Assertion.unknown, 42 ] ) ] );
 * @example <code>
 *     new Assertion( 'or', [
 *         new Assertion( 'equal', [ Assertion.unknown, 'foo' ] ),
 *         new Assertion( 'equal', [ Assertion.unknown, 'bar' ] )
 *     ] );
 * </code>
 *
 * @constructor
 */
function Assertion( validationType, validationDescriptors ) {
	validationDescriptors = validationDescriptors || [];

	/**
	 * Returns the type of the validation serving as basis for this assertion.
	 *
	 * @returns {string}
	 */
	this.getType = function() {
		return validationType;
	};

	/**
	 * Returns the Assertions validation descriptors.
	 *
	 * @returns {Array}
	 */
	this.getDescriptors = function() {
		return validationDescriptors.slice();
	};

	/**
	 * Returns whether Assertion.unknown is being used as a validation descriptor.
	 *
	 * @return {boolean}
	 */
	this.hasUnknown = function() {
		var descriptors = this.getDescriptors();
		for( var i = 0; i < descriptors.length; i++ ) {
			var descriptor = descriptors[ i ];
			if( descriptor === Assertion.unknown
				|| descriptor instanceof Assertion
				&& descriptor.hasUnknown()
			) {
				return true;
			}
		}
		return false;
	};
}

/**
 * To be used as value in an Assertion's "validationDescriptors" parameter to indicate an unknown
 * variable. In an assertion the assertion can be used with an actual value, the value will be used
 * in place of Assertion.unknown.
 *
 * @type {Assertion.unknown}
 */
Assertion.unknown = ( new function AssertionUnknown() {}() );
