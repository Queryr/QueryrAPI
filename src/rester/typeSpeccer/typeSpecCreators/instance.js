'use strict';

module.exports = function( typeSpecBuilder ) {
	return typeSpecBuilder.typeSpec( 'instance' )
		.requires( 'of' )
		.use( function() {
			return this.value instanceof this.options.of;
			// TODO: Something like that^^, not really "options" since "of" is required
		} );
};
