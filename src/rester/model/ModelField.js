"use strict";

module.exports = ModelField;

var Assertion = require( '../assert/Assertion' );
var TypeSpec = require( '../typeSpeccer/TypeSpec' );

/**
 * Field to be used in a ModelDesign. Immutable object, all setter operations will result in the
 * creation of a new instance which will then be returned.
 *
 * @param {TypeSpec} type
 * @param {Object|undefined} [descriptors]
 * @param {Assertion|null} [assertion]
 * @constructor
 */
function ModelField( type, descriptors, assertion ) {
	if( !( type instanceof TypeSpec ) ) {
		throw new Error( 'The field\'s type has to be a TypeSpec instance' );
	}

	descriptors = descriptors === undefined ? {} : descriptors;
	if( typeof descriptors !== 'object' || descriptors === null ) {
		throw new Error( 'The field\'s descriptors has to be an object or can be omitted' );
	}

	assertion = assertion || null;
	if( assertion instanceof Assertion ) {
		if( !type.validators().has( assertion.getType() ) ) {
			throw new Error(
				'Assertion "' + assertion.getType() + '" not supported by "' + type.name() + '" type'
			);
		}
		if( !assertion.hasUnknown() ) {
			throw new Error( 'Using an assertion without unknown makes no sense' );
		}
	} else if( assertion !== null ) {
		throw new Error( 'Third constructor parameter has to be an Assertion instance or null' );
	}

	/**
	 * Returns the field's type.
	 *
	 * @returns {TypeSpec}
	 */
	this.type = function() {
		return type;
	};

	/**
	 * Getter/setter for descriptor values necessary to further characterize the field's type.
	 * When used as getter, an object of the descriptor values object will be returned. Changes on
	 * that copy will have no effect on the field's instance.
	 *
	 * @param {Object} newDescriptor
	 * @returns {Object|ModelField} Setter: no effect on original, returns a copy.
	 */
	this.descriptors = function( newDescriptors ) {
		if( newDescriptors === undefined ) {
			return descriptors; // TODO: return copy!
		}
		return this.copy( { descriptors: newDescriptors } );
	};

	/**
	 * Getter/setter for an assertion values of this model field have to pass to be considered
	 * valid.
	 *
	 * NOTE: This is not an array of assertions since an assertion can be an "and" assertion
	 *       consisting out of other assertions.
	 *
	 * @param {Assertion|null} newAssertion
	 * @returns {Assertion|ModelField} Setter: no effect on original, returns a copy.
	 */
	this.assertion = function( newAssertion ) {
		if( newAssertion === undefined ) {
			return assertion;
		}
		return this.copy( { assertion: newAssertion } );
	};

	/**
	 * Returns a copy of this instance.
	 *
	 * @param {Object} [overwrite] Keys "assertions" and/or "descriptors" can be used to specify
	 *        a value to be set instead of the original instance's value respectively.
	 * @returns {ModelField}
	 */
	this.copy = function( overwrite ) {
		overwrite = overwrite || {};
		return new this.constructor(
			type,
			overwrite.descriptors !== undefined ? overwrite.descriptors : descriptors,
			overwrite.assertion !== undefined ? overwrite.assertion : assertion
		);
	};

	// TODO: create a service for this?
	this.newValue = function( value, descriptorValues, asserter ) {
		typeSpec.use()( value ); // TODO: pass descriptors
		// TODO: run assertions
	};
}

function TypeValue() {

}