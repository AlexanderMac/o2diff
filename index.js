'use strict';

const _ = require('lodash');

const FORMATS = {
  diff: 'diff',
  values: 'values',
  paths: 'paths'
};

// eslint-disable-next-line max-statements
module.exports = (original, current, format = FORMATS.diff) => {
  let changed = _getObjectsDiff(current, original);

  let originalPaths = _getObjectPaths(original);
  let currentPaths = _getObjectPaths(current);
  let changedPaths = _getObjectPaths(changed);
  let addedPaths = _.difference(currentPaths, originalPaths);
  let deletedPaths = _.difference(originalPaths, currentPaths);

  if (format === FORMATS.diff) {
    changedPaths.push(...addedPaths);
    changedPaths.push(...deletedPaths);
    let left = _getObjectValues(original, changedPaths);
    let right = _getObjectValues(current, changedPaths);
    return { left, right };
  }
  if (format === FORMATS.values) {
    let added = _getObjectValues(current, addedPaths);
    let deleted = _getObjectValues(original, deletedPaths);
    return { added, deleted, changed };
  }
  if (format === FORMATS.paths) {
    return { addedPaths, deletedPaths, changedPaths };
  }
  throw _getError('Unsupported format: ' + format);
};

function _getObjectsDiff(left, right) {
  let leftPaths = _getObjectPaths(left);

  return _.reduce(leftPaths, (result, path) => {
    let changedVal = _.get(left, path);
    let originalVal = _.get(right, path);
    if (!_.isEqual(changedVal, originalVal)) {
      _.set(result, path, changedVal);
    }
    return result;
  }, {});
}

function _getObjectPaths(obj, curPath = '', isArray = false) {
  let paths = [];
  _.each(obj, (val, key) => {
    /* TODO: use constructor.name
    if (val instanceof mongoose.Types.ObjectId) {
      val = _safeToString(val);
    }*/
    let newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`;
    if (_isSimplePrim(val)) {
      paths.push(newPath);
    } else if (_.isArray(val)) {
      paths = paths.concat(_getObjectPaths(val, newPath, true));
    } else if (_.isObject(val)) {
      paths = paths.concat(_getObjectPaths(val, newPath));
    }
  });
  if (!curPath) {
    paths = _.map(paths, path => _.trimStart(path, '.'));
  }
  return paths;
}

function _getObjectValues(obj, paths) {
  return _.reduce(paths, (result, path) => {
    _.set(result, path, _.get(obj, path));
    return result;
  }, {});
}

function _isSimplePrim(prim) {
  return _.isBoolean(prim) ||
      _.isNumber(prim) ||
      _.isString(prim) ||
      _.isDate(prim) ||
      _.isSymbol(prim) ||
      _.isRegExp(prim);
}

function _safeToString(val) {
  return _.isNil(val) ? val : val.toString();
}

// TODO: not implemented
function _cleanup(val) {
}

function _getError(msg) {
  let err = new Error(msg);
  err.type = 'O2DiffError';
  return err;
}
