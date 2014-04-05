'use strict';

var Validators = require( '../validators/Validators' );

/**
 * Constructor for value type. The value type defines what validators can be used on a value of the
 * type.
 *
 * @param {string} typeName The name of the type.
 *
 * @constructor
 */
module.exports = function TypeSpec( name ) {
	var self = this;

	var using = [];
	var descriptors = [];
	var validators = new Validators();
	var properties = {};

	if( typeof name !== 'string' || name.length < 1 ) {
		throw new Error( ' No name given for this type' );
	}

	/**
	 * Returns the type's name.
	 *
	 * @returns {string}
	 */
	this.name = function () {
		return name;
	};

	/**
	 * Allows to define some sort of constructor for values of this type. The callback function
	 * has access to descriptors required for instances of this type.
	 * If called without parameter, a function for validating a value against the TypeSpec will
	 * be returned. The function takes a value and throws an error if the given value is invalid.
	 *
	 * @example <code>
	 *     instance.use( function( value ) {
	 *         return value instanceof SomeConstructor;
	 *     } );
	 * </code>
	 * @example <code>instance.use( descriptors )( someValue )</code>
	 *
	 * @param {Function} [fnOrDescriptorValues]
	 * @returns {TypeSpec|Function} self-reference
	 */
	this.use = function( fnOrDescriptorValues ) {
		if( typeof fnOrDescriptorValues === 'function' ) {
			using.push( fnOrDescriptorValues );
			return self;
		}

		if( fnOrDescriptorValues instanceof Object || fnOrDescriptorValues === undefined ) {
			return newValueConstructor( fnOrDescriptorValues || {} );
		}

		throw 'no callback function given';
	};

	function newValueConstructor( descriptorValues ) {
		for( var i = 0; i < descriptors.length; i++ ) {
			var descriptor = descriptors[ i ];
			if( descriptorValues[ descriptor ] === undefined ) {
				throw new Error( 'No value given for descriptor "' + descriptor + '"' );
			}
		}
		return function( value ) {
			for( var i = 0; i < using.length; i++ ) {
				var ret = using[ i ]( value, descriptorValues );
				if( ret === false ) {
					throw new Error( '"' + value + '" is not a valid ' + name );
				}
			}
			return value;
		};
	}

	/**
	 * Adds the name of a detail descriptor required for defining an instance of this type.
	 *
	 * @param {string} keyWord
	 * // TODO: 2nd parameter for optional validation of the value.
	 * @returns {TypeSpec} self-reference
	 *
	 * TODO: might be that this should not be part of the TypeSpec. The information is only needed
	 *  when building the DSL for allowing e.g. modelDesigner.field( '...').as.instance().of( 'xxx').
	 *  So if this feature should be available in the DSL, then the information could be provided
	 *  separately. The information could also be generated by parsing the "use" function's toString().
	 */
	this.descriptor = function( keyWord ) {
		if( typeof keyWord !== 'string' || keyWord.length === 0 ) {
			throw 'Required keyword has to be a string';
		}
		descriptors.push( keyWord );
		return self;
	};

	/**
	 * Adds a validator associated with a name which can be used on values of this type. Returns
	 * a Validator instance or null if used with first parameter only.
	 *
	 * @see Validators.validator
	 *
	 * @returns {TypeSpec|Validator|null} self-reference or requested Validator instance or null
	 */
	this.validator = function() {
		var ret = validators.validator.apply( validators, arguments );
		return ret instanceof Validators ? self : ret;
	};

	/**
	 * Returns or sets the validators available for this type.
	 *
	 * @param {Validators} newValidators
	 * @returns {Validators|TypeSpec} the type's validators or a self-reference if used as setter.
	 */
	this.validators = function( newValidators ) {
		if( !newValidators ) {
			return validators;
		}
		if( !( newValidators instanceof Validators ) ) {
			throw new Error( 'Validators instance expected' );
		}
		validators = newValidators;
		return self;
	};

	/**
	 * Returns or sets the TypeSpec of a given property of this type.
	 *
	 * @param {string} name
	 * @param {TypeSpec|null} [ofType]
	 * @returns {TypeSpec|null} self-reference or if used as getter, the typeSpec matching the
	 *          given name or null if none is set.
	 */
	this.property = function( name, ofType ) {
		if( ofType  === undefined ) {
			return properties[ name ] || null;
		}
		if( ofType !== null && !( ofType instanceof TypeSpec ) ) {
			throw new Error( 'Expect a TypeSpec instance or null as second parameter' );
		}
		properties[ name ] = ofType;
		return self;
	};
};
