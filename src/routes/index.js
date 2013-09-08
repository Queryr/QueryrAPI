"use strict";

exports.index = function(req, res) {
	res.render(
		'index',
		{
			title: 'Queryr API'
		}
	);
};

exports.entities = require('./entities');
exports.queries = require('./queries');
exports.results = require('./results');
exports.run = require('./run');
exports.users = require('./users');