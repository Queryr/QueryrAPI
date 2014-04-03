"use strict";

module.exports = ModelDesign;

var ModelFieldMap = require( './ModelFieldMap' );

/**
 * Describes a model. Basically what fields a model has and what kind of values those fields accept.
 *
 * @param {ModelFieldMap} [fields]
 *
 * @constructor
 * @immutable
 */
function ModelDesign( fields ) {
	fields = fields === undefined ? new ModelFieldMap() : fields;
	if( !( fields instanceof ModelFieldMap ) ) {
		throw new Error( 'First parameter expected to be a ModelFieldMap' );
	}
	fields = fields.copy();

	/**
	 * Getter/setter for a map of ModelField instances describing what fields this model holds.
	 *
	 * @param {ModelFieldMap} [fields]
	 * @returns {ModelFieldMap|ModelDesign} Setter: no effect on original, returns a copy.
	 */
	this.fields = function( newFields ) {
		if( newFields === undefined ) {
			return fields.copy();
		}
		return new this.constructor( newFields );
	};

	/**
	 * Adds or returns a field.
	 *
	 * @param {string} fieldName
	 * @param {ModelField} [field]
	 * @returns {ModelField|ModelDesign} Setter: no effect on original, returns a copy.
	 */
	this.field = function( fieldName, field ) {
		if( field === undefined ) {
			return fields.get( fieldName );
		}
		var modifiedFields = this.fields().set( fieldName, field );
		return new this.constructor( modifiedFields );
	};
}
