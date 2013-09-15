"use strict";

var EventEmitter = require('events').EventEmitter;
var QueryDefinitionResponse = require('./../responses').QueryDefinitionResponse;

var Fetcher = function() {
	EventEmitter.call(this);
};

Fetcher.prototype = Object.create(EventEmitter.prototype);
Fetcher.prototype.constructor = Fetcher;

Fetcher.prototype.fetch = function(queryDefinitionRequest) {
	this.emit(
		'fetched',
		new QueryDefinitionResponse({
			'foo': 'bar',
			'baz': queryDefinitionRequest.getQueryId()
		})
	);
};

module.exports = Fetcher;