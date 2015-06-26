(function () {
    'use strict';

    var gulp = require('gulp');
    var ngTemplates = require('gulp-ng-templates');
    var ngAnnotate = require('gulp-ng-annotate');

    var moduleName = 'ng.zl';

    gulp.task('default', function () {

    });

    gulp.task('release', function () {
        
    });

    gulp.task('annotate', function () {
        return gulp.src('js/**/*.js')
            .pipe(ngAnnotate())
            .pipe(gulp.dest('dist'));
    });

    gulp.task('templates', function () {
        return gulp.src('views/*.html')
            .pipe(ngTemplates(moduleName))
            .pipe(gulp.dest('js'));
    });
})();