'use strict';

const _ = require('lodash');
const utils = require('./utils');

exports.diff = (original, current) => {
  let { addedAndChanged, deletedAndChanged } = _getPaths(original, current);

  return {
    left: utils.compact(deletedAndChanged.values),
    right: utils.compact(addedAndChanged.values)
  };
};

exports.diffValues = (original, current) => {
  let { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);

  return {
    changed: utils.getObjectValues(current, changedPaths),
    added: utils.getObjectValues(current, addedPaths),
    deleted: utils.getObjectValues(original, deletedPaths)
  };
};

exports.diffPaths = (original, current) => {
  let { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);

  return {
    changed: changedPaths,
    added: addedPaths,
    deleted: deletedPaths
  };
};

exports.revert = (dest, src, customizer) => {
  let srcPaths = utils.getObjectPaths(src);
  return _.reduce(srcPaths, (result, path) => {
    let destValue = _.get(dest, path);
    let srcValue = _.get(src, path);
    let value = customizer(destValue, srcValue);
    _.set(result, path, value);
    return result;
  }, {});
};

exports.getPaths = (obj) => {
  return utils.getObjectPaths(obj, '', _.isArray(obj));
};

function _getPaths(original, current) {
  let addedAndChanged = utils.getObjectsDiff(current, original);
  let deletedAndChanged = utils.getObjectsDiff(original, current);

  let changedPaths = _.intersection(addedAndChanged.paths, deletedAndChanged.paths);
  let addedPaths = _.difference(addedAndChanged.paths, changedPaths);
  let deletedPaths = _.difference(deletedAndChanged.paths, changedPaths);

  return {
    addedAndChanged,
    deletedAndChanged,
    changedPaths,
    addedPaths,
    deletedPaths
  };
}
