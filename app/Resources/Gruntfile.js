module.exports = function (grunt) {
    "use strict";

    var Ten24GenericCmsWebsiteBundle;

    var projectRoot = '../../',
        resourcesPath = projectRoot+'src/Ten24/**/Resources/';

    Ten24GenericCmsWebsiteBundle = {
        'destination':  projectRoot+'web/frontend/',
        'js':           [resourcesPath+'public/**/*.js', '!'+ resourcesPath+'public/vendor/**/*.js', 'Gruntfile.js'],
        'all_scss':     [resourcesPath+'public/scss/**/*.scss'],
        'scss':         [resourcesPath+'public/scss/style.scss'],
        'twig':         [resourcesPath+'views/**/*.html.twig'],
        'img':          [resourcesPath+'public/img/**/*.{png,jpg,jpeg,gif,webp}'],
        'svg':          [resourcesPath+'public/img/**/*.svg']
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            Ten24GenericCmsWebsiteBundleScss: {
                files: Ten24GenericCmsWebsiteBundle.all_scss,
                tasks: ['sass', 'cmq', 'cssmin']
            },
            Ten24GenericCmsWebsiteBundleJs: {
                files: Ten24GenericCmsWebsiteBundle.js,
                tasks: ['uglify', 'concat']
            },
            Ten24GenericCmsWebsiteBundleImages: {
                files: Ten24GenericCmsWebsiteBundle.img,
                tasks: ['imagemin:Ten24GenericCmsWebsiteBundle'],
                options: {
                    event: ['added', 'changed']
                }
            },
            Ten24GenericCmsWebsiteBundleSvg: {
                files: Ten24GenericCmsWebsiteBundle.svg,
                tasks: ['svg2png:Ten24GenericCmsWebsiteBundle', 'svgmin'],
                options: {
                    event: ['added', 'changed']
                }
            },
            livereload: {
                files: ['../../web/frontend/css/style.min.css', '../../web/frontend/js/footer.min.js'],
                options: {
                    livereload: true
                }
            }
        },

        sass: {
            Ten24GenericCmsWebsiteBundle: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '../../web/frontend/.temp/css/style.css': resourcesPath+'public/scss/style.scss',
                }
            }
        },

        cmq: {
            Ten24GenericCmsWebsiteBundle: {
                files: {
                    '../../web/frontend/.temp/css/': '../../web/frontend/.temp/css/style.css'
                }
            }
        },

        cssmin: {
            Ten24GenericCmsWebsiteBundle: {
                // Used to rewrite URLs in (particular) fancybox
                options: {
                    root: '../../web'
                },
                files: {
                    '../../web/frontend/css/style.min.css': [
                        Ten24GenericCmsWebsiteBundle.destination+'.temp/css/style.css'
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
            Ten24GenericCmsWebsiteBundle: {
                files: {
                    src: Ten24GenericCmsWebsiteBundle.js
                }
            }
        },

        uglify: {
            analytics: {
                files: {
                    '../../web/frontend/js/analytics.min.js': [
                        projectRoot+'vendor/kunstmaan/seo-bundle/Kunstmaan/SeoBundle/Resources/public/js/analytics.js'
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
                    '../../web/frontend/.temp/js/vendors.min.js': [
                        projectRoot+'web/vendor/jquery/dist/jquery.js',
                        projectRoot+'web/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js',
                        projectRoot+'web/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js'
                    ]
                }
            },
            Ten24GenericCmsWebsiteBundle: {
                files: {
                    '../../web/frontend/.temp/js/app.min.js': [resourcesPath+'public/js/**/*.js']
                }
            }
        },

        concat: {
            js: {
                src: [
                    Ten24GenericCmsWebsiteBundle.destination+'js/modernizr-custom.js',
                    Ten24GenericCmsWebsiteBundle.destination+'.temp/js/vendors.min.js',
                    Ten24GenericCmsWebsiteBundle.destination+'.temp/js/app.min.js'
                ],
                dest: Ten24GenericCmsWebsiteBundle.destination+'/js/footer.min.js'
            }
        },

        imagemin: {
            Ten24GenericCmsWebsiteBundle: {
                options: {
                    optimizationLevel: 3,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: resourcesPath+'public/img',
                    src: '**/*.{png,jpg,jpeg,gif,webp}',
                    dest: resourcesPath+'public/img'
                }]
            }
        },

        svg2png: {
            Ten24GenericCmsWebsiteBundle: {
                files: [{
                    src: Ten24GenericCmsWebsiteBundle.svg
                }]
            }
        },

        svgmin: {
            Ten24GenericCmsWebsiteBundle: {
                options: {
                    plugins: [{
                        removeViewBox: false
                    }]
                },
                files: [{
                    expand: true,
                    cwd: resourcesPath+'public/img',
                    src: '**/*.svg',
                    dest: resourcesPath+'public/img'
                }]
            }
        },

        modernizr: {
            Ten24GenericCmsWebsiteBundle: {
                devFile: 'remote',
                parseFiles: true,
                files: {
                    src: [
                        Ten24GenericCmsWebsiteBundle.js,
                        Ten24GenericCmsWebsiteBundle.all_scss,
                        Ten24GenericCmsWebsiteBundle.twig
                    ]
                },
                outputFile: Ten24GenericCmsWebsiteBundle.destination + 'js/modernizr-custom.js',

                extra: {
                    'shiv' : false,
                    'printshiv' : false,
                    'load' : true,
                    'mq' : false,
                    'cssclasses' : true
                },
                extensibility: {
                    'addtest' : false,
                    'prefixed' : false,
                    'teststyles' : false,
                    'testprops' : false,
                    'testallprops' : false,
                    'hasevents' : false,
                    'prefixes' : false,
                    'domprefixes' : false
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
