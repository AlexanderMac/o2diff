import * as _ from 'lodash'
import should from 'should'

import * as o2diff from '../../src/index'
import { getObjectID } from './test-utils'

describe('o2diff / main', () => {
  describe('diff', () => {
    describe('input(s) is/are null', () => {
      it('should return the empty diff when the original and the current are null', () => {
        const original = null
        const current = null

        const expected = {
          left: {},
          right: {},
        }
        const actual = o2diff.diff(original, current)
        should(actual).eql(expected)
      })

      it('should return the empty left and the right equals the current when the original is null', () => {
        const original = null
        const current = { data: 'some-data' }

        const expected = {
          left: {},
          right: {
            data: 'some-data',
          },
        }
        const actual = o2diff.diff(original, current)
        should(actual).eql(expected)
      })

      it('should return the left equals the original and the empty right when the current is null', () => {
        const original = { data: 'some-data' }
        const current = null

        const expected = {
          left: {
            data: 'some-data',
          },
          right: {},
        }
        const actual = o2diff.diff(original, current)
        should(actual).eql(expected)
      })
    })

    describe('input(s) is/are array', () => {
      it('should return the left with one element and the empty right when the last element is deleted', () => {
        const original = ['a', 'b', 'c']
        const current = ['a', 'b']

        const expected = {
          left: {
            '2': 'c',
          },
          right: {},
        }
        const actual = o2diff.diff(original, current)
        should(actual).eql(expected)
      })

      it('should return the left and the right with one element when the middle element is changed', () => {
        const original = ['a', 'b', 'c']
        const current = ['a', 'd', 'c']

        const expected = {
          left: {
            '1': 'b',
          },
          right: {
            '1': 'd',
          },
        }
        const actual = o2diff.diff(original, current)
        should(actual).eql(expected)
      })

      it('should return the left with one element and the right with two elements when two elements are added at the end', () => {
        const original = ['a', 'b', 'c']
        const current = ['a', 'b', 'd', 'e']

        const expected = {
          left: {
            '2': 'c',
          },
          right: {
            '2': 'd',
            '3': 'e',
          },
        }
        const actual = o2diff.diff(original, current)
        should(actual).eql(expected)
      })
    })

    describe('input(s) contain(s) special types', () => {
      it('should convert the special type (ObjectID) to string', () => {
        const ids = [getObjectID(), getObjectID(100), getObjectID(), getObjectID(500)]
        const original = {
          idOne: ids[0],
          idTwo: ids[1],
          idThree: ids[2],
        }
        const current = {
          idOne: ids[0],
          idTwo: ids[3],
          idThree: ids[2],
        }

        const expected = {
          left: {
            idTwo: '100',
          },
          right: {
            idTwo: '500',
          },
        }
        const actual = o2diff.diff(original, current)
        should(actual).eql(expected)
      })
    })

    describe('inputs are complex objects', () => {
      function getOriginal() {
        return {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@mail.com',
          phones: [
            { type: 'home', value: '+11111' },
            { type: 'work', value: '+12222' },
          ],
          roles: ['admin', 'owner'],
        }
      }

      function getCurrent() {
        return {
          firstName: 'Michael',
          age: 25,
          email: 'michael@mail.com',
          phones: [
            { type: 'home', value: '+11111' },
            { type: 'mobile', value: '+13333' },
            { type: 'work', value: '+14444' },
          ],
          address: {
            city: 'New York',
            location: {
              latitude: 40.73061,
              longitude: -73.935242,
            },
          },
          roles: ['owner', 'editor'],
        }
      }

      it('should return the diff for two objects', () => {
        const original = getOriginal()
        const current = getCurrent()

        const expected = {
          left: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john@mail.com',
            phones: [
              {
                type: 'work',
                value: '+12222',
              },
            ],
            roles: ['admin', 'owner'],
          },
          right: {
            firstName: 'Michael',
            age: 25,
            email: 'michael@mail.com',
            phones: [
              {
                type: 'mobile',
                value: '+13333',
              },
              {
                type: 'work',
                value: '+14444',
              },
            ],
            address: {
              city: 'New York',
              location: {
                latitude: 40.73061,
                longitude: -73.935242,
              },
            },
            roles: ['owner', 'editor'],
          },
        }
        const actual = o2diff.diff(original, current)
        should(actual).eql(expected)
      })

      it('should return the changed values for two objects in diffValues format', () => {
        const original = getOriginal()
        const current = getCurrent()

        const expected = {
          changed: {
            firstName: 'Michael',
            email: 'michael@mail.com',
            phones: [
              {
                type: 'mobile',
                value: '+13333',
              },
            ],
            roles: ['owner', 'editor'],
          },
          added: {
            age: 25,
            phones: [
              {
                type: 'work',
                value: '+14444',
              },
            ],
            address: {
              city: 'New York',
              location: {
                latitude: 40.73061,
                longitude: -73.935242,
              },
            },
          },
          deleted: {
            lastName: 'Smith',
          },
        }
        const actual = o2diff.diffValues(original, current)
        should(actual).eql(expected)
      })

      it('should return the changed paths for two objects in diffPaths format', () => {
        const original = getOriginal()
        const current = getCurrent()

        const expected = {
          changed: ['firstName', 'email', 'phones[1].type', 'phones[1].value', 'roles[0]', 'roles[1]'],
          added: [
            'age',
            'phones[2].type',
            'phones[2].value',
            'address.city',
            'address.location.latitude',
            'address.location.longitude',
          ],
          deleted: ['lastName'],
        }
        const actual = o2diff.diffPaths(original, current)
        should(actual).eql(expected)
      })
    })
  })

  describe('revert', () => {
    it('should return the reverted object', () => {
      const src = {
        a: [1, 2, 3],
        b: {
          ba: 1,
          bb: 'param_auth',
          bc: 2,
        },
        c: [{ c1: 1 }, { c2: 'param_token' }],
      }
      const dst = {
        a: [4, 5],
        b: {
          ba: 2,
          bb: 'bb',
          bd: 'bd',
        },
        c: [{ c1: 11 }, { c2: 12 }],
        d: 5,
      }
      const expected = {
        a: [4, 5],
        b: {
          ba: 2,
          bb: 'param_auth',
          bd: 'bd',
        },
        c: [{ c1: 11 }, { c2: 'param_token' }],
        d: 5,
      }

      const actual = o2diff.revert(src, dst, (srcVal, dstVal) => {
        return _.includes(srcVal, 'param_') ? srcVal : dstVal
      })
      should(actual).eql(expected)
    })
  })

  describe('getPaths', () => {
    it("should return the object's paths", () => {
      const obj = {
        a: 1,
        b: {
          ba: 2,
          bc: [1, 2, 3],
        },
        c: [{ ca: 1, cb: [1, 2] }, 3],
      }
      const expected = ['a', 'b.ba', 'b.bc[0]', 'b.bc[1]', 'b.bc[2]', 'c[0].ca', 'c[0].cb[0]', 'c[0].cb[1]', 'c[1]']

      const actual = o2diff.getPaths(obj)
      should(actual).eql(expected)
    })
  })

  describe('omitPaths', () => {
    it('should return the object without excluded paths', () => {
      const obj = {
        id: 1,
        a: 1,
        b: {
          id: 2,
          ba: 2,
          bc: [1, 2, 3],
        },
        c: [{ id: 3, a: 1, cb: [1, 2] }, 3],
        d: {
          da: '1',
        },
      }
      const excludedPaths = ['a', '*.id', 'd.*']
      const expected = {
        b: {
          ba: 2,
          bc: [1, 2, 3],
        },
        c: [{ a: 1, cb: [1, 2] }, 3],
      }

      const actual = o2diff.omitPaths(obj, excludedPaths)
      should(actual).eql(expected)
    })
  })
})
