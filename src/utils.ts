import {
  compact as _compact,
  forEach,
  trimStart,
  isEqual,
  set,
  isBoolean,
  isDate,
  isNil,
  isNumber,
  isRegExp,
  isString,
  isSymbol,
  filter,
  get,
} from 'lodash'

import { ArrayUnknown, Input, ObjectsDiff, RecordUnknown } from './types'

export const getLibVersion = () => {
  return '5.0.0'
}

export function getObjectPaths(input: Input, curPath = '', isArray = false): string[] {
  const paths: string[] = []
  forEach(input, (value, key) => {
    value = convertSpecial(value)
    const newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`
    if (isSimplePrimitive(value)) {
      paths.push(newPath)
    } else if (Array.isArray(value)) {
      paths.push(...getObjectPaths(value as ArrayUnknown, newPath, true))
    } else {
      paths.push(...getObjectPaths(value as RecordUnknown, newPath))
    }
  })

  if (curPath) {
    return paths
  }
  return paths.map(path => trimStart(path, '.'))
}

// TODO: test it
export function getObjectsDiff(left: Input, right: Input): ObjectsDiff {
  const leftPaths = getObjectPaths(left)

  const reducer: ObjectsDiff = {
    values: {},
    paths: [],
  }
  return leftPaths.reduce((result, path) => {
    const leftVal = convertSpecial(get(left, path))
    const rightVal = convertSpecial(get(right, path))
    if (!isEqual(leftVal, rightVal)) {
      set(result.values, path, leftVal)
      result.paths.push(path)
    }
    return result
  }, reducer)
}

// TODO: test it
export function getObjectValues(input: Input, paths: string[]): RecordUnknown | ArrayUnknown {
  const values = paths.reduce((result, path) => {
    const value = convertSpecial(get(input, path))
    set(result, path, value)
    return result
  }, {})
  return compact(values)
}

export function isSimplePrimitive(value: unknown): boolean {
  return (
    isNil(value) ||
    isBoolean(value) ||
    isNumber(value) ||
    isString(value) ||
    isDate(value) ||
    isSymbol(value) ||
    isRegExp(value)
  )
}

export function convertSpecial<T>(value: T): T | string {
  if (value && value.constructor.name === 'ObjectID') {
    return value.toString()
  }
  return value
}

export function compact(input: RecordUnknown | ArrayUnknown): RecordUnknown | ArrayUnknown {
  const value = convertSpecial(input)
  if (isSimplePrimitive(value)) {
    return value as any
  }
  if (Array.isArray(value)) {
    return _compact(value)
  }

  const result: RecordUnknown = {}
  forEach(value as RecordUnknown, (objItem, objKey) => {
    objItem = convertSpecial(objItem)
    if (isSimplePrimitive(objItem)) {
      result[objKey] = objItem
    } else if (Array.isArray(objItem)) {
      result[objKey] = filter(objItem, v => !isNil(v))
      forEach(result[objKey] as RecordUnknown | ArrayUnknown, (arrItem, arrIndex) => {
        ;(result[objKey] as RecordUnknown)[arrIndex] = compact(arrItem as RecordUnknown | ArrayUnknown)
      })
    } else {
      result[objKey] = compact(objItem as RecordUnknown | ArrayUnknown)
    }
  })
  return result
}
