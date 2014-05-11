'use strict';

module.exports = ModelFieldMap;

var ModelField = require( './ModelField' );

/**
 * Map for ModelField instances. Each object is registered under a specific name, the same instance
 * can be used with various names.
 *
 * @constructor
 */
function ModelFieldMap() {
	var modelFields = {};

	/**
	 * Number of objects in this map.
	 *
	 * @type {number}
	 */
	this.length = 0;

	/**
	 * Adds a new ModelField.
	 *
	 * @param {string} name
	 * @param {ModelField} modelField
	 *
	 * @returns {ModelFieldMap} self-reference
	 */
	this.set = function( name, modelField ) {
		if( !( modelField instanceof ModelField ) ) {
			throw new Error( 'No instance of ModelField given');
		}
		var isOverwrite = !!modelFields[ name ];

		modelFields[ name ] = modelField;

		if( !isOverwrite ) {
			this.length++;
		}
		return this;
	};

	/**
	 * Returns the ModelField instance associated to the given name. Returns null if unknown name
	 * is given.
	 *
	 * @param {string} name
	 * @returns {ModelField|null}
	 */
	this.get = function( name ) {
		return modelFields[ name ] || null;
	};

	/**
	 * Returns whether the given ModelField instance is part of this map.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	this.has = function( name ) {
		return this.get( name ) !== null;
	};

	/**
	 * Returns whether the instance is equal to another one.
	 *
	 * @param {ModelFieldMap|*} other
	 * @returns {boolean}
	 */
	this.equals = function( other ) {
		if( this === other ) {
			return true;
		}
		if(
			!( other instanceof Object )
			|| other.constructor !== this.constructor
			|| other.length !== this.length
		) {
			return false;
		}
		for( var name in modelFields ) {
			var otherField = other.get( name );
			if( !otherField || !otherField.equals( modelFields[ name ] ) ) {
				return false;
			}
		}
		return true;
	};

	/**
	 * Returns a copy of the map.
	 *
	 * @returns {ModelFieldMap}
	 */
	this.copy = function() {
		var copy = new ModelFieldMap();
		this.each( function( field, name ) {
			copy.set( name, field );
		} );
		return copy;
	};

	/**
	 * Allows to iterate over the maps ModelField instances
	 *
	 * @param {function} callback Receives ModelField instance and associated name as arguments.
	 * @param {*} [context] Context for callback, null if omitted.
	 *
	 * TODO: define return value and allow break within callback by returning false
	 */
	this.each = function( callback, context ) {
		for( var name in modelFields ) {
			callback.call(
				context || null,
				modelFields[ name ], name
			);
		}
	};
}
