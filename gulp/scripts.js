const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const config = require('./config');
const merge = require('merge2');

const banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

gulp.task('scripts:ts', () =>
    gulp.src(config.PATHS.tsSrcFiles)
        .pipe($.header(banner, { pkg: config.pkg }))
        .pipe(gulp.dest(config.PATHS.dist.ts))
);

// we create the the tsConfig outside the task for fast incremental compilations during a watch.
const taskConfigCjs = $.typescript.createProject(config.PATHS.tsConfig, {
    target: 'ES5',
    module: 'commonjs',
    moduleResolution: 'node',
    declaration: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true
});

gulp.task('scripts:cjs', () => {
    const tsResult = gulp.src([config.PATHS.tsSrcFiles, 'typings/index.d.ts'])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(taskConfigCjs));
    return merge([
        tsResult.dts
            .pipe($.header(banner, { pkg: config.pkg })),
        tsResult.js
            .pipe($.header(banner, { pkg: config.pkg }))
            .pipe($.sourcemaps.write('.'))
    ]).pipe(gulp.dest(config.PATHS.dist.cjs));
});

gulp.task('scripts', ['scripts:cjs', 'scripts:ts']);
