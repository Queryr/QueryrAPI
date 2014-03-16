'use strict';

module.exports = function( typeSpecBuilder ) {
	return typeSpecBuilder.typeSpec( 'boolean' )
		.use( function( value ) {
			return typeof value === 'boolean';
		} )
	;
};
