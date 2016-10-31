const gulp = require('gulp');
const config = require('./config');
const path = require('path');
const $ = require('gulp-load-plugins')();
const Builder = require('systemjs-builder');

const bundleConfig = {
    baseURL: config.PATHS.dist.cjs,
    defaultJSExtensions: true,
    packageConfigPaths: [
        path.join('.', 'node_modules', '*', 'package.json'),
        path.join('.', 'node_modules', '@angular', '*', 'package.json')
    ],
    paths: {
        'ng2-adal/*': '*',
        '@angular/*': './node_modules/@angular/*',
        'adal.js': './node_modules/adal-angular/lib/adal.js',
        '*': './node_modules/*'
    },
    packages: {
        '@angular/core': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/compiler': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/common': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser': {
            main: 'index.js',
            defaultExtension: 'js'
        },

        '@angular/http' : {
            main: 'index.js',
            defaultExtension: 'js'
        },
        rxjs: {
            main: 'Rx.js',
            defaultExtension: 'js'
        }
    }
};

function bundle(moduleName, moduleBundleName, minify, done) {
    const outputConfig = {
        sourceMaps: true, minify
    };
    const builder = new Builder(bundleConfig);
    const outputFile =
        path.join(config.PATHS.dist.bundles, `${moduleBundleName}${(minify ? '.min' : '')}.js`);
    const bundlePromise =
        builder.bundle(`${moduleName}`, outputFile, outputConfig);
    return bundlePromise.then(() => {
        done();
    });
}

gulp.task('bundle:cjs', ['scripts:cjs'], (done) => {
    bundle('ng2-adal/core', 'ng2-adal', false, done);
});

gulp.task('bundle:cjs:min', ['scripts:cjs'], (done) => {
    bundle('ng2-adal/core', 'ng2-adal', true, done);
});

gulp.task('bundle', ['bundle:cjs', 'bundle:cjs:min']);
