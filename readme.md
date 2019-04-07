# o2diff

Compares two objects and returns the difference between them (changed values, changed paths, differences). It has only one runtime dependency - lodash.

[![Build Status](https://travis-ci.org/AlexanderMac/o2diff.svg?branch=master)](https://travis-ci.org/AlexanderMac/o2diff)
[![Code Coverage](https://codecov.io/gh/AlexanderMac/o2diff/branch/master/graph/badge.svg)](https://codecov.io/gh/AlexanderMac/o2diff)
[![npm version](https://badge.fury.io/js/o2diff.svg)](https://badge.fury.io/js/o2diff)

## Features
TODO

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

o2diff(original, current, 'diff');   // returns { left, right } diff object
o2diff(original, current, 'values'); // returns { changed, added, deleted } values object
o2diff(original, current, 'paths');  // returns { changedPaths, addedPaths, deletedPaths } paths object
```

## API

### o2diff(original, current, format)
Compares `original` and `current` objects and returns the difference between them in the requested `format` (`diff` || `values` || `paths`).

  - `original` - the original object.
  - `current` - the current (actual) object.
  - `format` - the result format: `diff` || `values` || `paths`.

## Author
Alexander Mac

## Licence
Licensed under the MIT license.
