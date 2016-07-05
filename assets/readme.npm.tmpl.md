# <%= pkg.name %>  (https://travis-ci.org/salemdar/angular2-cookie) [![npm version](https://badge.fury.io/js/angular2-cookie.svg)](http://badge.fury.io/js/angular2-cookie) [![Downloads](http://img.shields.io/npm/dm/angular2-adal.svg)](https://npmjs.org/package/angular2-adal)

> <%= pkg.description %> **v<%= pkg.version %>**

_Upgraded to Angular2 release candidates._

## Table of contents:
- [Get Started](#get-started)
  - [Example](#example)
  - [Installation](#installation)
  - [Usage](#usage)
- [AdalService](#adalService)
  - [Properties](#properties)
    - [userInfo](#userInfo)
  - [Methods](#methods)
    - [init(configOptions)](#init)
    - [handleWindowCallback()](#handleWindowCallback)
    - [login()](#login)
    - [logOut()](#logOut)

## <a name="example"></a> Example

A complete example can be found on [GitHub](https://github.com/alenny/angular2-adal-example). 

## <a name="get-started"></a> Get Started

### <a name="installation"></a> Installation

You can install this package locally with npm.

```bash
# To get the latest stable version and update package.json file:
npm install angular2-adal --save
```

After installing the library, you need to include angular2-adal and adal in the SystemJS configurations.

```javascript
/**
 * System configuration for Angular 2 application
 */
(function (global) {
  // map tells the System loader where to look for things
  var map = {
    'app': 'app',
    '@angular': 'lib/@angular',
    'angular2-in-memory-web-api': 'lib/angular2-in-memory-web-api',
    'rxjs': 'lib/rxjs',
    'angular2-cookie': 'lib/angular2-cookie',
    'angular2-adal': 'lib/angular2-adal',
    'adal': 'lib/adal-angular/lib'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app': { main: 'main.js', defaultExtension: 'js' },
    'rxjs': { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { defaultExtension: 'js' },
    'angular2-cookie': { main: 'core.js', defaultExtension: 'js' },
    'angular2-adal': { main: 'core.js', defaultExtension: 'js' },
    'adal': { main: 'adal.js', defaultExtension: 'js' }
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade'
  ];
  // Add package entries for angular packages
  ngPackageNames.forEach(function (pkgName) {
    packages['@angular/' + pkgName] = { main: pkgName + '.umd.js', defaultExtension: 'js' };
  });
  var config = {
    map: map,
    packages: packages
  };
  System.config(config);
})(this);
```

To enable building TypeScript, you need to add ADAL library definitions to typings/index.d.ts.

```typescript
/// <reference path="../node_modules/angular2-adal/typings/adal/index.d.ts" />
/// <reference path="globals/core-js/index.d.ts" />
/// <reference path="globals/jasmine/index.d.ts" />
```

### <a name="usage"></a> Usage

to be done...

## <a name="adalService"></a> AdalService

to be done...