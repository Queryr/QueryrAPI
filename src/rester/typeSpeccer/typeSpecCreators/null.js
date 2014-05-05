'use strict';

module.exports = function( typeSpec ) {
	return typeSpec
		.use( function( value ) {
			return value === null;
		} )
	;
};
