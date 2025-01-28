import { difference, get, intersection, set, trimEnd, trimStart } from 'lodash'

import { ArrayUnknown, Input, ObjectsDiff, RecordUnknown } from './types'
import { compact, getObjectPaths, getObjectsDiff, getObjectValues } from './utils'

export type DiffResult = {
  left: RecordUnknown | ArrayUnknown
  right: RecordUnknown | ArrayUnknown
}

export type DiffValuesResult = {
  changed: RecordUnknown | ArrayUnknown
  added: RecordUnknown | ArrayUnknown
  deleted: RecordUnknown | ArrayUnknown
}

export type DiffPathsResult = {
  changed: string[]
  added: string[]
  deleted: string[]
}

export type PathsResult = {
  addedAndChanged: ObjectsDiff
  deletedAndChanged: ObjectsDiff
  changedPaths: string[]
  addedPaths: string[]
  deletedPaths: string[]
}

export function diff(original: Input, current: Input): DiffResult {
  const { addedAndChanged, deletedAndChanged } = _getPaths(original, current)

  return {
    left: compact(deletedAndChanged.values),
    right: compact(addedAndChanged.values),
  }
}

export function diffValues(original: Input, current: Input): DiffValuesResult {
  const { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current)

  return {
    changed: getObjectValues(current, changedPaths),
    added: getObjectValues(current, addedPaths),
    deleted: getObjectValues(original, deletedPaths),
  }
}

export function diffPaths(original: Input, current: Input): DiffPathsResult {
  const { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current)

  return {
    changed: changedPaths,
    added: addedPaths,
    deleted: deletedPaths,
  }
}

export function revert(
  dest: Input,
  src: Input,
  customizer: (d: unknown, s: unknown) => unknown,
): RecordUnknown | ArrayUnknown {
  const srcPaths = getObjectPaths(src, '', Array.isArray(src))
  return srcPaths.reduce((result, path) => {
    const destValue = get(dest, path)
    const srcValue = get(src, path)
    const value = customizer(destValue, srcValue)
    set(result, path, value)
    return result
  }, {})
}

export function getPaths(obj: Input): string[] {
  return getObjectPaths(obj, '', Array.isArray(obj))
}

export function omitPaths(obj: Input, excludedPaths: string[]): RecordUnknown | ArrayUnknown {
  const includedPaths = getPaths(obj).filter(path => {
    const isIgnored = excludedPaths.some(ignoredPath => {
      if (ignoredPath.startsWith('*.')) {
        return path.endsWith(trimStart(ignoredPath, '*.'))
      }
      if (ignoredPath.endsWith('.*')) {
        return path.startsWith(trimEnd(ignoredPath, '.*'))
      }
      return ignoredPath === path
    })
    return !isIgnored
  })

  return getObjectValues(obj, includedPaths)
}

function _getPaths(original: Input, current: Input): PathsResult {
  const addedAndChanged = getObjectsDiff(current, original)
  const deletedAndChanged = getObjectsDiff(original, current)

  const changedPaths = intersection(addedAndChanged.paths, deletedAndChanged.paths)
  const addedPaths = difference(addedAndChanged.paths, changedPaths)
  const deletedPaths = difference(deletedAndChanged.paths, changedPaths)

  return {
    addedAndChanged,
    deletedAndChanged,
    changedPaths,
    addedPaths,
    deletedPaths,
  }
}
