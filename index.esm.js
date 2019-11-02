(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash')) :
	typeof define === 'function' && define.amd ? define(['lodash'], factory) :
	(global = global || self, global.o2diff = factory(global._));
}(this, function (lodash) { 'use strict';

	lodash = lodash && lodash.hasOwnProperty('default') ? lodash['default'] : lodash;

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var utils = createCommonjsModule(function (module, exports) {

	  exports.getObjectPaths = function (obj) {
	    var curPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	    var isArray = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	    var paths = [];

	    lodash.each(obj, function (val, key) {
	      val = exports.convertSpecial(val);
	      var newPath = isArray ? "".concat(curPath, "[").concat(key, "]") : "".concat(curPath, ".").concat(key);

	      if (exports.isSimplePrimitive(val)) {
	        paths.push(newPath);
	      } else if (lodash.isArray(val)) {
	        paths = paths.concat(exports.getObjectPaths(val, newPath, true));
	      } else {
	        paths = paths.concat(exports.getObjectPaths(val, newPath));
	      }
	    });

	    if (!curPath) {
	      paths = lodash.map(paths, function (path) {
	        return lodash.trimStart(path, '.');
	      });
	    }

	    return paths;
	  }; // TODO: test it


	  exports.getObjectsDiff = function (left, right) {
	    var leftPaths = exports.getObjectPaths(left);
	    return lodash.reduce(leftPaths, function (result, path) {
	      var leftVal = exports.convertSpecial(lodash.get(left, path));
	      var rightVal = exports.convertSpecial(lodash.get(right, path));

	      if (!lodash.isEqual(leftVal, rightVal)) {
	        lodash.set(result.values, path, leftVal);

	        result.paths.push(path);
	      }

	      return result;
	    }, {
	      values: {},
	      paths: []
	    });
	  }; // TODO: test it


	  exports.getObjectValues = function (obj, paths) {
	    var values = lodash.reduce(paths, function (result, path) {
	      var val = exports.convertSpecial(lodash.get(obj, path));

	      lodash.set(result, path, val);

	      return result;
	    }, {});

	    return exports.compact(values);
	  }; // TODO: test it


	  exports.isSimplePrimitive = function (val) {
	    return lodash.isNil(val) || lodash.isBoolean(val) || lodash.isNumber(val) || lodash.isString(val) || lodash.isDate(val) || lodash.isSymbol(val) || lodash.isRegExp(val);
	  };

	  exports.convertSpecial = function (val) {
	    if (val && val.constructor.name === 'ObjectID') {
	      return val.toString();
	    }

	    return val;
	  };

	  exports.compact = function (obj) {
	    obj = exports.convertSpecial(obj);

	    if (exports.isSimplePrimitive(obj)) {
	      return obj;
	    }

	    if (lodash.isArray(obj)) {
	      return lodash.compact(obj);
	    }

	    var result = {};

	    lodash.each(obj, function (objItem, objKey) {
	      objItem = exports.convertSpecial(objItem);

	      if (exports.isSimplePrimitive(objItem)) {
	        result[objKey] = objItem;
	      } else if (lodash.isArray(objItem)) {
	        result[objKey] = lodash.filter(objItem, function (v) {
	          return !lodash.isNil(v);
	        });

	        lodash.each(result[objKey], function (arrItem, arrIndex) {
	          result[objKey][arrIndex] = exports.compact(arrItem);
	        });
	      } else {
	        result[objKey] = exports.compact(objItem);
	      }
	    });

	    return result;
	  }; // TODO: test it


	  exports.getError = function (msg) {
	    var err = new Error(msg);
	    err.type = 'O2DiffError';
	    return err;
	  };
	});
	var utils_1 = utils.getObjectPaths;
	var utils_2 = utils.getObjectsDiff;
	var utils_3 = utils.getObjectValues;
	var utils_4 = utils.isSimplePrimitive;
	var utils_5 = utils.convertSpecial;
	var utils_6 = utils.compact;
	var utils_7 = utils.getError;

	var diff = function diff(original, current) {
	  var _getPaths2 = _getPaths(original, current),
	      addedAndChanged = _getPaths2.addedAndChanged,
	      deletedAndChanged = _getPaths2.deletedAndChanged;

	  return {
	    left: utils.compact(deletedAndChanged.values),
	    right: utils.compact(addedAndChanged.values)
	  };
	};

	var diffValues = function diffValues(original, current) {
	  var _getPaths3 = _getPaths(original, current),
	      changedPaths = _getPaths3.changedPaths,
	      addedPaths = _getPaths3.addedPaths,
	      deletedPaths = _getPaths3.deletedPaths;

	  return {
	    changed: utils.getObjectValues(current, changedPaths),
	    added: utils.getObjectValues(current, addedPaths),
	    deleted: utils.getObjectValues(original, deletedPaths)
	  };
	};

	var diffPaths = function diffPaths(original, current) {
	  var _getPaths4 = _getPaths(original, current),
	      changedPaths = _getPaths4.changedPaths,
	      addedPaths = _getPaths4.addedPaths,
	      deletedPaths = _getPaths4.deletedPaths;

	  return {
	    changed: changedPaths,
	    added: addedPaths,
	    deleted: deletedPaths
	  };
	};

	var revert = function revert(dest, src, customizer) {
	  var srcPaths = utils.getObjectPaths(src);
	  return lodash.reduce(srcPaths, function (result, path) {
	    var destValue = lodash.get(dest, path);

	    var srcValue = lodash.get(src, path);

	    var value = customizer(destValue, srcValue);

	    lodash.set(result, path, value);

	    return result;
	  }, {});
	};

	function _getPaths(original, current) {
	  var addedAndChanged = utils.getObjectsDiff(current, original);
	  var deletedAndChanged = utils.getObjectsDiff(original, current);

	  var changedPaths = lodash.intersection(addedAndChanged.paths, deletedAndChanged.paths);

	  var addedPaths = lodash.difference(addedAndChanged.paths, changedPaths);

	  var deletedPaths = lodash.difference(deletedAndChanged.paths, changedPaths);

	  return {
	    addedAndChanged: addedAndChanged,
	    deletedAndChanged: deletedAndChanged,
	    changedPaths: changedPaths,
	    addedPaths: addedPaths,
	    deletedPaths: deletedPaths
	  };
	}

	var src = {
	  diff: diff,
	  diffValues: diffValues,
	  diffPaths: diffPaths,
	  revert: revert
	};

	var o2diff = src;

	return o2diff;

}));
