"use strict";

var ModelDesign = require( './ModelDesign' );

/**
 * Allows to describe models. Knows about the different pieces (field types) that can be used to
 * design a model definition.
 *
 * @param {TypeSpec[]} usableFieldTypes The field types that can be used for describing model
 *        fields when describing models with this ModelDesigner.
 *
 * @constructor
 */
module.exports = function ModelDesigner( usableFieldTypes ) {

	this.model = function( name ) {
		var modelDesign = new ModelDesign(); // TODO
	};
};
