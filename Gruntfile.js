module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  require('load-grunt-tasks')(grunt, {scope: ['dependencies', 'devDependencies']});

  grunt.initConfig({
    shell: {
      test: {
        options: { stdout: true },
        command: 'jasmine-node spec/'
      }
    },
    karma: {
      plugins: [
        'karma-osx-reporter'
      ],
      unit: {
        configFile: 'karma-unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unitAuto: {
        configFile: 'karma-unit.conf.js',
        autoWatch: true,
        singleRun: false
      },
    },
    concat: {
      dist: {
        src: ['lib/ng-active-resource/ng-active-resource.js',
              'lib/ng-active-resource/**/*.js'],
        dest: '.tmp/ng-active-resource.js'
      }
    },
    ngmin: {
      dist: {
        src: ['.tmp/ng-active-resource.js'],
        dest: 'dist/ng-active-resource.js'
      }
    },
    uglify: {
      dist: {
        src: 'dist/ng-active-resource.js',
        dest: 'dist/ng-active-resource.min.js'
      }
    },
    clean: [".tmp"]
  });

  grunt.registerTask('build', ['concat:dist', 'ngmin:dist', 'uglify:dist', 'clean']);
  grunt.registerTask('test', 'shell:test');
  grunt.registerTask('autotest', [
    'autotest:unit' 
  ]);

  grunt.registerTask('autotest:unit', [
    'karma:unitAuto' 
  ]);

}
