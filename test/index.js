'use strict';

const _      = require('lodash');
const should = require('should');
const o2diff = require('../');

describe('o2diff', () => {
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
    function getDefaultOriginal() {
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

    function getDefaultCurrent() {
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
      let original = getDefaultOriginal();
      let current = getDefaultCurrent();

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
      let original = getDefaultOriginal();
      let current = getDefaultCurrent();

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
      let original = getDefaultOriginal();
      let current = getDefaultCurrent();

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
      let original = getDefaultOriginal();
      let current = getDefaultCurrent();

      let expected = new Error('Unsupported format: IncorrectFormat');
      expected.type = 'O2DiffError';
      should(o2diff.bind(null, original, current, 'IncorrectFormat')).throw(expected);
    });
  });
});
