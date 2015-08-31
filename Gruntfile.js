module.exports = function(grunt) {
  'use strict';

  var myConfig = {
    src: [
      'src/gravity.js',
      'src/gravity.controller.js',
      'src/gravity.directive.js',
      'src/gravity.service.js',
      'src/gravity.constants.js',
      'src/particles/particle.factory.js',
      'src/magnets/magnet.factory.js'
    ],
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*\n' +
        ' * <%= pkg.name %>\n' +
        ' * @Description <%= pkg.description %>\n' +
        ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * @link <%= pkg.homepage %>\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
        ' */',
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>\n'
      },
      build: {
        src: myConfig.src,
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    clean: {
      dist: ['dist/*js']
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>\n',
        stripBanners: true
      },
      dist: {
        src: myConfig.src,
        dest: 'dist/<%= pkg.name %>.js'
      }
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
        configFile: 'karma.conf.js',
        singleRun: true
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
        src: myConfig.src
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
        files: myConfig.src,
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
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commitMessage: 'Gravity 2D Model release: bump v<%= pkg.version %>',
        tagName: 'v<%= pkg.version %>',
        tagMessage: 'Gravity 2D Model release: bump v<%= pkg.version %>',
        commitFiles: ['-a'],
        pushTo: '<%= pkg.repository %>'
      }
    }
  });

  // Load grunt plugings
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-bump');

  // Register custom tasks
  grunt.registerTask('build', [
    'clean',
    'test',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'karma:unit'
  ]);

  grunt.registerTask('release', [
    'test',
    'bump-only',
    'build',
    'bump-commit'
  ]);

  // Default task(s).
  grunt.registerTask('default', ['connect']);

};
