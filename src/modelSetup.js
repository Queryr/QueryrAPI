'use strict';

// TODO: Outdated and some wrong in here, also copied some stuff to ecmaScriptTypeSpecs already.

var rester = require( 'rester');
var FieldTypeBuilder = rester.model.FieldTypeBuilder;
var ModelDesigner = rester.model.ModelDesigner;


var modelFieldTypes = [];

var commonAssertions = new rester.model.Assertions();
rester.model.basicAssertions( commonAssertions );

var fieldTypeBuilder = new FieldTypeBuilder( commonAssertions );
var modelFieldTypeCreators = rester.model.fieldTypeCreators;

for( var creator in modelFieldTypeCreators ) {
	var modelFieldType = creator( fieldTypeBuilder );
	modelFieldTypes.push( modelFieldType );
}



var modelDesigner = new ModelDesigner( modelFieldTypes );

var modelDefinitionCreators = require( './modelDefinitions' );

module.exports = false;