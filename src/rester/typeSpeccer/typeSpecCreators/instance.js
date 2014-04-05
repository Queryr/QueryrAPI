'use strict';

module.exports = function( typeSpec ) {
	return typeSpec
		.descriptor( 'of' )
		.use( function( value, descriptors ) {
			return value instanceof descriptors.of;
			// TODO: Something like that^^, not really "options" since "of" is required
		} );
};
