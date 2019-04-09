'use strict';

const _      = require('lodash');
const should = require('should');
const o2diff = require('../');

describe('o2diff', () => {
  describe('inputs are null', () => {
    it('should return empty diff when original and current are null', () => {
      let original = null;
      let current = null;

      let expected = {
        left: {},
        right: {}
      };
      let actual = o2diff(original, current, 'diff');
      should(actual).eql(expected);
    });

    it('should return empty left and right the same as current, when original is null', () => {
      let original = null;
      let current = { data: 'somedata' };

      let expected = {
        left: {},
        right: {
          data: 'somedata'
        }
      };
      let actual = o2diff(original, current, 'diff');
      should(actual).eql(expected);
    });

    it('should return left the same as original and empty right, when current is null', () => {
      let original = { data: 'somedata' };
      let current = null;

      let expected = {
        left: {
          data: 'somedata'
        },
        right: {}
      };
      let actual = o2diff(original, current, 'diff');
      should(actual).eql(expected);
    });
  });

  describe('inputs are array', () => {
    it('should return left with one element and empty right, when last elem is deleted', () => {
      let original = ['a', 'b', 'c'];
      let current = ['a', 'b'];

      let expected = {
        left: {
          '2': 'c'
        },
        right: {}
      };
      let actual = o2diff(original, current, 'diff');
      should(actual).eql(expected);
    });

    it('should return left and right with one element, when middle elem is changed', () => {
      let original = ['a', 'b', 'c'];
      let current = ['a', 'd', 'c'];

      let expected = {
        left: {
          '1': 'b'
        },
        right: {
          '1': 'd'
        }
      };
      let actual = o2diff(original, current, 'diff');
      should(actual).eql(expected);
    });

    it('should return left with one element and right with two elements, when two elements are added to the end', () => {
      let original = ['a', 'b', 'c'];
      let current = ['a', 'b', 'd', 'e'];

      let expected = {
        left: {
          '2': 'c'
        },
        right: {
          '2': 'd',
          '3': 'e'
        }
      };
      let actual = o2diff(original, current, 'diff');
      should(actual).eql(expected);
    });
  });

  describe('special types', () => {
    function getObjectId(id) {
      function ObjectID() {
        this._id = id || _.random(1000);
        this.toString = function() {
          return this._id.toString();
        };
      }
      return new ObjectID();
    }

    it('should convert to string special types (ObjectID)', () => {
      let ids = [getObjectId(), getObjectId(100), getObjectId(), getObjectId(500)];
      let original = {
        idOne: ids[0],
        idTwo: ids[1],
        idThree: ids[2]
      };
      let current = {
        idOne: ids[0],
        idTwo: ids[3],
        idThree: ids[2]
      };

      let expected = {
        left: {
          idTwo: '100'
        },
        right: {
          idTwo: '500'
        }
      };
      let actual = o2diff(original, current, 'diff');
      should(actual).eql(expected);
    });
  });

  describe('functional tests', () => {
    function getOriginal() {
      return {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@mail.com',
        phones: [
          { type: 'home', value: '+12222' },
          { type: 'mobile', value: '+11111' }
        ]
      };
    }

    function getCurrent() {
      return {
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
    }

    it('should return diff for two objects when format is diff', () => {
      let original = getOriginal();
      let current = getCurrent();

      let expected = {
        left: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@mail.com',
          phones: [
            {
              type: 'home',
              value: '+12222'
            }
          ]
        },
        right: {
          firstName: 'Michael',
          age: 25,
          email: 'michael@mail.com',
          phones: [
            {
              type: 'work',
              value: '+13333'
            }
          ],
          address: {
            city: 'New York',
            location: {
              latitude: 40.730610,
              longitude: -73.935242
            }
          }
        }
      };
      let actual = o2diff(original, current, 'diff');
      should(actual).eql(expected);
    });

    it('should return changed values for two objects when format is values', () => {
      let original = getOriginal();
      let current = getCurrent();

      let expected = {
        added: {
          age: 25,
          address: {
            city: 'New York',
            location: {
              latitude: 40.730610,
              longitude: -73.935242
            }
          }
        },
        deleted: {
          lastName: 'Smith'
        },
        changed: {
          firstName: 'Michael',
          email: 'michael@mail.com',
          phones: [
            {
              type: 'work',
              value: '+13333'
            }
          ]
        }
      };
      let actual = o2diff(original, current, 'values');
      should(actual).eql(expected);
    });

    it('should return changed paths for two objects when format is paths', () => {
      let original = getOriginal();
      let current = getCurrent();

      let expected = {
        addedPaths: [
          'age',
          'address.city',
          'address.location.latitude',
          'address.location.longitude'
        ],
        deletedPaths: [
          'lastName'
        ],
        changedPaths: [
          'firstName',
          'email',
          'phones[0].type',
          'phones[0].value'
        ]
      };
      let actual = o2diff(original, current, 'paths');
      should(actual).eql(expected);
    });

    it('should throw error when format is unsupported', () => {
      let original = getOriginal();
      let current = getCurrent();

      let expected = new Error('Unsupported format: IncorrectFormat');
      expected.type = 'O2DiffError';
      should(o2diff.bind(null, original, current, 'IncorrectFormat')).throw(expected);
    });
  });
});
