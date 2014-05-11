'use strict';

module.exports = function( typeSpec ) {
	return typeSpec
		.use( function( value ) {
			return typeof value === 'string';
		} )
		//.property( 'length', 'number' )
	;
};
