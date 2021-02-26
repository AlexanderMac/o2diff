const _ = require('lodash')

// TODO: test it
exports.getObjectPaths = (obj, curPath = '', isArray = false) => {
  let paths = []
  _.each(obj, (val, key) => {
    val = exports.convertSpecial(val)
    let newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`
    if (exports.isSimplePrimitive(val)) {
      paths.push(newPath)
    } else if (_.isArray(val)) {
      paths = paths.concat(exports.getObjectPaths(val, newPath, true))
    } else {
      paths = paths.concat(exports.getObjectPaths(val, newPath))
    }
  })
  if (!curPath) {
    paths = _.map(paths, path => _.trimStart(path, '.'))
  }
  return paths
}

// TODO: test it
exports.getObjectsDiff = (left, right) => {
  let leftPaths = exports.getObjectPaths(left)

  return _.reduce(leftPaths, (result, path) => {
    let leftVal = exports.convertSpecial(_.get(left, path))
    let rightVal = exports.convertSpecial(_.get(right, path))
    if (!_.isEqual(leftVal, rightVal)) {
      _.set(result.values, path, leftVal)
      result.paths.push(path)
    }
    return result
  }, {
    values: {},
    paths: []
  })
}

// TODO: test it
exports.getObjectValues = (obj, paths) => {
  let values = _.reduce(paths, (result, path) => {
    let val = exports.convertSpecial(_.get(obj, path))
    _.set(result, path, val)
    return result
  }, {})
  return exports.compact(values)
}

// TODO: test it
exports.isSimplePrimitive = (val) => {
  return _.isNil(val) ||
         _.isBoolean(val) ||
         _.isNumber(val) ||
         _.isString(val) ||
         _.isDate(val) ||
         _.isSymbol(val) ||
         _.isRegExp(val)
}

exports.convertSpecial = (val) => {
  if (val && val.constructor.name === 'ObjectID') {
    return val.toString()
  }
  return val
}

exports.compact = (obj) => {
  obj = exports.convertSpecial(obj)
  if (exports.isSimplePrimitive(obj)) {
    return obj
  }
  if (_.isArray(obj)) {
    return _.compact(obj)
  }

  let result = {}
  _.each(obj, (objItem, objKey) => {
    objItem = exports.convertSpecial(objItem)
    if (exports.isSimplePrimitive(objItem)) {
      result[objKey] = objItem
    } else if (_.isArray(objItem)) {
      result[objKey] = _.filter(objItem, v => !_.isNil(v))
      _.each(result[objKey], (arrItem, arrIndex) => {
        result[objKey][arrIndex] = exports.compact(arrItem)
      })
    } else {
      result[objKey] = exports.compact(objItem)
    }
  })
  return result
}

// TODO: test it
exports.getError = (msg) => {
  let err = new Error(msg)
  err.type = 'O2DiffError'
  return err
}
