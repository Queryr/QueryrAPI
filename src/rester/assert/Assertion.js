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
 * @immutable
 */
function Assertion( validationType, validationDescriptors ) {
	validationDescriptors = validationDescriptors || [];

	if( typeof validationType !== 'string' ) {
		throw new Error( 'validationType is expected to be a string.' );
	}

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

	/**
	 * Returns a copy of the assertion where Assertion.unknown is replaced with a particular value.
	 * If Assertion.unknown is not being used, a self-reference will be returned.
	 *
	 * @param {*} unknown
	 * @return {Assertion}
	 */
	this.withUnknown = function( unknown ) {
		var descriptors = this.getDescriptors();
		var descriptorsChanged = false;

		for( var i = 0; i < descriptors.length; i++ ) {
			var descriptor = descriptors[ i ];

			if( descriptor === Assertion.unknown ) {
				descriptors[ i ] = unknown;
			}

			if( descriptor instanceof Assertion ) {
				descriptors[ i ] = descriptor.withUnknown( unknown );
			}

			descriptorsChanged = descriptorsChanged || descriptor !== descriptors[ i ];
		}
		if( !descriptorsChanged ) {
			return this;
		}
		return new Assertion( this.getType(), descriptors );
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

/**
 * Returns an array whose first value is Assertion.unknown, further values are values given to the
 * function as an array. Convenience function for usage with new Assertion().
 *
 * @param {Array} values
 * @returns {Array}
 */
Assertion.unknown.and = function( values ) {
	if( arguments.length !== 1
		|| typeof values !== 'array'
	) {
		throw new Error( 'First argument is expected to be an array of values. ' +
			'No further arguments expected.' );
	}
	return [ Assertion.unknown ].concat( values );
};