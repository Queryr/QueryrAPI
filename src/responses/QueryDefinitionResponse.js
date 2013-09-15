"use strict";

var Response = function(queryDefinition) {
	this._queryDefinition = queryDefinition;
};

Response.prototype.getQueryDefinition = function() {
	return this._queryDefinition;
};

module.exports = Response;