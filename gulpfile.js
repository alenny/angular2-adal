require('require-dir')('./gulp');
const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', (done) => {
  runSequence(
    'clean:dist',
    ['scripts',
      'bundle'],
    done);
});

gulp.task('default', ['build']);
