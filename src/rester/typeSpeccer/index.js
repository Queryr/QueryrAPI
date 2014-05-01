'use strict';

exports.TypeSpec = require( './TypeSpec' );

exports.typeSpecCreators = {
	number: require( './typeSpecCreators/number' ),
	boolean: require( './typeSpecCreators/boolean' ),
	null: require( './typeSpecCreators/null' ),
	string: require( './typeSpecCreators/string' ),
	mixed: require( './typeSpecCreators/mixed' ),
	instance: require( './typeSpecCreators/instance' )
};

exports.basicTypeSpecs = require( './basicTypeSpecs' );
