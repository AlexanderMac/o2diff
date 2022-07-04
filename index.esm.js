(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash')) :
	typeof define === 'function' && define.amd ? define(['lodash'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.httpZ = factory(global._));
})(this, (function (require$$0) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var o2diff = {exports: {}};

	var src = {};

	var utils = {};

	(function (exports) {
		const _ = require$$0__default["default"];

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
		  return paths
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
		    return result
		  }, {
		    values: {},
		    paths: []
		  })
		};

		// TODO: test it
		exports.getObjectValues = (obj, paths) => {
		  let values = _.reduce(paths, (result, path) => {
		    let val = exports.convertSpecial(_.get(obj, path));
		    _.set(result, path, val);
		    return result
		  }, {});
		  return exports.compact(values)
		};

		// TODO: test it
		exports.isSimplePrimitive = (val) => {
		  return _.isNil(val) ||
		         _.isBoolean(val) ||
		         _.isNumber(val) ||
		         _.isString(val) ||
		         _.isDate(val) ||
		         _.isSymbol(val) ||
		         _.isRegExp(val)
		};

		exports.convertSpecial = (val) => {
		  if (val && val.constructor.name === 'ObjectID') {
		    return val.toString()
		  }
		  return val
		};

		exports.compact = (obj) => {
		  obj = exports.convertSpecial(obj);
		  if (exports.isSimplePrimitive(obj)) {
		    return obj
		  }
		  if (_.isArray(obj)) {
		    return _.compact(obj)
		  }

		  let result = {};
		  _.each(obj, (objItem, objKey) => {
		    objItem = exports.convertSpecial(objItem);
		    if (exports.isSimplePrimitive(objItem)) {
		      result[objKey] = objItem;
		    } else if (_.isArray(objItem)) {
		      result[objKey] = _.filter(objItem, v => !_.isNil(v));
		      _.each(result[objKey], (arrItem, arrIndex) => {
		        result[objKey][arrIndex] = exports.compact(arrItem);
		      });
		    } else {
		      result[objKey] = exports.compact(objItem);
		    }
		  });
		  return result
		};

		// TODO: test it
		exports.getError = (msg) => {
		  let err = new Error(msg);
		  err.type = 'O2DiffError';
		  return err
		};
	} (utils));

	(function (exports) {
		const _ = require$$0__default["default"];
		const utils$1 = utils;

		exports.diff = (original, current) => {
		  let { addedAndChanged, deletedAndChanged } = _getPaths(original, current);

		  return {
		    left: utils$1.compact(deletedAndChanged.values),
		    right: utils$1.compact(addedAndChanged.values)
		  }
		};

		exports.diffValues = (original, current) => {
		  let { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);

		  return {
		    changed: utils$1.getObjectValues(current, changedPaths),
		    added: utils$1.getObjectValues(current, addedPaths),
		    deleted: utils$1.getObjectValues(original, deletedPaths)
		  }
		};

		exports.diffPaths = (original, current) => {
		  let { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);

		  return {
		    changed: changedPaths,
		    added: addedPaths,
		    deleted: deletedPaths
		  }
		};

		exports.revert = (dest, src, customizer) => {
		  let srcPaths = utils$1.getObjectPaths(src, '', _.isArray(src));
		  return _.reduce(srcPaths, (result, path) => {
		    let destValue = _.get(dest, path);
		    let srcValue = _.get(src, path);
		    let value = customizer(destValue, srcValue);
		    _.set(result, path, value);
		    return result
		  }, {})
		};

		exports.getPaths = (obj) => {
		  return utils$1.getObjectPaths(obj, '', _.isArray(obj))
		};

		exports.omitPaths = (obj, excludedPaths) => {
		  let includedPaths = exports.getPaths(obj);
		  includedPaths = _.filter(includedPaths, path => {
		    let isIgnored = _.some(excludedPaths, ignoredPath => {
		      if (_.startsWith(ignoredPath, '*.')) {
		        return _.endsWith(path, _.trimStart(ignoredPath, '*.'))
		      }
		      if (_.endsWith(ignoredPath, '.*')) {
		        return _.startsWith(path, _.trimEnd(ignoredPath, '.*'))
		      }
		      return ignoredPath === path
		    });
		    return !isIgnored
		  });

		  return utils$1.getObjectValues(obj, includedPaths)
		};

		function _getPaths(original, current) {
		  let addedAndChanged = utils$1.getObjectsDiff(current, original);
		  let deletedAndChanged = utils$1.getObjectsDiff(original, current);

		  let changedPaths = _.intersection(addedAndChanged.paths, deletedAndChanged.paths);
		  let addedPaths = _.difference(addedAndChanged.paths, changedPaths);
		  let deletedPaths = _.difference(deletedAndChanged.paths, changedPaths);

		  return {
		    addedAndChanged,
		    deletedAndChanged,
		    changedPaths,
		    addedPaths,
		    deletedPaths
		  }
		}
	} (src));

	(function (module) {
		module.exports = src;
	} (o2diff));

	var index = /*@__PURE__*/getDefaultExportFromCjs(o2diff.exports);

	return index;

}));
