module.exports = function(grunt) {
  'use strict';

  var myConfig = {
    src: [
      'src/*.js',
      'src/**/*.js',
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
      options: {
        port: 8000,
        livereload: 35729,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open : {
            target: 'http://localhost:8000/',
            callback: function() {}
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
      },
      reload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= watch.gruntfile.files %>',
          '<%= watch.src.files %>',
          '<%= watch.test.files %>',
          '<%= watch.jshint.files %>',
          '**/*.css',
          '**/*.html'
        ],
        tasks: ['build']
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
    },
    gitadd: {
      task: {
        options: {
          exclude: true,
          force: false
        },
        files: {
          src: [
            '.'
          ]
        }
      }
    },
    gitcommit: {
      task: {
        options: {
          message: '<%= pkg.description %>',
          allowEmpty: true
        },
        files: {
          src: [
            '.'
          ]
        }
      }
    },
    gitpush: {
      task: {
        options: {
          branch: 'master',
          remote: '<%= pkg.repository %>',
          upstream: true
        },
        files: {
          src: [
            '.'
          ]
        }
      }
    },
    'npm-publish': {
      options: {
        // list of tasks that are required before publishing
        requires: ['build'],
        // if the workspace is dirty, abort publishing (to avoid publishing local changes)
        abortIfDirty: true
      }
    }
  });

  // Load grunt plugings
  grunt.loadNpmTasks('grunt-npm');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-bump');

  // Register custom tasks
  grunt.registerTask('serve', function () {
    grunt.task.run([
      'connect:livereload',
      'watch'
    ]);
  });

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

  grunt.registerTask('git-release', [
    'gitadd',
    'gitcommit',
    'gitpush'
  ]);

  grunt.registerTask('release', [
    'test',
    'build',
    'git-release',
    'bump-only'
  ]);


  // Default task(s).
  grunt.registerTask('default', ['test', 'serve']);

};
