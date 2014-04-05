'use strict';

var ecmaScriptTypes = require( '../ecmaScriptTypeSpecs' );

module.exports = function( typeSpec ) {
	return typeSpec
		.use( function( value ) {
			return typeof value === 'string';
		} )
		.property( 'length', ecmaScriptTypes.number )
	;
};
