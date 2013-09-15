"use strict";

var Request = function(queryId) {
	this._queryId = queryId;
};

Request.prototype.getQueryId = function() {
	return this._queryId;
};

module.exports = Request;