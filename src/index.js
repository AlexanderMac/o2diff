'use strict';

const _           = require('lodash');
const { FORMATS } = require('./consts');
const utils       = require('./utils');

module.exports = (original, current, format) => {
  let addedAndChanged = utils.getObjectsDiff(current, original);
  let deletedAndChanged = utils.getObjectsDiff(original, current);

  let changedPaths = _.intersection(addedAndChanged.paths, deletedAndChanged.paths);
  let addedPaths = _.difference(addedAndChanged.paths, changedPaths);
  let deletedPaths = _.difference(deletedAndChanged.paths, changedPaths);

  if (format === FORMATS.diff) {
    return _getDiff(addedAndChanged, deletedAndChanged);
  }
  if (format === FORMATS.values) {
    return _getValues(original, current, changedPaths, addedPaths, deletedPaths);
  }
  if (format === FORMATS.paths) {
    return _getPaths(changedPaths, addedPaths, deletedPaths);
  }
  throw utils.getError('Unsupported format: ' + format);
};

function _getDiff(addedAndChanged, deletedAndChanged) {
  let left = utils.compact(deletedAndChanged.values);
  let right = utils.compact(addedAndChanged.values);
  return { left, right };
}

// eslint-disable-next-line max-params
function _getValues(original, current, changedPaths, addedPaths, deletedPaths) {
  let changed = utils.getObjectValues(current, changedPaths);
  let added = utils.getObjectValues(current, addedPaths);
  let deleted = utils.getObjectValues(original, deletedPaths);
  return { changed, added, deleted };
}

function _getPaths(changedPaths, addedPaths, deletedPaths) {
  return { changedPaths, addedPaths, deletedPaths };
}
