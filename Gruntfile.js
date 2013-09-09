'use strict';

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'nodeunit']);

	grunt.initConfig({
		nodeunit: {
			files: ['test/**/*Test.js']
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
				tasks: ['jshint', 'nodeunit']
			},
			projectBase: {
				files: '<%= jshint.projectBase.src %>',
				tasks: ['jshint:projectBase', 'nodeunit']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src', 'nodeunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'nodeunit']
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
