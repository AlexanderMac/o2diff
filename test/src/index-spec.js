'use strict';

const _      = require('lodash');
const should = require('should');
const o2diff = require('../../src');

describe('o2diff / main', () => {
  describe('functional tests', () => {
    describe('diff', () => {
      describe('input(s) is/are null', () => {
        it('should return empty diff when original and current are null', () => {
          let original = null;
          let current = null;

          let expected = {
            left: {},
            right: {}
          };
          let actual = o2diff.diff(original, current);
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
          let actual = o2diff.diff(original, current);
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
          let actual = o2diff.diff(original, current);
          should(actual).eql(expected);
        });
      });

      describe('input(s) is/are array', () => {
        it('should return left with one element and empty right, when last elem is deleted', () => {
          let original = ['a', 'b', 'c'];
          let current = ['a', 'b'];

          let expected = {
            left: {
              '2': 'c'
            },
            right: {}
          };
          let actual = o2diff.diff(original, current);
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
          let actual = o2diff.diff(original, current);
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
          let actual = o2diff.diff(original, current);
          should(actual).eql(expected);
        });
      });

      describe('input(s) contain(s) special types', () => {
        function getObjectId(id) {
          function ObjectID() {
            this._id = id || _.random(1000);
            this.toString = function() {
              return this._id.toString();
            };
          }
          return new ObjectID();
        }

        it('should convert to string special type (ObjectID)', () => {
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
          let actual = o2diff.diff(original, current);
          should(actual).eql(expected);
        });
      });

      describe('inputs are complex objects', () => {
        function getOriginal() {
          return {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john@mail.com',
            phones: [
              { type: 'home', value: '+11111' },
              { type: 'work', value: '+12222' }
            ],
            roles: ['admin', 'owner']
          };
        }

        function getCurrent() {
          return {
            firstName: 'Michael',
            age: 25,
            email: 'michael@mail.com',
            phones: [
              { type: 'home', value: '+11111' },
              { type: 'mobile', value: '+13333' },
              { type: 'work', value: '+14444' }
            ],
            address: {
              city: 'New York',
              location: {
                latitude: 40.730610,
                longitude: -73.935242
              }
            },
            roles: ['owner', 'editor']
          };
        }

        it('should return diff for two objects', () => {
          let original = getOriginal();
          let current = getCurrent();

          let expected = {
            left: {
              firstName: 'John',
              lastName: 'Smith',
              email: 'john@mail.com',
              phones: [
                {
                  type: 'work',
                  value: '+12222'
                }
              ],
              roles: ['admin', 'owner']
            },
            right: {
              firstName: 'Michael',
              age: 25,
              email: 'michael@mail.com',
              phones: [
                {
                  type: 'mobile',
                  value: '+13333'
                },
                {
                  type: 'work',
                  value: '+14444'
                }
              ],
              address: {
                city: 'New York',
                location: {
                  latitude: 40.730610,
                  longitude: -73.935242
                }
              },
              roles: ['owner', 'editor']
            }
          };
          let actual = o2diff.diff(original, current);
          should(actual).eql(expected);
        });

        it('should return changed values for two objects in diffValues format', () => {
          let original = getOriginal();
          let current = getCurrent();

          let expected = {
            changed: {
              firstName: 'Michael',
              email: 'michael@mail.com',
              phones: [
                {
                  type: 'mobile',
                  value: '+13333'
                }
              ],
              roles: ['owner', 'editor']
            },
            added: {
              age: 25,
              phones: [
                {
                  type: 'work',
                  value: '+14444'
                }
              ],
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
            }
          };
          let actual = o2diff.diffValues(original, current);
          should(actual).eql(expected);
        });

        it('should return changed paths for two objects when in diffPaths format', () => {
          let original = getOriginal();
          let current = getCurrent();

          let expected = {
            changed: [
              'firstName',
              'email',
              'phones[1].type',
              'phones[1].value',
              'roles[0]',
              'roles[1]'
            ],
            added: [
              'age',
              'phones[2].type',
              'phones[2].value',
              'address.city',
              'address.location.latitude',
              'address.location.longitude'
            ],
            deleted: [
              'lastName'
            ]
          };
          let actual = o2diff.diffPaths(original, current);
          should(actual).eql(expected);
        });
      });
    });

    describe('revert', () => {
      it('should return reverted object', () => {
        let src = {
          a: [1, 2, 3],
          b: {
            ba: 1,
            bb: 'param_auth',
            bc: 2
          },
          c: [
            { c1: 1 },
            { c2: 'param_token' }
          ]
        };
        let dst = {
          a: [4, 5],
          b: {
            ba: 2,
            bb: 'bb',
            bd: 'bd'
          },
          c: [
            { c1: 11 },
            { c2: 12 }
          ],
          d: 5
        };
        let expected = {
          a: [4, 5],
          b: {
            ba: 2,
            bb: 'param_auth',
            bd: 'bd'
          },
          c: [
            { c1: 11 },
            { c2: 'param_token' }
          ],
          d: 5
        };

        let actual = o2diff.revert(src, dst, (srcVal, dstVal) => {
          return _.includes(srcVal, 'param_') ? srcVal : dstVal;
        });
        should(actual).eql(expected);
      });
    });
  });
});
