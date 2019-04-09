'use strict';

const _ = require('lodash');

const FORMATS = {
  diff: 'diff',
  values: 'values',
  paths: 'paths'
};

// eslint-disable-next-line max-statements
module.exports = (original, current, format) => {
  let addedAndChanged = _getObjectsDiff(current, original);
  let deletedAndChanged = _getObjectsDiff(original, current);

  let changedPaths = _.intersection(addedAndChanged.paths, deletedAndChanged.paths);
  let addedPaths = _.difference(addedAndChanged.paths, changedPaths);
  let deletedPaths = _.difference(deletedAndChanged.paths, changedPaths);

  if (format === FORMATS.diff) {
    let left = _compact(deletedAndChanged.values);
    let right = _compact(addedAndChanged.values);
    return { left, right };
  }
  if (format === FORMATS.values) {
    let changed = _getObjectValues(current, changedPaths);
    let added = _getObjectValues(current, addedPaths);
    let deleted = _getObjectValues(original, deletedPaths);
    return { changed, added, deleted };
  }
  if (format === FORMATS.paths) {
    return { addedPaths, deletedPaths, changedPaths };
  }
  throw _getError('Unsupported format: ' + format);
};

function _getObjectPaths(obj, curPath = '', isArray = false) {
  let paths = [];
  _.each(obj, (val, key) => {
    val = _convertSpecial(val);
    let newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`;
    if (_isSimplePrimitive(val)) {
      paths.push(newPath);
    } else if (_.isArray(val)) {
      paths = paths.concat(_getObjectPaths(val, newPath, true));
    } else {
      paths = paths.concat(_getObjectPaths(val, newPath));
    }
  });
  if (!curPath) {
    paths = _.map(paths, path => _.trimStart(path, '.'));
  }
  return paths;
}

function _getObjectsDiff(left, right) {
  let leftPaths = _getObjectPaths(left);

  return _.reduce(leftPaths, (result, path) => {
    let leftVal = _convertSpecial(_.get(left, path));
    let rightVal = _convertSpecial(_.get(right, path));
    if (!_.isEqual(leftVal, rightVal)) {
      _.set(result.values, path, leftVal);
      result.paths.push(path);
    }
    return result;
  }, {
    values: {},
    paths: []
  });
}

function _getObjectValues(obj, paths) {
  let values = _.reduce(paths, (result, path) => {
    let val = _convertSpecial(_.get(obj, path));
    _.set(result, path, val);
    return result;
  }, {});
  return _compact(values);
}

function _isSimplePrimitive(prim) {
  return _.isBoolean(prim) ||
      _.isNumber(prim) ||
      _.isString(prim) ||
      _.isDate(prim) ||
      _.isSymbol(prim) ||
      _.isRegExp(prim);
}

function _convertSpecial(val) {
  if (val && val.constructor.name === 'ObjectID') {
    return val.toString();
  }
  return val;
}

// TODO: not implemented
function _compact(obj) {
  return obj;
/*
  return _.reduce(obj, val => {
    if (_isSimplePrimitive(val)) {
      return val;
    }
    if (_.isArray(val)) {
      let todo = _compact(val);
      return _.compact(todo);
    }
    return _compact(val);
  });
*/
}

function _getError(msg) {
  let err = new Error(msg);
  err.type = 'O2DiffError';
  return err;
}
