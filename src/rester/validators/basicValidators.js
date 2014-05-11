'use strict';

module.exports = function( validators ) {
	return validators
		.validator(
			function equal( a, b ) {
				return a === b;
			},
			'to be equal to $1'
		)
		.validator(
			function ok( value ) {
				return !!value;
			},
			'to be a truthy value'
		)
	;
};
