'use strict';

module.exports = process.env.TEST_COV ? require('./lib-cov/') : require('./src/');