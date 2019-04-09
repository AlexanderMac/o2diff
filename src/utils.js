'use strict';

const _ = require('lodash');

// TODO: test it
exports.getObjectPaths = (obj, curPath = '', isArray = false) => {
  let paths = [];
  _.each(obj, (val, key) => {
    val = exports.convertSpecial(val);
    let newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`;
    if (exports.isSimplePrimitive(val)) {
      paths.push(newPath);
    } else if (_.isArray(val)) {
      paths = paths.concat(exports.getObjectPaths(val, newPath, true));
    } else {
      paths = paths.concat(exports.getObjectPaths(val, newPath));
    }
  });
  if (!curPath) {
    paths = _.map(paths, path => _.trimStart(path, '.'));
  }
  return paths;
};

// TODO: test it
exports.getObjectsDiff = (left, right) => {
  let leftPaths = exports.getObjectPaths(left);

  return _.reduce(leftPaths, (result, path) => {
    let leftVal = exports.convertSpecial(_.get(left, path));
    let rightVal = exports.convertSpecial(_.get(right, path));
    if (!_.isEqual(leftVal, rightVal)) {
      _.set(result.values, path, leftVal);
      result.paths.push(path);
    }
    return result;
  }, {
    values: {},
    paths: []
  });
};

// TODO: test it
exports.getObjectValues = (obj, paths) => {
  let values = _.reduce(paths, (result, path) => {
    let val = exports.convertSpecial(_.get(obj, path));
    _.set(result, path, val);
    return result;
  }, {});
  return exports.compact(values);
};

// TODO: test it
exports.isSimplePrimitive = (prim) => {
  return _.isBoolean(prim) ||
      _.isNumber(prim) ||
      _.isString(prim) ||
      _.isDate(prim) ||
      _.isSymbol(prim) ||
      _.isRegExp(prim);
};

// TODO: test it
exports.convertSpecial = (val) => {
  if (val && val.constructor.name === 'ObjectID') {
    return val.toString();
  }
  return val;
};

// TODO: implement it
// TODO: test it
exports.compact = (obj) => {
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
};

// TODO: test it
exports.getError = (msg) => {
  let err = new Error(msg);
  err.type = 'O2DiffError';
  return err;
};
