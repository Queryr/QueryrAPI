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
var TypeSpec = module.exports = function TypeSpec( name ) {
	var self = this;

	var using = [];
	var descriptors = {};
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
	 * be returned. The function takes a value and throws an error if the given value is invalid. If
	 * valid, the value will be returned.
	 *
	 * @example <code>
	 *     instance.use( function( value ) {
	 *         return value instanceof SomeConstructor;
	 *     } );
	 * </code>
	 * @example <code>instance.use( descriptors )( someValue )</code>
	 *
	 * @param {Function|Object} [fnOrDescriptorValues]
	 * @returns {TypeSpec|Function} self-reference or function for creating new value
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
		self.validateDescriptorValues( descriptorValues );

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
	 * @param {string|Object} descriptor Either the name of an optional descriptor or a more
	 *        detailed descriptor definition as object containing fields for "name" (string),
	 *        "validator" (function( value ), optional) and "compare" (function( value1, value2 ),
	 *        optional).
	 * @param {function} [validationFn] if first parameter given as string, this can be used to
	 *        provide the validation callback.
	 *
	 * @returns {TypeSpec} self-reference
	 */
	this.descriptor = function( description, validationFn ) {
		if( typeof description === 'string' ) {
			description = {
				name: description,
				validate: validationFn
			};
		}
		var descriptorName = description.name;
		if( typeof descriptorName !== 'string' || descriptorName.length === 0 ) {
			throw 'Required keyword has to be a string';
		}
		descriptors[ descriptorName ] = {
			validate: description.validate || TypeSpec.OPTIONAL_DESCRIPTOR,
			compare: description.compare || TypeSpec.SIMPLE_DESCRIPTOR_EQUALITY
		};
		return self;
	};

	/**
	 * Returns a descriptor previously set via #descriptor(). Will return the descriptor as an
	 * object with all fields set, filled with default values if not given originally.
	 *
	 * @returns {Object}
	 */
	this.descriptor.get = function( name ) {
		return descriptors[ name ] || null;
	};

	/**
	 * Takes an object of descriptor name and value pairs and evaluates them against the TypeSpec's
	 * descriptor definitions.
	 *
	 * @param {Object} descriptorValues
	 *
	 * @throws {Error} If invalid value is given for a descriptor.
	 */
	this.validateDescriptorValues = function( descriptorValues ) {
		for( var descriptorName in descriptors ) {
			var descriptorDescription = descriptors[ descriptorName ];
			var givenValue = descriptorValues[ descriptorName ];

			if( descriptorDescription.validate( givenValue ) !== true ) {
				throw new Error( 'invalid value ' + givenValue + ' given for descriptor "' + descriptorName + '"' );
			}
		}
		for( var givenDescriptorName in descriptorValues ) {
			if( !descriptors[ givenDescriptorName ] ) {
				throw new Error( 'unknown descriptor "' + givenDescriptorName + '" given' );
			}
		}
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

TypeSpec.REQUIRED_DESCRIPTOR = function( value ) {
	return value !== undefined;
};

TypeSpec.OPTIONAL_DESCRIPTOR = function( value ) {
	return true;
};

TypeSpec.SIMPLE_DESCRIPTOR_EQUALITY = function( descriptor, otherDescriptor ) {
	return descriptor === otherDescriptor;
};