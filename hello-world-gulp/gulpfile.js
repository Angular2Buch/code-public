'use strict';

var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    notify = require('gulp-notify'),
    // note: gulp-typescript seems to ignore sourceMap settings from tsconfig.json (TODO)
    tsProject = ts.createProject('tsconfig.json');

gulp.task('typescript', function () {

  var tsResult = tsProject.src()
    .pipe(notify("Found file: <%= file.relative %>"))
    .pipe(ts(tsProject));

  return tsResult.js.pipe(gulp.dest('./'));
});


gulp.task('default', ['typescript']);

gulp.task('watch', function() {
    gulp.watch('*.ts', ['typescript']);
});
