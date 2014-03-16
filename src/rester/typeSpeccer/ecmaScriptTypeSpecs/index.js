'use strict';

var ECMA_SCRIPT_TYPES = [ // TODO: Complete list.
	'string',
	'number',
	'boolean'
];
// TODO: perhaps just have "basic types" instead of ECMA script types. E.g. "number" could then
//       work slightly different; only allow real numbers, no NaN and infinite.

var Validators = require( '../assertions/Validators' );
var commonAssertions = require( '../assertions/basicValidators' )( new Validators() );

var TypeSpecBuilder = require( '../TypeSpecBuilder' );
var ecmaScriptTypeSpecBuilder = new TypeSpecBuilder( commonAssertions );

var basicTypeSpecCreators = require( '../typeSpecCreators' );

for( var type in ECMA_SCRIPT_TYPES ) {
	var creator = basicTypeSpecCreators[ type ];
	var typeSpec = creator( ecmaScriptTypeSpecBuilder );

	module.exports[ type ] = typeSpec;
}
