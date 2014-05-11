'use strict';

var Assertion = require( './Assertion' );

/**
 * Returns a string describing an Assertion object. Used in tests.
 *
 * @param {Assertion} assertion
 * @returns {string}
 */
module.exports = function describeAssertion( assertion ) {
	if( !( assertion instanceof Assertion ) ) {
		throw new Error( 'Instance of Assertion expected' );
	}

	var descriptorsLength = assertion.getDescriptors().length;
	var descr = 'Assertion<' + descriptorsLength + ' descriptors';

	if( descriptorsLength > 0 ) {
		descr += assertion.hasUnknown() ? ' including unknown' : ', no unknown';
	}
	descr += '>';
	return descr;
};
