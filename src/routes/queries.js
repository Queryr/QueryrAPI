"use strict";

exports.list = function(req, res) {
	var queries = []; // TODO

	res.send(queries);
};

exports.show = function(req, res) {
	res.send({
		'result': {
			'result': {
				'this will be': 'a query result object serialization'
			},
			'some extra info such as': 'execution time might be here',
			'provided query id': req.params.query
		}
	});
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