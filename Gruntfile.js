module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '\n' +
        ' * <%= pkg.name %>\n' +
        ' * @Description <%= pkg.description %>\n ' +
        ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * @link <%= pkg.homepage %>\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
        ' * \n',
    },
    uglify: {
      options: {
        banner: '/*! <%= meta.banner %> */\n'
      },
      build: {
        src: [
          'src/gravity.js',
          'src/gravity.controller.js',
          'src/gravity.directive.js',
          'src/gravity.service.js',
          'src/gravity.constants.js',
          'src/particles/particle.factory.js',
          'src/magnets/magnet.factory.js'
        ],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    clean: {
      dist: ['dist/*js']
    },
    connect: {
      server: {
        options: {
          keepalive: true,
          port: 8000,
          hostname: 'localhost',
          open : {
            target: 'http://localhost:8000/demo/', // target url to open
            //appName: '<%= pkg.name %>', // name of the app that opens, ie: open, start, xdg-open
            callback: function() {} // called when the app has opened
          }
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: [
          'src/gravity.js',
          'src/gravity.controller.js',
          'src/gravity.directive.js',
          'src/gravity.service.js',
          'src/gravity.constants.js',
          'src/particles/particle.factory.js',
          'src/magnets/magnet.factory.js'
        ],
      },
      test: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
      },
      src: {
        files: [
          'src/gravity.js',
          'src/gravity.controller.js',
          'src/gravity.directive.js',
          'src/gravity.service.js',
          'src/gravity.constants.js',
          'src/particles/particle.factory.js',
          'src/magnets/magnet.factory.js'
        ],
        tasks: ['default', 'test'],
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test'],
      },
      jshint: {
        files: ['.jshintrc'],
        tasks: ['jshint'],
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      gravity: {
        files: {
          expand: true,
          src:[
            'src/gravity.js',
            'src/gravity.controller.js',
            'src/gravity.directive.js',
            'src/gravity.service.js',
            'src/gravity.constants.js',
            'src/particles/particle.factory.js',
            'src/magnets/magnet.factory.js'
          ],
          rename: function (dest, src) { return src + '-annotated'; },
        }
      }
    },

  });

  // Load grunt plugings
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');

  // Register custom task
  grunt.registerTask('build', [
    'clean',
    'uglify'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'karma:unit'
  ]);

  // Default task(s).
  grunt.registerTask('default', ['build']);

};
