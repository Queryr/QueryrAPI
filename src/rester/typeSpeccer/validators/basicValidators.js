'use strict';

module.exports = function( validators ) {
	var validator = validators.validator;

	validator(
		'equal',
		function equal( a, b ) {
			return a === b;
		}
	);

	validator(
		'ok',
		function ok( value ) {
			return !!value;
		}
	);

	// TODO: The following are not "basic", rather "logical" or something else

	validator(
		'not',
		function not( value ) {
			return !value;
		}
	);

	validator(
		'and',
		function and( a, b ) {
			return !!( a && b );
		}
	);

	validator(
		'xor',
		function xor( a, b ) {
			return !!( !( a && b ) && a || b );
		}
	);

	validator(
		'or',
		function or( a, b ) {
			return !!( a || b );
		}
	);

	validator(
		'nor',
		function nor( a, b ) {
			return !( a && b );
		}
	);
};
