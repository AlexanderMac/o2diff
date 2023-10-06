(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
	typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.o2diff = {}, global._));
})(this, (function (exports, require$$0) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var build = {};

	var utils = {};

	var __createBinding$1 = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault$1 = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar$1 = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$1(result, mod, k);
	    __setModuleDefault$1(result, mod);
	    return result;
	};
	Object.defineProperty(utils, "__esModule", { value: true });
	utils.compact = utils.convertSpecial = utils.isSimplePrimitive = utils.getObjectValues = utils.getObjectsDiff = utils.getObjectPaths = void 0;
	const _$1 = __importStar$1(require$$0);
	function getObjectPaths(obj, curPath = '', isArray = false) {
	    let paths = [];
	    _$1.each(obj, (val, key) => {
	        val = convertSpecial(val);
	        const newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`;
	        if (isSimplePrimitive(val)) {
	            paths.push(newPath);
	        }
	        else if (_$1.isArray(val)) {
	            paths = paths.concat(getObjectPaths(val, newPath, true));
	        }
	        else {
	            paths = paths.concat(getObjectPaths(val, newPath));
	        }
	    });
	    if (!curPath) {
	        paths = paths.map((path) => _$1.trimStart(path, '.'));
	    }
	    return paths;
	}
	utils.getObjectPaths = getObjectPaths;
	function getObjectsDiff(left, right) {
	    const leftPaths = getObjectPaths(left);
	    const reducer = {
	        values: {},
	        paths: [],
	    };
	    return leftPaths.reduce((result, path) => {
	        const leftVal = convertSpecial(_$1.get(left, path));
	        const rightVal = convertSpecial(_$1.get(right, path));
	        if (!_$1.isEqual(leftVal, rightVal)) {
	            _$1.set(result.values, path, leftVal);
	            result.paths.push(path);
	        }
	        return result;
	    }, reducer);
	}
	utils.getObjectsDiff = getObjectsDiff;
	function getObjectValues(obj, paths) {
	    const values = paths.reduce((result, path) => {
	        const val = convertSpecial(_$1.get(obj, path));
	        _$1.set(result, path, val);
	        return result;
	    }, {});
	    return compact(values);
	}
	utils.getObjectValues = getObjectValues;
	function isSimplePrimitive(val) {
	    return (_$1.isNil(val) ||
	        _$1.isBoolean(val) ||
	        _$1.isNumber(val) ||
	        _$1.isString(val) ||
	        _$1.isDate(val) ||
	        _$1.isSymbol(val) ||
	        _$1.isRegExp(val));
	}
	utils.isSimplePrimitive = isSimplePrimitive;
	function convertSpecial(val) {
	    if (val && val.constructor.name === 'ObjectID') {
	        return val.toString();
	    }
	    return val;
	}
	utils.convertSpecial = convertSpecial;
	function compact(obj) {
	    obj = convertSpecial(obj);
	    if (isSimplePrimitive(obj)) {
	        return obj;
	    }
	    if (_$1.isArray(obj)) {
	        return _$1.compact(obj);
	    }
	    const result = {};
	    _$1.each(obj, (objItem, objKey) => {
	        objItem = convertSpecial(objItem);
	        if (isSimplePrimitive(objItem)) {
	            result[objKey] = objItem;
	        }
	        else if (_$1.isArray(objItem)) {
	            result[objKey] = _$1.filter(objItem, (v) => !_$1.isNil(v));
	            _$1.each(result[objKey], (arrItem, arrIndex) => {
	                result[objKey][arrIndex] = compact(arrItem);
	            });
	        }
	        else {
	            result[objKey] = compact(objItem);
	        }
	    });
	    return result;
	}
	utils.compact = compact;

	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(build, "__esModule", { value: true });
	exports.omitPaths = build.omitPaths = exports.getPaths = build.getPaths = exports.revert = build.revert = exports.diffPaths = build.diffPaths = exports.diffValues = build.diffValues = exports.diff = build.diff = void 0;
	const _ = __importStar(require$$0);
	const utils_1 = utils;
	function diff(original, current) {
	    const { addedAndChanged, deletedAndChanged } = _getPaths(original, current);
	    return {
	        left: (0, utils_1.compact)(deletedAndChanged.values),
	        right: (0, utils_1.compact)(addedAndChanged.values),
	    };
	}
	exports.diff = build.diff = diff;
	function diffValues(original, current) {
	    const { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);
	    return {
	        changed: (0, utils_1.getObjectValues)(current, changedPaths),
	        added: (0, utils_1.getObjectValues)(current, addedPaths),
	        deleted: (0, utils_1.getObjectValues)(original, deletedPaths),
	    };
	}
	exports.diffValues = build.diffValues = diffValues;
	function diffPaths(original, current) {
	    const { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);
	    return {
	        changed: changedPaths,
	        added: addedPaths,
	        deleted: deletedPaths,
	    };
	}
	exports.diffPaths = build.diffPaths = diffPaths;
	function revert(dest, src, customizer) {
	    const srcPaths = (0, utils_1.getObjectPaths)(src, '', _.isArray(src));
	    return srcPaths.reduce((result, path) => {
	        const destValue = _.get(dest, path);
	        const srcValue = _.get(src, path);
	        const value = customizer(destValue, srcValue);
	        _.set(result, path, value);
	        return result;
	    }, {});
	}
	exports.revert = build.revert = revert;
	function getPaths(obj) {
	    return (0, utils_1.getObjectPaths)(obj, '', _.isArray(obj));
	}
	exports.getPaths = build.getPaths = getPaths;
	function omitPaths(obj, excludedPaths) {
	    const includedPaths = getPaths(obj).filter((path) => {
	        const isIgnored = excludedPaths.some((ignoredPath) => {
	            if (_.startsWith(ignoredPath, '*.')) {
	                return _.endsWith(path, _.trimStart(ignoredPath, '*.'));
	            }
	            if (_.endsWith(ignoredPath, '.*')) {
	                return _.startsWith(path, _.trimEnd(ignoredPath, '.*'));
	            }
	            return ignoredPath === path;
	        });
	        return !isIgnored;
	    });
	    return (0, utils_1.getObjectValues)(obj, includedPaths);
	}
	exports.omitPaths = build.omitPaths = omitPaths;
	function _getPaths(original, current) {
	    const addedAndChanged = (0, utils_1.getObjectsDiff)(current, original);
	    const deletedAndChanged = (0, utils_1.getObjectsDiff)(original, current);
	    const changedPaths = _.intersection(addedAndChanged.paths, deletedAndChanged.paths);
	    const addedPaths = _.difference(addedAndChanged.paths, changedPaths);
	    const deletedPaths = _.difference(deletedAndChanged.paths, changedPaths);
	    return {
	        addedAndChanged,
	        deletedAndChanged,
	        changedPaths,
	        addedPaths,
	        deletedPaths,
	    };
	}

	exports.default = build;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
