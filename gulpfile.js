'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    newer = require('gulp-newer'),
    del = require('del'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,

    path = {
        build: {
            html: 'bld/',
            js: 'bld/js/',
            css: 'bld/css/',
            libs: 'bld/libs/'
        },
        source: {
            html: [
                'src/**/*.html',
                '!src/**/_*.html',
                '!src/libs/**/*'
            ],
            js: [
                'src/js/**/*.js',
                '!src/js/isolated/**/*'
            ],
            jsIsolated: 'src/js/isolated/**/*.js',
            jsLtIE9: [
                'src/libs/es5-shim/es5-shim.min.js',
                'src/libs/es5-shim/es5-sham.min.js',
                'src/libs/html5shiv/dist/html5shiv.min.js',
                'src/libs/html5shiv/dist/html5shiv-printshiv.min.js',
                'src/libs/respond/dest/respond.min.js',
                'src/libs/ExplorerCanvas/excanvas.js'
            ],
            cssIsolated: 'src/css/isolated/**/*.css',
            libs: [
                'src/libs/**/*.*',
                '!src/libs/README.md',
                '!src/libs/es5-shim/**/*',
                '!src/libs/html5shiv/**/*',
                '!src/libs/respond/**/*',
                '!src/libs/ExplorerCanvas/**/*'
            ]
        },
        watch: {
            html: [
                'src/**/*.html',
                '!src/libs/**/*'
            ],
            js: [
                'src/js/**/*.js',
                '!src/js/isolated/**/*.js'
            ],
            jsIsolated: 'src/js/isolated/**/*',
            cssIsolated: 'src/css/isolated/**/*',
            libs: 'src/libs/**/*.*'
        },
        clean: {
            build: 'bld'
        }
    },

    webconfig = {
        server: {
            baseDir: "bld/"
        },
        tunnel: false,
        host: 'localhost',
        port: 1111,
    };

function buildHtml() {
    return gulp.src(path.source.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
}

function buildJs() {
    return gulp.src(path.source.js)
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('ur-module.min.js')) // change basename to your project's name
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
}

function buildJsLtIE(verNum) {
    return gulp.src(path.source['jsLtIE'+verNum])
        .pipe(concat('ltIE'+verNum+'.min.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
}

function buildNewer(globSrc, globBld) {
    return gulp.src(globSrc)
        .pipe(newer(globBld))
        .pipe(gulp.dest(globBld))
        .pipe(reload({stream: true}));
}

gulp.task('cleanBuild', function() {
    return del(path.clean.build);
});

gulp.task('build', ['cleanBuild'], function () {
    buildNewer(path.source.libs, path.build.libs);
    buildJs();
    buildJsLtIE(9);
    buildNewer(path.source.jsIsolated, path.build.js);
    buildNewer(path.source.cssIsolated, path.build.css);
    buildHtml();
});

function startServer() {
    browserSync(webconfig);
}

function watch() {
    gulp.watch(path.watch.html, function () { buildHtml(); });
    gulp.watch(path.watch.js, function () { buildJs(); });
    gulp.watch(path.watch.jsIsolated, function () { buildNewer(path.source.jsIsolated, path.build.js); });
    gulp.watch(path.watch.cssIsolated, function () { buildNewer(path.source.cssIsolated, path.build.css); });
    gulp.watch(path.watch.libs, function () { buildNewer(path.source.libs, path.build.libs); });
}

gulp.task('default', ['build'], function () {
    startServer();
    watch();
});
