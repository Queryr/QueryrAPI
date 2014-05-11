'use strict';

var BASIC_TYPES = [ // TODO: Complete list.
	'number',
	'boolean',
	'null',
	'string',
	'mixed',
	'instance'
];

var typeSpeccer = require( './index' );
var TypeSpec = typeSpeccer.TypeSpec;
var typeSpecCreators = typeSpeccer.typeSpecCreators;

var validators = require( '../validators' );
var Validators = validators.Validators;

var basicValidatorsCreator = validators.basicValidators;
var logicalValidatorsCreator = validators.logicalValidators;

for( var i = 0; i < BASIC_TYPES.length; i++ ) {
	var typeName = BASIC_TYPES[ i ];

	var commonValidators = new Validators();
	basicValidatorsCreator( commonValidators );
	logicalValidatorsCreator( commonValidators );

	var basicTypeSpec = new TypeSpec( typeName );
	basicTypeSpec.validators( commonValidators );
	typeSpecCreators[ typeName ]( basicTypeSpec );

	module.exports[ typeName ] = basicTypeSpec;
}
