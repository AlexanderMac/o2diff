'use strict';

const _ = require('lodash');

const FORMATS = {
  diff: 'diff',
  values: 'values',
  paths: 'paths'
};

// eslint-disable-next-line max-statements
module.exports = (original, current, format = FORMATS.diff) => {
  let addedAndChanged = _getObjectsDiff(current, original);
  let deletedAndChanged = _getObjectsDiff(original, current);

  let changedPaths = _.intersection(addedAndChanged.paths, deletedAndChanged.paths);
  let addedPaths = _.difference(addedAndChanged.paths, changedPaths);
  let deletedPaths = _.difference(deletedAndChanged.paths, changedPaths);

  if (format === FORMATS.diff) {
    let left = deletedAndChanged.values;
    let right = addedAndChanged.values;
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

function _getObjectsDiff(left, right) {
  let leftPaths = _getObjectPaths(left);

  return _.reduce(leftPaths, (result, path) => {
    let leftVal = _.get(left, path);
    let rightVal = _.get(right, path);
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
