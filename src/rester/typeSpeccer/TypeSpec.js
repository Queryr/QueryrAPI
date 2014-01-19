'use strict';

var Validators = require( './validators/Validators' );

/**
 * Constructor for value type. The value type defines what validators can be used on a value of the
 * type.
 *
 * @param {string} typeName The name of the type.
 *
 * @constructor
 */
module.exports = function TypeSpec() {
	var self = this;

	var using = [];
	var required = [];
	var validators = new Validators();
	var properties = {};

	/**
	 * Allows to define some sort of constructor for values of this type.
	 *
	 * @param fn
	 * @returns {TypeSpec} self-reference
	 */
	this.use = function( fn ) {
		if( typeof fn !== 'function' ) {
			throw 'No callback function given';
		}
		using.push( fn );
		return self;
	};

	/**
	 * Defines what values have to be provided for configuring an instance of this value.
	 *
	 * @param {string} keyWord
	 * // TODO: 2nd parameter for optional validation of the value.
	 * @returns {TypeSpec} self-reference
	 */
	this.requires = function( keyWord ) {
		if( typeof keyWord !== 'string' || keyWord.length === 0 ) {
			throw 'Required keyword has to be a string';
		}
		required.push( required );
		return self;
	};

	/**
	 * Adds a validator associated with a name which can be used on values of this type.
	 *
	 * @param {string|string[]} name
	 * @param {function} validatorFn
	 * @returns {TypeSpec} self-reference
	 */
	this.validator = function( names, validatorFn ) {
		validators.validator( names, validatorFn );
	};

	/**
	 * Map of validator names and their associated callbacks which can be used on values of this
	 * type.
	 *
	 * @param {object} validators
	 * @returns {TypeSpec} self-reference
	 */
	this.validators = function( validatorsMap ) {
		for( var validatorName in validatorsMap ) {
			validators( validatorName, validatorsMap[ validatorName ] );
		}
		return self;
	};

	/**
	 * For describing a property of values of this type.
	 *
	 * @param {string} name
	 * @param {TypeSpec} ofType
	 */
	this.property = function( name, ofType ) {
		// TODO: Type checks.
		properties[ name ] = ofType;
	};
};
