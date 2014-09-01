module.exports = function(grunt) {
	
	// config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compress: {
			main: {
				options: {
					archive: 'development/build.zip'
				},
				files: [
					{ src: ['config.xml'], cwd: 'app', expand: true },
					{ src: ['index.html'], cwd: 'app', expand: true },
					{ src: ['scripts/**'], cwd: 'app', expand: true },
					{ src: ['styles/**'], cwd: 'app', expand: true },
					{ src: ['views/**'], cwd: 'app', expand: true }
				]
			}
		},
		concat: {
			js: {
				src: ['app/scripts/**/*.js'],
				dest: 'build/scripts/racepoint.js'
			},
			vendor: {
				files: {
					'build/styles/vendor.css': [
						'bower_components/ratchet/dist/css/ratchet.min.css',
						'bower_components/ratchet/dist/css/ratchet-theme-android.min.css'
					],
					'build/scripts/vendor.js': [
						'bower_components/angular/angular.min.js',
						'bower_components/angular-route/angular-route.min.js',
						'bower_components/ratchet/dist/js/ratchet.min.js'
					]
				}
			}
		},
		connect: {
			main: {
				options: {
					base: 'build',
					keepalive: false,
					livereload: true,
					open: false,
					port: 9000,
					middleware: function(connect) {
						return [
							connect.static(require('path').resolve('build'))
						];
					}
				}
			}
		},
		copy: {
			images: {
				expand: true,
				cwd: 'app',
				src: 'images/**',
				dest: 'build/'
			},
			fonts: {
				expand: true,
				cwd: 'app',
				src: 'fonts/**',
				dest: 'build/'
			},
			cordova: {
				src: 'app/config.xml',
				dest: 'build/config.xml'
			}
		},
		htmlmin: {
			options: {
				collapseWhitespace: true,
				conservativeCollapse: true,
				keepClosingSlash: true,
				removeComments: true
			},
			main: {
				files: [
					{
						cwd: 'app',
						expand: true,
						src: ['index.html', 'views/**/*.html'],
						dest: 'build'
					}
				]
			}
		},
		jshint: {
			files: ['app/scripts/**/*.js']
		},
		less: {
			main: {
				options: {
					cleancss: true
				},
				files: {
					'build/styles/racepoint.css': 'app/styles/style.less'
				}
			}
		},
		uglify: {
			main: {
				options: {
					mangle: false
				},
				files: {
					'build/scripts/racepoint.js': ['build/scripts/racepoint.js']
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			html: {
				files: ['app/index.html', 'app/views/**/*.html'],
				tasks: ['htmlmin']
			},
			css: {
				files: ['app/styles/style.less'],
				tasks: ['less']
			},
			js: {
				files: ['app/scripts/**/*.js'],
				tasks: ['jshint', 'concat:js', 'uglify']
			},
			images: {
				files: ['app/images/**'],
				tasks: ['copy:images']
			}
		},
		'phonegap-build': {
			debug: {
				options: {
					archive: 'development/build.zip',
					appId: "",
					user: {
						email: "",
						password: ""
					}
				}
			}
		}
	});
	
	// load plugins
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-phonegap-build');
	
	// tasks
	grunt.registerTask('build', ['htmlmin', 'less', 'concat', 'uglify', 'copy']);
	grunt.registerTask('serve', ['build', 'connect', 'watch']);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('phonegap', ['build', 'compress', 'phonegap-build']);
	
}
