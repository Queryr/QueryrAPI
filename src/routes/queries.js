"use strict";

exports.list = function(req, res) {
	var queries = []; // TODO

	res.send(queries);
};

exports.show = function(req, res) {
	res.send({
		'query': req.params.query
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