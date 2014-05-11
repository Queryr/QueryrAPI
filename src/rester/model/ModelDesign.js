"use strict";

module.exports = ModelDesign;

var ModelFieldMap = require( './ModelFieldMap' );
var referenceType = require( './referenceTypeSpec' );
var mixedType = require( '../typeSpeccer/basicTypeSpecs' ).mixed;

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
		var modifiedFields = this.fields().copy().set( fieldName, field );
		return new this.constructor( modifiedFields );
	};

	/**
	 * Returns whether the instance is equal to another one.
	 *
	 * @param {ModelDesign|*} other
	 * @returns {boolean}
	 */
	this.equals = function( other ) {
		if( this === other ) {
			return true;
		}
		if(
			!( other instanceof Object )
			|| other.constructor !== this.constructor
		) {
			return false;
		}
		return fields.equals( other.fields() );
	};

	/**
	 * Returns a list of other model design names this ModelDesign instance has references to.
	 *
	 * TODO: This is quick and dirty, should embrace open/closed principle for supporting other
	 *  field types which might hold references as well. => Move into a service. Would also be nice
	 *  To have a service to get references per ModelField already.
	 */
	this.modelReferences = function() {
		var extractReferencesFrom = function( field ) {
			switch( field.type() ) {
				case mixedType:
					var references = [];
					var fieldsFields = field.descriptors().restrictedTo;
					for( var i = 0; i < fieldsFields.length; i++ ) {
						var fieldsFieldReferences = extractReferencesFrom( fieldsFields[ i ] );
						references = references.concat( fieldsFieldReferences );
					}
					return references;
				case referenceType:
					return [ field.descriptors().to ];
			}
			return [];
		};
		var references = [];
		fields.each( function( field ) {
			var extractedReferences = extractReferencesFrom( field );
			for( var i = 0; i < extractedReferences.length; i++ ) {
				references.indexOf( extractedReferences[ i ] ) === -1
					&& references.push( extractedReferences[ i ] );
			}
		} );
		return references;
	};
}
