<p align="center">
  <h1 align="center">o2diff</h1>
  <p align="center">Compares two objects and returns the differences between them in different formats: changed values, changed paths, differences.</p>
  <p align="center">Works in Node.js and in the browser.</p>
  <p align="center">
    <a href="https://github.com/alexandermac/o2diff/actions/workflows/ci.yml?query=branch%3Amaster"><img src="https://github.com/alexandermac/o2diff/actions/workflows/ci.yml/badge.svg" alt="Build Status"></a>
    <a href="https://codecov.io/gh/AlexanderMac/o2diff"><img src="https://codecov.io/gh/AlexanderMac/o2diff/branch/master/graph/badge.svg" alt="Code Coverage"></a>
    <a href="LICENSE"><img src="https://img.shields.io/github/license/alexandermac/o2diff.svg" alt="License"></a>
    <a href="https://badge.fury.io/js/o2diff"><img src="https://badge.fury.io/js/o2diff.svg" alt="npm version"></a>
  </p>
  <h3 align="center"><a href="https://alexandermac.github.io/o2diff">Demo</a></h3>
</p>

# Contents
- [Contents](#contents)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [References](#references)
- [License](#license)

# Install
```bash
$ pnpm i o2diff
```

# Usage
```js
import { diff, diffPaths, diffValues } from 'o2diff'

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

// objects diff
diff(original, current)
/*
{
  left: {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@mail.com',
    phones: [{ type: 'home', value: '+12222' }]
  },
  right: {
    firstName: 'Michael',
    age: 25,
    email: 'michael@mail.com',
    phones: [{ type: 'work', value: '+13333' }],
    address: {
      city: 'New York',
      location: { latitude: 40.730610, longitude: -73.935242 }
    }
  }
}
*/

// values diff
diffValues(original, current)
/*
{
  changed: {
    firstName: 'Michael',
    email: 'michael@mail.com',
    phones: [{ type: 'home', value: '+12222' }]
  },
  added: {
    age: 25,
    address: {
      city: 'New York',
      location: { latitude: 40.730610, longitude: -73.935242 }
    }
  },
  deleted: {
    lastName: 'Smith'
  }
}
*/

// paths diff
diffPaths(original, current)  
/*
{
  changed: [
    'firstName',
    'email',
    'phones[0].type',
    'phones[0].value'
  ],
  added: [
    'age',
    'address.city',
    'address.location.latitude',
    'address.location.longitude'
  ],
  deleted: [
    'lastName'
  ]
}
*/
```

# API

### function diff(original: Input, current: Input): DiffResult
Returns the difference between `original` and `current`.

- `original: Input` - the original object.
- `current: Input` - the current (actual) object.
- returns `{ left, right }: DiffResult` object.

### function diffValues(original: Input, current: Input): DiffValuesResult
Returns added, changed and deleted values between `original` and `current`.

- `original: Input` - the original object.
- `current: Input` - the current (actual) object.
- returns `{ changed, added, deleted }: DiffValuesResult` object.

### function diffPaths(original: Input, current: Input): DiffPathsResult
Returns added, changed and deleted paths between `original` and `current`.

- `original: Input` - the original object.
- `current: Input` - the current (actual) object.
- returns `{ changed, added, deleted }: DiffPathsResult` object.

### function revert(dest: Input, src: Input, customizer: (d: unknown, s: unknown) => unknown): RecordUnknown | ArrayUnknown;
Reverts `dest` object to `src`, calls `customizer` for each `dest.path`.

- `dest: Input` - the destination object.
- `src: Input` - the source object.
- `customizer: (d: unknown, s: unknown) => unknown)` - the function that is called for each `dest.path`.
- returns a record or an array.

### function getPaths(obj: Input): string[]
Returns all paths of the object.

- `obj: Input` - the source object.
- returns the list of paths.

### function omitPaths(obj: Input, excludedPaths: string[]): RecordUnknown | ArrayUnknown
Returns the object without `excludedPaths`.

- `obj: Input` - the source object.
- `excludedPaths` - the array of paths to exclude. The path can be with mask: `*.name` or `name.*` to exclude only path started or ended with the name.
- returns a record or an array.

# License
Licensed under the MIT license.

# Author
Alexander Mac
