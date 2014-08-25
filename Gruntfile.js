'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'src',
            dist: 'dist',
            pkg: grunt.file.readJSON('package.json')
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= yeoman.app %>/app.js', '<%= yeoman.app %>/ya-treeview/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/unit/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma:unit']
            },
            styles: {
                files: ['<%= yeoman.app %>/ya-treeview/{,*/}*.less'],
                tasks: ['newer:less:server']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/templates/{,**/}*.html',
                    '<%= yeoman.app %>/index.html',
                    '.tmp/ya-treeview/{,*/}*.css'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/ya-treeview/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        html2js: {
            options: {
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            tree: {
                options: {
                    module: 'ya.treeview.tpls',
                    base: '<%= yeoman.app %>'
                },
                src: ['<%= yeoman.app %>/templates/ya-treeview/*.tpl.html'],
                dest: '.tmp/templates/tree.js'
            },
            breadcrumbs: {
                options: {
                    module: 'ya.treeview.breadcrumbs.tpls',
                    base: '<%= yeoman.app %>'
                },
                src: ['<%= yeoman.app %>/templates/ya-treeview-breadcrumbs/*.tpl.html'],
                dest: '.tmp/templates/breadcrumbs.js'
            }
        },

        copy: {
            fixtures: {
                files: [{
                    expand: true,
                    cwd: 'test/fixtures',
                    src: '*.json',
                    dest: '.tmp'
                }]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/ya-treeview',
                    src: '**/*.js',
                    dest: '.tmp/ya-treeview'
                }]
            }
        },

        // Minifies js files
        uglify: {
            options: {
                wrap: true,
                mangle: true,
                compress: true
            },
            tree: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },
                src: ['.tmp/ya-treeview/treeview.js'],
                dest: '<%= yeoman.dist %>/ya-treeview-<%= yeoman.pkg.version %>.js'
            },
            treeTpls: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },
                src: ['.tmp/ya-treeview/treeview.js', '.tmp/templates/tree.js'],
                dest: '<%= yeoman.dist %>/ya-treeview-<%= yeoman.pkg.version %>-tpls.js'
            },
            treeMin: {
                src: ['.tmp/ya-treeview/treeview.js'],
                dest: '<%= yeoman.dist %>/ya-treeview-<%= yeoman.pkg.version %>.min.js'
            },
            treeMinTpls: {
                src: ['.tmp/ya-treeview/treeview.js', '.tmp/templates/tree.js'],
                dest: '<%= yeoman.dist %>/ya-treeview-<%= yeoman.pkg.version %>-tpls.min.js'
            },
            breadcrumbs: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },
                src: ['.tmp/ya-treeview/treeview-breadcrumbs.js'],
                dest: '<%= yeoman.dist %>/ya-treeview-breadcrumbs-<%= yeoman.pkg.version %>.js'
            },
            breadcrumbsTpls: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },
                src: ['.tmp/ya-treeview/treeview-breadcrumbs.js', '.tmp/templates/breadcrumbs.js'],
                dest: '<%= yeoman.dist %>/ya-treeview-breadcrumbs-<%= yeoman.pkg.version %>-tpls.js'
            },
            breadcrumbsMin: {
                src: ['.tmp/ya-treeview/treeview-breadcrumbs.js'],
                dest: '<%= yeoman.dist %>/ya-treeview-breadcrumbs-<%= yeoman.pkg.version %>.min.js'
            },
            breadcrumbsMinTpls: {
                src: ['.tmp/ya-treeview/treeview-breadcrumbs.js', '.tmp/templates/breadcrumbs.js'],
                dest: '<%= yeoman.dist %>/ya-treeview-breadcrumbs-<%= yeoman.pkg.version %>-tpls.min.js'
            }
        },

        // Compiles LESS to css
        less: {
            options: {
                ieCompat: true
            },
            server: {
                src: ['<%= yeoman.app %>/app.less', '<%= yeoman.app %>/ya-treeview/{,*/}*.less'],
                dest: '.tmp/ya-treeview/treeview.css'
            },
            dist: {
                src: ['<%= yeoman.app %>/ya-treeview/{,*/}*.less'],
                dest: '<%= yeoman.dist %>/ya-treeview-<%= yeoman.pkg.version %>.css'
            },
            distMin: {
                options: {
                    cleancss: true
                },
                src: ['<%= yeoman.app %>/ya-treeview/{,*/}*.less'],
                dest: '<%= yeoman.dist %>/ya-treeview-<%= yeoman.pkg.version %>.min.css'
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            tdd: {
                configFile: 'karma.conf.js',
                autoWatch: true,
                singleRun: false
            }
        },

        protractor: {
            options: {
                configFile: 'protractor.conf.js',
                keepAlive: true,
                noColor: false
            }
        }
    });

    grunt.registerTask('serve', [
        'clean:server',
        'less:server',
        'copy:fixtures',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'less:server',
        'connect:test',
        'karma:unit'
    ]);

    grunt.registerTask('tdd', [
        'clean:server',
        'less:server',
        'connect:test',
        'karma:tdd'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'html2js',
        'ngmin',
        'uglify',
        'less:dist',
        'less:distMin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
