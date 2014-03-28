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
