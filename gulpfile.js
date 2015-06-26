(function () {
    'use strict';

    var gulp = require('gulp');
    var ngTemplates = require('gulp-ng-templates');
    var ngAnnotate = require('gulp-ng-annotate');
    var uglify = require('gulp-uglify');
    var uglifycss = require('gulp-uglifycss');
    var concat = require('gulp-concat');
    var sequence = require('gulp-sequence');
    var del = require('del');
    var rename = require('gulp-rename');

    var moduleName = 'ng.zl';

    gulp.task('default', function () {

    });

    gulp.task('release', function (cb) {
        sequence('clean.before', ['annotate', 'templates'], 'concat', 'uglify', 'copy.css', 'uglifycss', 'clean.after', cb);
    });

    gulp.task('clean.before', function () {
        del(['dist/*.js', 'dist/js', 'dist/*.css']);
    });

    gulp.task('annotate', function () {
        return gulp.src('js/**/*.js')
            .pipe(ngAnnotate())
            .pipe(gulp.dest('dist/js'));
    });

    gulp.task('templates', function () {
        return gulp.src('views/*.html')
            .pipe(ngTemplates(moduleName))
            .pipe(gulp.dest('dist/js'));
    });

    gulp.task('concat', function () {
        return gulp.src(['dist/js/**/*.js', 'dist/js/*.js'])
            .pipe(concat('ng.zl.js'))
            .pipe(gulp.dest('dist'));

    });

    gulp.task('uglify', function () {
        return gulp.src('dist/*.js')
            .pipe(uglify())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('dist'));
    });

    gulp.task('copy.css', function () {
        return gulp.src('css/*.css')
            .pipe(gulp.dest('dist'));
    });

    gulp.task('uglifycss', function () {
        return gulp.src('dist/*.css')
            .pipe(uglifycss())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('dist'));
    });

    gulp.task('clean.after', function () {
        del(['dist/js']);
    });

})();