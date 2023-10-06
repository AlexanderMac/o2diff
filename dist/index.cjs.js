'use strict';

var _ = require('lodash');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var ___namespace = /*#__PURE__*/_interopNamespaceDefault(_);

function getObjectPaths(obj, curPath = '', isArray = false) {
    let paths = [];
    ___namespace.each(obj, (val, key) => {
        val = convertSpecial(val);
        const newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`;
        if (isSimplePrimitive(val)) {
            paths.push(newPath);
        }
        else if (___namespace.isArray(val)) {
            paths = paths.concat(getObjectPaths(val, newPath, true));
        }
        else {
            paths = paths.concat(getObjectPaths(val, newPath));
        }
    });
    if (!curPath) {
        paths = paths.map((path) => ___namespace.trimStart(path, '.'));
    }
    return paths;
}
function getObjectsDiff(left, right) {
    const leftPaths = getObjectPaths(left);
    const reducer = {
        values: {},
        paths: [],
    };
    return leftPaths.reduce((result, path) => {
        const leftVal = convertSpecial(___namespace.get(left, path));
        const rightVal = convertSpecial(___namespace.get(right, path));
        if (!___namespace.isEqual(leftVal, rightVal)) {
            ___namespace.set(result.values, path, leftVal);
            result.paths.push(path);
        }
        return result;
    }, reducer);
}
function getObjectValues(obj, paths) {
    const values = paths.reduce((result, path) => {
        const val = convertSpecial(___namespace.get(obj, path));
        ___namespace.set(result, path, val);
        return result;
    }, {});
    return compact(values);
}
function isSimplePrimitive(val) {
    return (___namespace.isNil(val) ||
        ___namespace.isBoolean(val) ||
        ___namespace.isNumber(val) ||
        ___namespace.isString(val) ||
        ___namespace.isDate(val) ||
        ___namespace.isSymbol(val) ||
        ___namespace.isRegExp(val));
}
function convertSpecial(val) {
    if (val && val.constructor.name === 'ObjectID') {
        return val.toString();
    }
    return val;
}
function compact(obj) {
    obj = convertSpecial(obj);
    if (isSimplePrimitive(obj)) {
        return obj;
    }
    if (___namespace.isArray(obj)) {
        return ___namespace.compact(obj);
    }
    const result = {};
    ___namespace.each(obj, (objItem, objKey) => {
        objItem = convertSpecial(objItem);
        if (isSimplePrimitive(objItem)) {
            result[objKey] = objItem;
        }
        else if (___namespace.isArray(objItem)) {
            result[objKey] = ___namespace.filter(objItem, (v) => !___namespace.isNil(v));
            ___namespace.each(result[objKey], (arrItem, arrIndex) => {
                result[objKey][arrIndex] = compact(arrItem);
            });
        }
        else {
            result[objKey] = compact(objItem);
        }
    });
    return result;
}

function diff(original, current) {
    const { addedAndChanged, deletedAndChanged } = _getPaths(original, current);
    return {
        left: compact(deletedAndChanged.values),
        right: compact(addedAndChanged.values),
    };
}
function diffValues(original, current) {
    const { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);
    return {
        changed: getObjectValues(current, changedPaths),
        added: getObjectValues(current, addedPaths),
        deleted: getObjectValues(original, deletedPaths),
    };
}
function diffPaths(original, current) {
    const { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);
    return {
        changed: changedPaths,
        added: addedPaths,
        deleted: deletedPaths,
    };
}
function revert(dest, src, customizer) {
    const srcPaths = getObjectPaths(src, '', ___namespace.isArray(src));
    return srcPaths.reduce((result, path) => {
        const destValue = ___namespace.get(dest, path);
        const srcValue = ___namespace.get(src, path);
        const value = customizer(destValue, srcValue);
        ___namespace.set(result, path, value);
        return result;
    }, {});
}
function getPaths(obj) {
    return getObjectPaths(obj, '', ___namespace.isArray(obj));
}
function omitPaths(obj, excludedPaths) {
    const includedPaths = getPaths(obj).filter((path) => {
        const isIgnored = excludedPaths.some((ignoredPath) => {
            if (___namespace.startsWith(ignoredPath, '*.')) {
                return ___namespace.endsWith(path, ___namespace.trimStart(ignoredPath, '*.'));
            }
            if (___namespace.endsWith(ignoredPath, '.*')) {
                return ___namespace.startsWith(path, ___namespace.trimEnd(ignoredPath, '.*'));
            }
            return ignoredPath === path;
        });
        return !isIgnored;
    });
    return getObjectValues(obj, includedPaths);
}
function _getPaths(original, current) {
    const addedAndChanged = getObjectsDiff(current, original);
    const deletedAndChanged = getObjectsDiff(original, current);
    const changedPaths = ___namespace.intersection(addedAndChanged.paths, deletedAndChanged.paths);
    const addedPaths = ___namespace.difference(addedAndChanged.paths, changedPaths);
    const deletedPaths = ___namespace.difference(deletedAndChanged.paths, changedPaths);
    return {
        addedAndChanged,
        deletedAndChanged,
        changedPaths,
        addedPaths,
        deletedPaths,
    };
}

exports.diff = diff;
exports.diffPaths = diffPaths;
exports.diffValues = diffValues;
exports.getPaths = getPaths;
exports.omitPaths = omitPaths;
exports.revert = revert;
