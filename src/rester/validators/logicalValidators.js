'use strict';

module.exports = function( validators ) {
	return validators
		.validator(
			function not( value ) {
				return !value;
			},
			'not to be'
		)
		.validator( and, expectation( and ) )
		.validator( or,  expectation( or ) )
		.validator( nor, expectation( nor ) )
		.validator( xor, expectation( xor ) )
	;
};

function and() {
	for( var i = 0; !!arguments[ i ]; i++ ) {}
	return (
		i === arguments.length
		&& i > 1 // and() always negative if used with only one argument
	);
}

function or() {
	for( var i = 0; i < arguments.length; i++ ) {
		if( !!arguments[ i ] ) {
			return true; // TODO: what in case of or( true )? throw error or return false?
		}
	}
	return false;
}

function nor() {
	return !and.apply( null, arguments );
}

function xor() {
	var bitSum = 0;
	for( var i = 0; i < arguments.length; i++ ) {
		bitSum += !!arguments[ i ];
	}
	return bitSum % 2 !== 0;
}

function expectation( validation ) {
	var logicalOperation = ' ' + validation.name + ' ';
	return function() {
		return 'to be ' + arguments.join( logicalOperation );
	};
}