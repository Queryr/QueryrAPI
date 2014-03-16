'use strict';

var ecmaScriptTypes = require( '../ecmaScriptTypeSpecs' );

module.exports = function( typeSpecBuilder ) {
	return typeSpecBuilder.typeSpec( 'string' )
		.use( function( value ) {
			return typeof value === 'string';
		} )
		.property( 'length', ecmaScriptTypes.number )
	;
};
