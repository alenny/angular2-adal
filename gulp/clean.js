const gulp = require('gulp');
const del = require('del');
const config = require('./config');

gulp.task('clean:dist', (done) => del([config.PATHS.dist.base + "/*"], done));

gulp.task('clean', ['clean:dist']);