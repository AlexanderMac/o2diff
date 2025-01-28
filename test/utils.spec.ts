import * as utils from '../src/utils'
import { getObjectID } from './test-utils'

describe('o2diff / utils', () => {
  describe('isSimplePrimitive', () => {
    it('should return true when the value is a simple primitive', () => {
      expect(utils.isSimplePrimitive(null)).toEqual(true)
      expect(utils.isSimplePrimitive(undefined)).toEqual(true)
      expect(utils.isSimplePrimitive(true)).toEqual(true)
      expect(utils.isSimplePrimitive(15)).toEqual(true)
      expect(utils.isSimplePrimitive('string')).toEqual(true)
      expect(utils.isSimplePrimitive(new Date())).toEqual(true)
      expect(utils.isSimplePrimitive(Symbol('sym'))).toEqual(true)
      expect(utils.isSimplePrimitive(/[a-z]/)).toEqual(true)
    })

    it('should return false when the value isn`t a simple primitive', () => {
      expect(utils.isSimplePrimitive({ p: 1 })).toEqual(false)
      expect(utils.isSimplePrimitive([{ p: 1 }])).toEqual(false)
    })
  })

  describe('convertSpecial', () => {
    it('should return number when value type is number (simple primitive 1)', () => {
      const expected = 15
      const actual = utils.convertSpecial(15)
      expect(actual).toEqual(expected)
    })

    it('should return string when value type is string (simple primitive 1)', () => {
      const expected = 'John'
      const actual = utils.convertSpecial('John')
      expect(actual).toEqual(expected)
    })

    it('should convert ObjectId to string when value type is ObjectId', () => {
      const expected = '500'
      const actual = utils.convertSpecial(getObjectID(500))
      expect(actual).toEqual(expected)
    })
  })

  describe('compact', () => {
    it('should return number when obj is number (simple primitive 1)', () => {
      const expected = 15
      const actual = utils.compact(15 as any)
      expect(actual).toEqual(expected)
    })

    it('should return string when obj is string (simple primitive 2)', () => {
      const expected = 'John'
      const actual = utils.compact('John' as any)
      expect(actual).toEqual(expected)
    })

    it('should return compacted array when obj is array', () => {
      const expected = [1, 3]
      const actual = utils.compact([1, null, 3])
      expect(actual).toEqual(expected)
    })

    it('should return object with compacted arrays when obj is a complex object', () => {
      const obj = {
        firstName: 'Michael',
        age: 25,
        phones: [
          { type: 'home', value: '+11111', codes: [1, 2] },
          { type: 'mobile', value: '+13333', codes: [1, null, 3] },
          null,
          { type: 'work', value: '+14444', codes: [null, undefined] },
        ],
        address: {
          city: 'New York',
          country: null,
          locations: [
            null,
            {
              latitude: 40.73061,
              longitude: -73.935242,
            },
            {
              latitude: 40.730615,
              longitude: undefined,
            },
          ],
        },
        roles: ['owner', null, 'editor'],
      }
      const expected = {
        firstName: 'Michael',
        age: 25,
        phones: [
          { type: 'home', value: '+11111', codes: [1, 2] },
          { type: 'mobile', value: '+13333', codes: [1, 3] },
          { type: 'work', value: '+14444', codes: [] },
        ],
        address: {
          city: 'New York',
          country: null,
          locations: [
            {
              latitude: 40.73061,
              longitude: -73.935242,
            },
            {
              latitude: 40.730615,
              longitude: undefined,
            },
          ],
        },
        roles: ['owner', 'editor'],
      }

      const actual = utils.compact(obj)
      expect(actual).toEqual(expected)
    })
  })
})
