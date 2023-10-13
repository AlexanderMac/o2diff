<p align="center">
  <h1 align="center">o2diff</h1>
  <p align="center">Compares two objects and returns the differences between them if different formats: changed values, changed paths, differences.</p>
  <p align="center">Works in Node.js and in the browser.</p>
  <p align="center">
    <a href="https://github.com/alexandermac/o2diff/actions/workflows/ci.yml?query=branch%3Amaster"><img src="https://github.com/alexandermac/o2diff/actions/workflows/ci.yml/badge.svg" alt="Build Status"></a>
    <a href="https://codecov.io/gh/AlexanderMac/o2diff"><img src="https://codecov.io/gh/AlexanderMac/o2diff/branch/master/graph/badge.svg" alt="Code Coverage"></a>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/alexandermac/o2diff.svg" alt="License"></a>
    <a href="https://badge.fury.io/js/o2diff"><img src="https://badge.fury.io/js/o2diff.svg" alt="npm version"></a>
  </p>
  <h3 align="center"><a href="https://alexandermac.github.io/o2diff">Demo</a></h3>
</p>

### Features
- Provides three outputs:
  - `diff`: `{ left, right }` the object differences.
  - `values`: `{ changed, added, deleted }`, the changed values.
  - `paths`: `{ changed, added, deleted }`, the changed paths.
- Revert function, to revert the destination object to the source object.

### Install
```bash
$ pnpm i o2diff
```

### Usage
```js
const o2diff = require('o2diff')

const original = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@mail.com',
  phones: [
    { type: 'home', value: '+12222' },
    { type: 'mobile', value: '+11111' }
  ]
}
const current = {
  firstName: 'Michael',
  age: 25,
  email: 'michael@mail.com',
  phones: [
    { type: 'work', value: '+13333' },
    { type: 'mobile', value: '+11111' }
  ],
  address: {
    city: 'New York',
    location: {
      latitude: 40.730610,
      longitude: -73.935242
    }
  }
}

o2diff.diff(original, current)       // returns { left, right } with objects diff
o2diff.diffValues(original, current) // returns { changed, added, deleted } with values diff
o2diff.diffPaths(original, current)  // returns { changed, added, deleted } with paths diff
```

### API

##### diff(original, current)
Returns the differences between `original` and `current`.

  - `original` - the original object.
  - `current` - the current (actual) object.
  - returns `{ left, right }` object.

##### diffValues(original, current)
Returns the added, changed and deleted values between `original` and `current`.

  - `original` - the original object.
  - `current` - the current (actual) object.
  - returns `{ changed, added, deleted }` object.

##### diffPaths(original, current)
Returns the added, changed and deleted paths between `original` and `current`.

  - `original` - the original object.
  - `current` - the current (actual) object.
  - returns `{ changed, added, deleted }` object.

##### revert(dest, src, customizer)
Reverts `dest` object to `src`, calls `customizer` for each `dest.path`.

  - `dest` - the destination object.
  - `src` - the source object.
  - `customizer` - the function that is called for each `dest.path`.

##### getPaths(obj)
Returns all the paths of the object.

  - `obj` - the object.

##### omitPaths(obj, excludedPaths)
Returns the object without `excludedPaths`.

  - `obj` - the object.
  - `excludedPaths` - the array of paths to exclude. The path can be with mask: `*.name` or `name.*` to exclude only path started or ended with the name.

### License
Licensed under the MIT license.

### Author
Alexander Mac
