'use strict';

/**
 * Simple model which can be generated from a ModelDesign.
 *
 * @param {Object} values Map of field names to respective values.
 *
 * @constructor
 * @abstract
 */
function SimpleModel( values ) {
	for( var field in values ) {
		var value = values[ field ];
		this.set( field, value );
	}
}

SimpleModel.prototype = {
	constructor: SimpleModel,

	_fields: null,

	/**
	 * Will set a field's value.
	 *
	 * @param {string} fieldName
	 * @param {*} value
	 * @returns {Model} self-reference
	 *
	 * @throws {Error} If given value is not valid for the specified field.
	 */
	'set': function( fieldName, value ) {
		if( !this.hasModelField( fieldName ) ) {
			throw new Error( '"' + fieldName + '" is not a field known to this model' );
		}

		this.assertIsValidFieldValue( fieldName, value );

		this._fields[ fieldName ] = value;
		return this;
	},

	/**
	 * Returns the value of a certain field.
	 *
	 * @param fieldName
	 * @returns {*}
	 */
	'get': function( fieldName ) {
		if( !this.hasModelField( fieldName ) ) {
			throw new Error( '"' + fieldName + '" is not a field known to this model' );
		}
		return this._fields[ fieldName ];
	},

	/**
	 * Returns the fields known to this model.
	 *
	 * @return {string[]}
	 */
	getModelFields: function() {
		return [];
	},

	/**
	 * Returns whether the model knows the given field.
	 *
	 * @param fieldName
	 * @returns {boolean}
	 */
	hasModelField: function( fieldName ) {
		var modelFields = this.getModelFields();
		for( var i = 0; i < modelFields; i++ ) {
			if( modelFields[ i ] === fieldName ) {
				return true;
			}
		}
		return false;
	},

	/**
	 * Validates values for a given field name.
	 *
	 * @abstract
	 *
	 * @param {string} fieldName
	 * @param {*} value
	 * @throws {Error} If field is not valid
	 */
	assertIsValidFieldValue: function( fieldName, value ) {
		throw new Error( 'Abstract implementation of assertIsValidFieldValue not overwritten' );
	}
};

module.exports = SimpleModel;