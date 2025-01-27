import * as _ from 'lodash'

import { compact, getObjectPaths, getObjectsDiff, getObjectValues, Input } from './utils'

export type DiffResult = {
  left: Record<string, any>
  right: Record<string, any>
}

export type DiffValuesResult = {
  changed: Record<string, any>
  added: Record<string, any>
  deleted: Record<string, any>
}

export type DiffPathsResult = {
  changed: string[]
  added: string[]
  deleted: string[]
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

export function revert(dest: Input, src: Input, customizer: (d: any, s: any) => any) {
  const srcPaths = getObjectPaths(src, '', _.isArray(src))
  return srcPaths.reduce((result, path) => {
    const destValue = _.get(dest, path)
    const srcValue = _.get(src, path)
    const value = customizer(destValue, srcValue)
    _.set(result, path, value)
    return result
  }, {})
}

export function getPaths(obj: Input): string[] {
  return getObjectPaths(obj, '', _.isArray(obj))
}

export function omitPaths(obj: Input, excludedPaths: string[]) {
  const includedPaths = getPaths(obj).filter(path => {
    const isIgnored = excludedPaths.some(ignoredPath => {
      if (_.startsWith(ignoredPath, '*.')) {
        return _.endsWith(path, _.trimStart(ignoredPath, '*.'))
      }
      if (_.endsWith(ignoredPath, '.*')) {
        return _.startsWith(path, _.trimEnd(ignoredPath, '.*'))
      }
      return ignoredPath === path
    })
    return !isIgnored
  })

  return getObjectValues(obj, includedPaths)
}

function _getPaths(original: Input, current: Input) {
  const addedAndChanged = getObjectsDiff(current, original)
  const deletedAndChanged = getObjectsDiff(original, current)

  const changedPaths = _.intersection(addedAndChanged.paths, deletedAndChanged.paths)
  const addedPaths = _.difference(addedAndChanged.paths, changedPaths)
  const deletedPaths = _.difference(deletedAndChanged.paths, changedPaths)

  return {
    addedAndChanged,
    deletedAndChanged,
    changedPaths,
    addedPaths,
    deletedPaths,
  }
}
