/// <binding BeforeBuild='build:scripts' Clean='clean:libs' ProjectOpened='autobuild:scripts' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var mergeStream = require('merge-stream');
var rimraf = require('rimraf');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var tscConfig = require('./tsconfig.json');

var paths = {
    npm: './node_modules/',
    scripts: './wwwroot/**/*.ts',
    lib: './wwwroot/lib',
    css: './wwwroot/lib/css',
    appdev: './wwwroot/'
};

var dependencies = [
    paths.npm + 'angular2/bundles/js',
    paths.npm + 'angular2/bundles/angular2.*.js*',
    paths.npm + 'angular2/bundles/angular2-polyfills.js',
    paths.npm + 'angular2/bundles/http.*.js*',
    paths.npm + 'angular2/bundles/router.*.js*',
    paths.npm + 'systemjs/dist/system.js',
    paths.npm + 'systemjs/dist/system-polyfills.js',
    paths.npm + 'es6-shim/es6-shim.js',
    paths.npm + 'es6-promise/dist/es6-promise.js',
    paths.npm + 'rxjs/bundles/Rx.js',
    paths.npm + 'bootstrap/dist/js/bootstrap*.js'
];

var styleSheets = [
    paths.npm + 'bootstrap/dist/css/bootstrap.css'
];

gulp.task('copy:libs', function () {
    var libStream = gulp.src(dependencies).pipe(gulp.dest(paths.lib));
    var stylesStream = gulp.src(styleSheets).pipe(gulp.dest(paths.css));
    return mergeStream(libStream, stylesStream);
});

gulp.task('clean:libs', function (callback) {
    rimraf(paths.lib, callback);
});

// to invoke 'copy:libs' before 'build:scripts' use the following task definition instead
//gulp.task('build:scripts', ['copy:libs'], function () {

gulp.task('build:scripts', function () {
    return gulp.src(paths.scripts)
               .pipe(sourcemaps.init())
		       .pipe(ts(tscConfig.compilerOptions))
               .pipe(sourcemaps.write('.'))
               .pipe(gulp.dest(paths.appdev));
});

gulp.task('autobuild:scripts', function () {
    return gulp.watch(paths.scripts, ['build:scripts']);
});
