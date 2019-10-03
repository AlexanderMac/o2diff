# o2diff

Compares two objects and returns the differences between them (changed values, changed paths, differences).

[![Build Status](https://travis-ci.org/AlexanderMac/o2diff.svg?branch=master)](https://travis-ci.org/AlexanderMac/o2diff)
[![Code Coverage](https://codecov.io/gh/AlexanderMac/o2diff/branch/master/graph/badge.svg)](https://codecov.io/gh/AlexanderMac/o2diff)
[![npm version](https://badge.fury.io/js/o2diff.svg)](https://badge.fury.io/js/o2diff)

## Features
- Three output formats:
  - `diff`: `{ left, right }` to get the objects differences.
  - `values`: `{ changed, added, deleted }`, to get the changed values.
  - `paths`: `{ changed, added, deleted }`, to get the changed paths.
- Revert function, to revert destination object to source object.
- Converters for special types (ObjectId).

## Commands
```sh
# Add to project
$ npm i o2diff
```

## Usage
```js
const o2diff = require('o2diff');

let original = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@mail.com',
  phones: [
    { type: 'home', value: '+12222' },
    { type: 'mobile', value: '+11111' }
  ]
};
let current = {
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
};

o2diff.diff(original, current);   // returns { left, right } with objects diff
o2diff.diffValues(original, current); // returns { changed, added, deleted } with values diff
o2diff.diffPaths(original, current);  // returns { changed, added, deleted } with paths diff
```

## API

### diff(original, current)
Returns the differences between `original` and `current`.

  - `original` - the original object.
  - `current` - the current (actual) object.
  - returns `{ left, right }` object.

### diffValues(original, current)
Returns the added, changed and deleted values between `original` and `current`.

  - `original` - the original object.
  - `current` - the current (actual) object.
  - returns `{ changed, added, deleted }` object.

### diffPaths(original, current)
Returns the added, changed and deleted paths between `original` and `current`.

  - `original` - the original object.
  - `current` - the current (actual) object.
  - returns `{ changed, added, deleted }` object.

### revert(dest, src, customizer)
Reverts `dest` object to `src`, calls `customizer` for each `dest.path`.

  - `dest` - the destination object.
  - `src` - the source object.
  - `customizer` - the function that is called for each `dest.path`.

## Author
Alexander Mac

## Licence
Licensed under the MIT license.
