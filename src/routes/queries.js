"use strict";

exports.list = function(req, res) {
	var queries = []; // TODO

	res.send(queries);
};

exports.show = function(req, res) {
	var QueryDefinitionFetcher = require('./../interactors').QueryDefinitionFetcher;
	var QueryDefinitionRequest = require('./../requests').QueryDefinitionRequest;

	// TODO: figure out how to manage dependencies for interactors properly
	var fetcher = new QueryDefinitionFetcher();

	fetcher.once(
		'fetched',
		function(queryDefinitionResponse) {
			res.send(
				{
					'result': queryDefinitionResponse.getQueryDefinition(),
					'meta': {
						'executionTime': 1337
					},
					'request': {
						'id': req.params.query
					}
				}
			);
		}
	);

	fetcher.fetch(new QueryDefinitionRequest(req.params.query));
};

exports.create = function(req, res) {
	// TODO
};

exports.delete = function(req, res) {
	// TODO
};

exports.showResults = function(req, res) {
	// TODO
};