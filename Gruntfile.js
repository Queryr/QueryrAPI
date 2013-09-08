'use strict';

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'nodeunit']);

	grunt.initConfig({
		nodeunit: {
			files: ['test/**/*_test.js']
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

};
