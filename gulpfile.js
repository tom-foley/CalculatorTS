var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('compile-typescript', function () {
    var tsProject = ts.createProject('./tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('./'));
});

gulp.task('default', ['compile-typescript']);