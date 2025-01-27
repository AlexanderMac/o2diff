import * as _ from 'lodash'

export type Input = Record<string, any> | Array<any> | null

// TODO: test it
export function getObjectPaths(obj: Input, curPath = '', isArray = false) {
  let paths: string[] = []
  _.each(obj, (val, key) => {
    val = convertSpecial(val)
    const newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`
    if (isSimplePrimitive(val)) {
      paths.push(newPath)
    } else if (_.isArray(val)) {
      paths = paths.concat(getObjectPaths(val, newPath, true))
    } else {
      paths = paths.concat(getObjectPaths(val as Input, newPath))
    }
  })

  if (!curPath) {
    paths = paths.map(path => _.trimStart(path, '.'))
  }
  return paths
}

// TODO: test it
export function getObjectsDiff(left: Input, right: Input) {
  const leftPaths = getObjectPaths(left)

  const reducer: {
    values: Record<string, any>
    paths: string[]
  } = {
    values: {},
    paths: [],
  }
  return leftPaths.reduce((result, path) => {
    const leftVal = convertSpecial(_.get(left, path))
    const rightVal = convertSpecial(_.get(right, path))
    if (!_.isEqual(leftVal, rightVal)) {
      _.set(result.values, path, leftVal)
      result.paths.push(path)
    }
    return result
  }, reducer)
}

// TODO: test it
export function getObjectValues(obj: Input, paths: string[]) {
  const values = paths.reduce((result, path) => {
    const val = convertSpecial(_.get(obj, path))
    _.set(result, path, val)
    return result
  }, {})
  return compact(values)
}

export function isSimplePrimitive(val: any) {
  return (
    _.isNil(val) ||
    _.isBoolean(val) ||
    _.isNumber(val) ||
    _.isString(val) ||
    _.isDate(val) ||
    _.isSymbol(val) ||
    _.isRegExp(val)
  )
}

export function convertSpecial(val: any) {
  if (val && val.constructor.name === 'ObjectID') {
    return val.toString()
  }
  return val
}

export function compact(obj: any): any {
  obj = convertSpecial(obj)
  if (isSimplePrimitive(obj)) {
    return obj
  }
  if (_.isArray(obj)) {
    return _.compact(obj)
  }

  const result: Record<string, any> = {}
  _.each(obj, (objItem, objKey) => {
    objItem = convertSpecial(objItem)
    if (isSimplePrimitive(objItem)) {
      result[objKey] = objItem
    } else if (_.isArray(objItem)) {
      result[objKey] = _.filter(objItem, v => !_.isNil(v))
      _.each(result[objKey], (arrItem, arrIndex) => {
        result[objKey][arrIndex] = compact(arrItem)
      })
    } else {
      result[objKey] = compact(objItem)
    }
  })
  return result
}
