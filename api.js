'use strict';

var config = require('./config/dev-config');
var server = require('./src/server');
var winston = require('winston');

function startLogger(loggerConfig) {
	winston.add(
		winston.transports.File,
		{
			filename: loggerConfig.apiLog
		}
	);

	winston.handleExceptions(new winston.transports.File({
		filename: loggerConfig.exceptionLog
	}));

	winston.info('Logger started');
}

startLogger( config.logger );
server.start( winston.info );