'use strict';
/**
 * @file gruntfile
 * @subpackage main
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*\n' + ' * <%= pkg.name %> v<%= pkg.version %>\n'
                + ' * (c) <%= pkg.author.name %> <%= pkg.homepage %>\n'
                + ' * Licensed under <%= pkg.license %>\n' + ' */\n',

        clean: ['index.min.js','min/**/*.js','public/monitode*.*'],

        concat: {
            library: {
                src: ['public/angular.min.js','public/d3.min.js',
                        'public/c3.min.js'],
                dest: 'public/monitode_lib.js',
            },
            own: {
                src: ['public/ajax.js','public/console.js'],
                dest: 'public/monitode_script.js',
            },
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                footer: '\n'
            },
            target: {
                files: [{
                    expand: true,
                    src: 'lib/*.js',
                    dest: 'min'
                },{
                    expand: true,
                    src: 'module/*.js',
                    dest: 'min'
                },{
                    'index.min.js': 'index.js'
                }]
            },
            script: {
                options: {
                    mangle: false,
                    // wrap: 'cl',
                    banner: '<%= banner %>',
                    footer: '\n'
                },
                files: {
                    'public/monitode_min.js': 'public/monitode_script.js'
                }
            }
        },

        cssmin: {
            css: {
                options: {
                    banner: '<%= banner %>',
                    footer: '\n'
                },
                files: {
                    'public/monitode.css': 'public/console.css'
                }
            }
        },

        htmlmin: {
            html: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true,
                    footer: '\n'
                },
                files: {
                    'public/monitode.html': 'public/index.html'
                }
            }
        },

        shell: {
            options: {
                failOnError: false
            },
            docs: {
                command: 'jsdoc ./lib/*.js ./module/*.js -c .jsdoc.json'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('html',['concat','cssmin','htmlmin']);
    grunt.registerTask('min',['clean','html','uglify']);
    grunt.registerTask('doc',['shell']);
    grunt.registerTask('default',['min','doc']);

    return;
};
