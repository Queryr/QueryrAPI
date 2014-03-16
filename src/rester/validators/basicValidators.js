'use strict';

module.exports = function( validators ) {
	var validator = validators.validator;

	validator(
		function equal( a, b ) {
			return a === b;
		},
		'to be equal with $1'
	);

	validator(
		function ok( value ) {
			return !!value;
		},
		'to be a truthy value'
	);
};
