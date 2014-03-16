"use strict";

module.exports = ModelDesign;

/**
 * Describes a model. E.g. what fields a model has and what kind of values those fields accept.
 *
 * @param {Type[]} fields
 *
 * @constructor
 */
function ModelDesign( fields ) {
	fields = fields.slice() || [];
}

ModelDesign.prototype.getFields = function() {
	return;
};
// TODO



function Type( typeSpec, assertions, descriptors ) {
	// TODO
	this.getTypeSpec = function() {
		return typeSpec;
	};

	this.getAssertions = function() {
		return assertions;
	};

	this.getDescriptors = function() {
		return descriptors;
	};

	this.copy = function() {
		return new this.constructor( typeSpec, assertions, descriptors );
	};

	this.newValue = function( value ) { // TODO
		typeSpec.use()( value );
	};
}

function TypeValue() {

}