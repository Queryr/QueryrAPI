'use strict';

exports.TypeSpec = require( './TypeSpec' );

exports.typeSpecCreators = {
	number: require( './typeSpecCreators/number' ),
	boolean: require( './typeSpecCreators/boolean' )
};

