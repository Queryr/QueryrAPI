'use strict';

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('default', ['jshint', 'nodeunit', 'mochaTest']);
	grunt.registerTask('mocha', ['mochaTest']);
	grunt.registerTask('test', ['mocha', 'nodeunit']);

	grunt.initConfig({
		nodeunit: {
			files: ['test/**/*Test.js']
		},

		mochaTest: {
			test: {
				src: ['test/unit/rester/**/*.test*.js'], // TODO: use regex for last * only to match [a-zA-Z]
				options: {}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			projectBase: {
				src: '*.js'
			},
			src: {
				src: ['src/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			}
		},

		watch: {
			all: {
				files: ['**/*.js'],
				tasks: ['jshint', 'nodeunit', 'mochaTest']
			},
			projectBase: {
				files: '<%= jshint.projectBase.src %>',
				tasks: ['jshint:projectBase', 'nodeunit', 'mochaTest']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src', 'nodeunit', 'mochaTest']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'nodeunit', 'mochaTest']
			}
		}
	});

	grunt.task.registerTask(
		'clean',
		'Remove build files, log files, etc',
		['removelogs']
	);

	grunt.task.registerTask(
		'removelogs',
		'Remove the log files',
		function() {
			var logFiles = grunt.file.expand('logs/*.log');

			if ( logFiles.length > 0 ) {
				grunt.log.write('Deleting log files... ');
				grunt.file.delete(logFiles);
				grunt.log.writeln('log files deleted.');
			}
			else {
				grunt.log.writeln('No log files to be deleted.');
			}
		}
	);

};
