module.exports = function (grunt) {
    "use strict";

    var Builder;

    var projectRoot = '../../',
        destPath = projectRoot + 'src/Ten24/GenericClient/WebsiteBundle/Resources/public/',
        srcPath = projectRoot + 'src/Ten24/GenericClient/WebsiteBundle/Resources/build/',
        vendorPath = projectRoot + 'web/vendor/';

    Builder = {
        'destination': destPath,
        'js': [srcPath + 'js/**/*.js', 'Gruntfile.js'],
        'all_scss': [srcPath + 'scss/**/*.scss'],
        'scss': [srcPath + 'scss/style.scss'],
        'twig': [srcPath + 'views/**/*.html.twig'],
        'img': [srcPath + 'img/**/*.{png,jpg,jpeg,gif,webp}'],
        'svg': [srcPath + 'img/**/*.svg']
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            BuilderScss: {
                files: Builder.all_scss,
                tasks: ['sass', 'cmq', 'cssmin']
            },
            BuilderJs: {
                files: Builder.js,
                tasks: ['uglify', 'concat']
            },
            BuilderImages: {
                files: Builder.img,
                tasks: ['imagemin:Builder'],
                options: {
                    event: ['added', 'changed']
                }
            },
            BuilderSvg: {
                files: Builder.svg,
                tasks: ['svg2png:Builder', 'svgmin'],
                options: {
                    event: ['added', 'changed']
                }
            },
            livereload: {
                files: [
                    Builder.destination + 'css/style.min.css',
                    Builder.destination + 'js/footer.min.js'
                ],
                options: {
                    livereload: true
                }
            }
        },

        sass: {
            Builder: {
                options: {
                    style: 'compressed',
                    cacheLocation: '../../app/cache/.sass-cache/'
                },
                files: {
                    '../../src/Ten24/GenericClient/WebsiteBundle/Resources/build/.temp/css/style.css': srcPath + 'scss/style.scss'
                }
            }
        },

        cmq: {
            Builder: {
                options: {
                    log: true
                },
                files: {
                    // Combine
                    '../../src/Ten24/GenericClient/WebsiteBundle/Resources/build/.temp/css/': [
                        '../../src/Ten24/GenericClient/WebsiteBundle/Resources/build/.temp/css/style.css'
                    ]
                }
            }
        },

        cssmin: {
            Builder: {
                // Used to rewrite URLs in (particular) fancybox
                options: {
                    // This is where bower vendors are installed to (web/vendor)
                    root: '../../web'
                },
                // Can't use srcPath+'build/.temp/css/style.css here for some reason?
                files: {
                    '../../src/Ten24/GenericClient/WebsiteBundle/Resources/public/css/style.min.css': [
                        vendorPath + 'mediaelement/build/mediaelementplayer.css',
                        vendorPath + 'mediaelement/build/mejs-skins.css',
                        vendorPath + 'fancybox/source/jquery.fancybox.css',
                        '../../src/Ten24/GenericClient/WebsiteBundle/Resources/build/.temp/css/style.css'
                    ]
                }
            }
        },

        jshint: {
            options: {
                camelcase: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                forin: true,
                indent: 4,
                trailing: true,
                undef: true,
                browser: true,
                devel: true,
                node: true,
                globals: {
                    jQuery: true,
                    $: true
                }
            },
            Builder: {
                files: {
                    src: Builder.js
                }
            }
        },

        uglify: {
            analytics: {
                files: {
                    '../../src/Ten24/GenericClient/WebsiteBundle/Resources/public/js/analytics.min.js': [
                        projectRoot + 'vendor/kunstmaan/bundles-cms/src/Kunstmaan/SeoBundle/Resources/public/js/analytics.js'
                    ]
                }
            },
            vendors: {
                options: {
                    mangle: {
                        except: ['jQuery']
                    }
                },
                files: {
                    '../../src/Ten24/GenericClient/WebsiteBundle/Resources/build/.temp/js/vendors.min.js': [
                        vendorPath + 'jquery/dist/jquery.js',
                        vendorPath + 'bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js',
                        vendorPath + 'bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js',
                        vendorPath + 'bootstrap-sass-official/assets/javascripts/bootstrap/transition.js'
                    ]
                }
            },
            Builder: {
                files: {
                    '../../src/Ten24/GenericClient/WebsiteBundle/Resources/build/.temp/js/app.min.js': [srcPath + 'js/**/*.js']
                }
            }
        },

        concat: {
            js: {
                src: [
                    srcPath + '.temp/js/modernizr-custom.js',
                    srcPath + '.temp/js/vendors.min.js',
                    srcPath + '.temp/js/app.min.js'
                ],
                dest: destPath + 'js/footer.min.js'
            }
        },

        imagemin: {
            Builder: {
                options: {
                    optimizationLevel: 3,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: '../../src/Ten24/GenericClient/WebsiteBundle/Resources/build/img/',
                    src: '**/*.{png,jpg,jpeg,gif,webp}',
                    dest: '../../src/Ten24/GenericClient/WebsiteBundle/Resources/public/img/'
                }]
            }
        },

        svg2png: {
            Builder: {
                files: [{
                    src: Builder.svg
                }]
            }
        },

        svgmin: {
            Builder: {
                options: {
                    plugins: [{
                        removeViewBox: false
                    }]
                },
                files: [{
                    expand: true,
                    cwd: srcPath + 'img',
                    src: '**/*.svg',
                    dest: destPath + 'img'
                }]
            }
        },

        modernizr: {
            Builder: {
                devFile: 'remote',
                parseFiles: true,
                files: {
                    src: [
                        Builder.js,
                        Builder.all_scss,
                        Builder.twig
                    ]
                },
                outputFile: srcPath + '.temp/js/modernizr-custom.js',

                extra: {
                    'shiv': false,
                    'printshiv': false,
                    'load': true,
                    'mq': false,
                    'cssclasses': true
                },
                extensibility: {
                    'addtest': false,
                    'prefixed': false,
                    'teststyles': false,
                    'testprops': false,
                    'testallprops': false,
                    'hasevents': false,
                    'prefixes': false,
                    'domprefixes': false
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-svg2png');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-modernizr");
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['sass', 'cmq', 'cssmin', 'modernizr', 'uglify', 'concat']);
};
