const _ = require('lodash')
const should = require('should')
const utils = require('../../src/utils')

describe('o2diff / utils', () => {
  describe('convertSpecial', () => {
    it('should return number when value type is number (simple primitive 1)', () => {
      let expected = 15
      let actual = utils.convertSpecial(15)
      should(actual).eql(expected)
    })

    it('should return string when value type is string (simple primitive 1)', () => {
      let expected = 'John'
      let actual = utils.convertSpecial('John')
      should(actual).eql(expected)
    })

    it('should convert ObjectId to string when value type is ObjectId', () => {
      function getObjectId(id) {
        function ObjectID() {
          this._id = id || _.random(1000)
          this.toString = function() {
            return this._id.toString()
          }
        }
        return new ObjectID()
      }

      let expected = '500'
      let actual = utils.convertSpecial(getObjectId(500))
      should(actual).eql(expected)
    })
  })

  describe('compact', () => {
    it('should return number when obj is number (simple primitive 1)', () => {
      let expected = 15
      let actual = utils.compact(15)
      should(actual).eql(expected)
    })

    it('should return string when obj is string (simple primitive 2)', () => {
      let expected = 'John'
      let actual = utils.compact('John')
      should(actual).eql(expected)
    })

    it('should return compacted array when obj is array', () => {
      let expected = [1, 3]
      let actual = utils.compact([1, null, 3])
      should(actual).eql(expected)
    })

    it('should return object with compacted arrays when obj is a complex object', () => {
      let obj = {
        firstName: 'Michael',
        age: 25,
        phones: [
          { type: 'home', value: '+11111', codes: [1, 2] },
          { type: 'mobile', value: '+13333', codes: [1, null, 3] },
          null,
          { type: 'work', value: '+14444', codes: [null, undefined] }
        ],
        address: {
          city: 'New York',
          country: null,
          locations: [
            null,
            {
              latitude: 40.730610,
              longitude: -73.935242
            },
            {
              latitude: 40.730615,
              longitude: undefined
            }
          ]
        },
        roles: ['owner', null, 'editor']
      }
      let expected = {
        firstName: 'Michael',
        age: 25,
        phones: [
          { type: 'home', value: '+11111', codes: [1, 2] },
          { type: 'mobile', value: '+13333', codes: [1, 3] },
          { type: 'work', value: '+14444', codes: [] }
        ],
        address: {
          city: 'New York',
          country: null,
          locations: [
            {
              latitude: 40.730610,
              longitude: -73.935242
            },
            {
              latitude: 40.730615,
              longitude: undefined
            }
          ]
        },
        roles: ['owner', 'editor']
      }

      let actual = utils.compact(obj)
      should(actual).eql(expected)
    })
  })
})
