"use strict";


/**
 * Describes a model. E.g. what fields a model has and what kind of values those fields accept.
 *
 * @param {string} modelName
 * @param {ModelDesignField[]} fields
 *
 * @constructor
 */
function ModelDesign( modelName, fields ) {
	fields = fields.slice() || [];


}

ModelDesign.prototype.getFields = function() {
	return;
};
// TODO

module.exports = ModelDesign;

function ModelDesignField( fieldName, typeSpec, validators ) {

	// TODO

	this.copy = function() {
		return new this.constructor( fieldName, typeSpec, validators );
	};
}