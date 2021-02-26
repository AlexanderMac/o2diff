(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash')) :
	typeof define === 'function' && define.amd ? define(['lodash'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.httpZ = factory(global._));
}(this, (function (_) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var ___default = /*#__PURE__*/_interopDefaultLegacy(_);

	function createCommonjsModule(fn) {
	  var module = { exports: {} };
		return fn(module, module.exports), module.exports;
	}

	var utils = createCommonjsModule(function (module, exports) {
	// TODO: test it
	exports.getObjectPaths = (obj, curPath = '', isArray = false) => {
	  let paths = [];
	  ___default['default'].each(obj, (val, key) => {
	    val = exports.convertSpecial(val);
	    let newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`;
	    if (exports.isSimplePrimitive(val)) {
	      paths.push(newPath);
	    } else if (___default['default'].isArray(val)) {
	      paths = paths.concat(exports.getObjectPaths(val, newPath, true));
	    } else {
	      paths = paths.concat(exports.getObjectPaths(val, newPath));
	    }
	  });
	  if (!curPath) {
	    paths = ___default['default'].map(paths, path => ___default['default'].trimStart(path, '.'));
	  }
	  return paths
	};

	// TODO: test it
	exports.getObjectsDiff = (left, right) => {
	  let leftPaths = exports.getObjectPaths(left);

	  return ___default['default'].reduce(leftPaths, (result, path) => {
	    let leftVal = exports.convertSpecial(___default['default'].get(left, path));
	    let rightVal = exports.convertSpecial(___default['default'].get(right, path));
	    if (!___default['default'].isEqual(leftVal, rightVal)) {
	      ___default['default'].set(result.values, path, leftVal);
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
	  let values = ___default['default'].reduce(paths, (result, path) => {
	    let val = exports.convertSpecial(___default['default'].get(obj, path));
	    ___default['default'].set(result, path, val);
	    return result
	  }, {});
	  return exports.compact(values)
	};

	// TODO: test it
	exports.isSimplePrimitive = (val) => {
	  return ___default['default'].isNil(val) ||
	         ___default['default'].isBoolean(val) ||
	         ___default['default'].isNumber(val) ||
	         ___default['default'].isString(val) ||
	         ___default['default'].isDate(val) ||
	         ___default['default'].isSymbol(val) ||
	         ___default['default'].isRegExp(val)
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
	  if (___default['default'].isArray(obj)) {
	    return ___default['default'].compact(obj)
	  }

	  let result = {};
	  ___default['default'].each(obj, (objItem, objKey) => {
	    objItem = exports.convertSpecial(objItem);
	    if (exports.isSimplePrimitive(objItem)) {
	      result[objKey] = objItem;
	    } else if (___default['default'].isArray(objItem)) {
	      result[objKey] = ___default['default'].filter(objItem, v => !___default['default'].isNil(v));
	      ___default['default'].each(result[objKey], (arrItem, arrIndex) => {
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
	});

	var src = createCommonjsModule(function (module, exports) {
	exports.diff = (original, current) => {
	  let { addedAndChanged, deletedAndChanged } = _getPaths(original, current);

	  return {
	    left: utils.compact(deletedAndChanged.values),
	    right: utils.compact(addedAndChanged.values)
	  }
	};

	exports.diffValues = (original, current) => {
	  let { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);

	  return {
	    changed: utils.getObjectValues(current, changedPaths),
	    added: utils.getObjectValues(current, addedPaths),
	    deleted: utils.getObjectValues(original, deletedPaths)
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
	  let srcPaths = utils.getObjectPaths(src, '', ___default['default'].isArray(src));
	  return ___default['default'].reduce(srcPaths, (result, path) => {
	    let destValue = ___default['default'].get(dest, path);
	    let srcValue = ___default['default'].get(src, path);
	    let value = customizer(destValue, srcValue);
	    ___default['default'].set(result, path, value);
	    return result
	  }, {})
	};

	exports.getPaths = (obj) => {
	  return utils.getObjectPaths(obj, '', ___default['default'].isArray(obj))
	};

	exports.omitPaths = (obj, excludedPaths) => {
	  let includedPaths = exports.getPaths(obj);
	  includedPaths = ___default['default'].filter(includedPaths, path => {
	    let isIgnored = ___default['default'].some(excludedPaths, ignoredPath => {
	      if (___default['default'].startsWith(ignoredPath, '*.')) {
	        return ___default['default'].endsWith(path, ___default['default'].trimStart(ignoredPath, '*.'))
	      }
	      if (___default['default'].endsWith(ignoredPath, '.*')) {
	        return ___default['default'].startsWith(path, ___default['default'].trimEnd(ignoredPath, '.*'))
	      }
	      return ignoredPath === path
	    });
	    return !isIgnored
	  });

	  return utils.getObjectValues(obj, includedPaths)
	};

	function _getPaths(original, current) {
	  let addedAndChanged = utils.getObjectsDiff(current, original);
	  let deletedAndChanged = utils.getObjectsDiff(original, current);

	  let changedPaths = ___default['default'].intersection(addedAndChanged.paths, deletedAndChanged.paths);
	  let addedPaths = ___default['default'].difference(addedAndChanged.paths, changedPaths);
	  let deletedPaths = ___default['default'].difference(deletedAndChanged.paths, changedPaths);

	  return {
	    addedAndChanged,
	    deletedAndChanged,
	    changedPaths,
	    addedPaths,
	    deletedPaths
	  }
	}
	});

	var o2diff = src;

	return o2diff;

})));
