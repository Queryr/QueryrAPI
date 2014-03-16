'use strict';

module.exports = function( validators ) {
	var validator = validators.validator;

	validator(
		function not( value ) {
			return !value;
		}
	);
	validator( and );
	validator( or );
	validator( nor );
	validator( xor );
};

function and() {
	for( var i = 0; !!arguments[ i ]; i++ ) {}
	return i === arguments.length;
}

function or() {
	for( var i = 0; i < arguments.length; i++ ) {
		if( !!arguments[ i ] ) {
			return true;
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
