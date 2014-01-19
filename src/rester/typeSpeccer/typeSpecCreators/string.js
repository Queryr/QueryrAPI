'use strict';

var ecmaScriptTypes = require( '../ecmaScriptTypeSpecs' );

module.exports = function( typeSpecBuilder ) {
	return typeSpecBuilder.typeSpec()
		.use( String )
		.property( 'length', ecmaScriptTypes.number )
	;
};
