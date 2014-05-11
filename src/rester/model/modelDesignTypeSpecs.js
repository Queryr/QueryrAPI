'use strict';

var originalBasicTypeSpecs = require( '../typeSpeccer/basicTypeSpecs' );
var referenceType = require( './referenceTypeSpec' );

module.exports = {};

for( var typeSpecName in originalBasicTypeSpecs ) {
	module.exports[ typeSpecName ] = originalBasicTypeSpecs[ typeSpecName ];
}
module.exports.reference = referenceType;
