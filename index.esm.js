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



	// TODO: test it
	exports.getObjectPaths = (obj, curPath = '', isArray = false) => {
	  let paths = [];
	  lodash.each(obj, (val, key) => {
	    val = exports.convertSpecial(val);
	    let newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`;
	    if (exports.isSimplePrimitive(val)) {
	      paths.push(newPath);
	    } else if (lodash.isArray(val)) {
	      paths = paths.concat(exports.getObjectPaths(val, newPath, true));
	    } else {
	      paths = paths.concat(exports.getObjectPaths(val, newPath));
	    }
	  });
	  if (!curPath) {
	    paths = lodash.map(paths, path => lodash.trimStart(path, '.'));
	  }
	  return paths;
	};

	// TODO: test it
	exports.getObjectsDiff = (left, right) => {
	  let leftPaths = exports.getObjectPaths(left);

	  return lodash.reduce(leftPaths, (result, path) => {
	    let leftVal = exports.convertSpecial(lodash.get(left, path));
	    let rightVal = exports.convertSpecial(lodash.get(right, path));
	    if (!lodash.isEqual(leftVal, rightVal)) {
	      lodash.set(result.values, path, leftVal);
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
	  let values = lodash.reduce(paths, (result, path) => {
	    let val = exports.convertSpecial(lodash.get(obj, path));
	    lodash.set(result, path, val);
	    return result;
	  }, {});
	  return exports.compact(values);
	};

	// TODO: test it
	exports.isSimplePrimitive = (val) => {
	  return lodash.isNil(val) ||
	         lodash.isBoolean(val) ||
	         lodash.isNumber(val) ||
	         lodash.isString(val) ||
	         lodash.isDate(val) ||
	         lodash.isSymbol(val) ||
	         lodash.isRegExp(val);
	};

	exports.convertSpecial = (val) => {
	  if (val && val.constructor.name === 'ObjectID') {
	    return val.toString();
	  }
	  return val;
	};

	exports.compact = (obj) => {
	  obj = exports.convertSpecial(obj);
	  if (exports.isSimplePrimitive(obj)) {
	    return obj;
	  }
	  if (lodash.isArray(obj)) {
	    return lodash.compact(obj);
	  }

	  let result = {};
	  lodash.each(obj, (objItem, objKey) => {
	    objItem = exports.convertSpecial(objItem);
	    if (exports.isSimplePrimitive(objItem)) {
	      result[objKey] = objItem;
	    } else if (lodash.isArray(objItem)) {
	      result[objKey] = lodash.filter(objItem, v => !lodash.isNil(v));
	      lodash.each(result[objKey], (arrItem, arrIndex) => {
	        result[objKey][arrIndex] = exports.compact(arrItem);
	      });
	    } else {
	      result[objKey] = exports.compact(objItem);
	    }
	  });
	  return result;
	};

	// TODO: test it
	exports.getError = (msg) => {
	  let err = new Error(msg);
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

	var diff = (original, current) => {
	  let { addedAndChanged, deletedAndChanged } = _getPaths(original, current);

	  return {
	    left: utils.compact(deletedAndChanged.values),
	    right: utils.compact(addedAndChanged.values)
	  };
	};

	var diffValues = (original, current) => {
	  let { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);

	  return {
	    changed: utils.getObjectValues(current, changedPaths),
	    added: utils.getObjectValues(current, addedPaths),
	    deleted: utils.getObjectValues(original, deletedPaths)
	  };
	};

	var diffPaths = (original, current) => {
	  let { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);

	  return {
	    changed: changedPaths,
	    added: addedPaths,
	    deleted: deletedPaths
	  };
	};

	var revert = (dest, src, customizer) => {
	  let srcPaths = utils.getObjectPaths(src);
	  return lodash.reduce(srcPaths, (result, path) => {
	    let destValue = lodash.get(dest, path);
	    let srcValue = lodash.get(src, path);
	    let value = customizer(destValue, srcValue);
	    lodash.set(result, path, value);
	    return result;
	  }, {});
	};

	function _getPaths(original, current) {
	  let addedAndChanged = utils.getObjectsDiff(current, original);
	  let deletedAndChanged = utils.getObjectsDiff(original, current);

	  let changedPaths = lodash.intersection(addedAndChanged.paths, deletedAndChanged.paths);
	  let addedPaths = lodash.difference(addedAndChanged.paths, changedPaths);
	  let deletedPaths = lodash.difference(deletedAndChanged.paths, changedPaths);

	  return {
	    addedAndChanged,
	    deletedAndChanged,
	    changedPaths,
	    addedPaths,
	    deletedPaths
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
