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

    clean: [ 'index.min.js', 'min/**/*', 'public/**/*.min.*' ],

    concat: {
      library: {
        src: [ 'bower_components/angular/angular.min.js',
            'bower_components/d3/d3.min.js', 'bower_components/c3/c3.min.js' ],
        dest: 'public/js/lib.min.js'
      },
      own: {
        src: [ 'public/js/console.js', 'public/js/ajax.js' ],
        dest: 'public/js/concat.min.js'
      }
    },

    uglify: {
      target: {
        files: [ {
          expand: true,
          src: 'lib/*.js',
          dest: 'min'
        }, {
          expand: true,
          src: 'module/*.js',
          dest: 'min'
        }, {
          'index.min.js': 'index.js'
        } ]
      },
      script: {
        options: {
          mangle: false,
          banner: '<%= banner %>'
        },
        files: {
          'public/js/script.min.js': 'public/js/concat.min.js'
        }
      }
    },

    cssmin: {
      css: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          'public/css/style.min.css': 'public/css/style.css'
        }
      }
    },

    htmlmin: {
      html: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true
        },
        files: {
          'public/index.min.html': 'public/index.html'
        }
      }
    },

    jshint: {
      options: {
        curly: true,
        indent: 2,
        quotmark: 'single',
        undef: true,
        unused: true,
        strict: true,
        node: true,
        // relax
        laxbreak: true,
        loopfunc: true
      },
      target: {
        src: [ 'lib/**/*.js', 'module/**/*.js', 'index.js' ]
      },
      web: {
        options: {
          // override
          unused: false,
          strict: false,
          node: false,
          // web
          predef: [ 'angular', 'c3', 'd3', 'alert' ],
          browser: true,
          jquery: true
        },
        files: {
          src: 'public/js/concat.min.js'
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
    },

    endline: {
      target: {
        options: {
          except: [ 'node_modules', 'bower_components' ]
        },
        files: [ {
          src: './**/*.js'
        }, {
          src: './**/*.css'
        }, {
          src: './**/*.html'
        } ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-endline');

  grunt.registerTask('lint', [ 'jshint' ]);
  grunt.registerTask('html', [ 'concat', 'cssmin', 'htmlmin' ]);
  grunt.registerTask('min', [ 'clean', 'html', 'uglify', 'endline' ]);
  grunt.registerTask('default', [ 'lint', 'min' ]);

  return;
};
