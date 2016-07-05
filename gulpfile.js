require('require-dir')('./gulp');
const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('build', (done) => {
  runSequence(
    'clean:dist',
    ['readme:dist',
      'scripts',
      'bundle'],
    'copy-typings',
    'create-package-json',
    done);
});

gulp.task('default', ['build']);
