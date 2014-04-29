'use strict';

var expect = require( 'expect.js' );
var _ = require( 'underscore' );

var rester = require( '../../../../' ).rester;
var ModelFieldMap = rester.model.ModelFieldMap;
var ModelField = rester.model.ModelField;
var TypeSpec = rester.typeSpeccer.TypeSpec;

var someType = new TypeSpec( 'someType' );
var anotherType = new TypeSpec( 'anotherType' );

var threeFieldsFieldMap = new ModelFieldMap()
	.set( 'one', new ModelField( someType ) )
	.set( 'two', new ModelField( anotherType ) )
	.set( 'three', new ModelField( new TypeSpec( 'thirdOne' ) ) )
;

module.exports = function modelFieldMapInstanceProvider() {
	return {
		'empty ModelFieldMap':[
			new ModelFieldMap(),
			new ModelFieldMap().copy()
		],
		'ModelFieldMap with field of type "someType"':
			new ModelFieldMap()
				.set( 'foo', new ModelField( someType ) )
		,
		'ModelFieldMap with field of type "anotherType"':
			new ModelFieldMap()
				.set( 'foo', new ModelField( anotherType ) )
		,
		'ModelFieldMap with two fields "foo" and "bar" of type "someType" and "anotherType"':
			new ModelFieldMap()
				.set( 'foo', new ModelField( someType ) )
				.set( 'bar', new ModelField( anotherType ) )
		,
		'ModelFieldMap with two fields "foo" and "bar" of type "anotherType" and "someType"':
			new ModelFieldMap()
				.set( 'foo', new ModelField( anotherType ) )
				.set( 'bar', new ModelField( someType ) )
		,
		'ModelFieldMap with three fields': [
			threeFieldsFieldMap,
			threeFieldsFieldMap.copy()
		]
	};
};
