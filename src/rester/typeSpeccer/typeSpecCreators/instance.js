'use strict';

var TypeSpec = require( './../TypeSpec' );

module.exports = function( typeSpec ) {
	return typeSpec
		.descriptor( 'of', TypeSpec.REQUIRED_DESCRIPTOR )
		.use( function( value, descriptors ) {
			return value instanceof descriptors.of;
		} );
};
