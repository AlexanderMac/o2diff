(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.o2diff = {}, global._));
})(this, (function (exports, lodash) { 'use strict';

    function getObjectPaths(input, curPath = '', isArray = false) {
        const paths = [];
        lodash.forEach(input, (value, key) => {
            value = convertSpecial(value);
            const newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`;
            if (isSimplePrimitive(value)) {
                paths.push(newPath);
            }
            else if (Array.isArray(value)) {
                paths.push(...getObjectPaths(value, newPath, true));
            }
            else {
                paths.push(...getObjectPaths(value, newPath));
            }
        });
        if (curPath) {
            return paths;
        }
        return paths.map(path => lodash.trimStart(path, '.'));
    }
    function getObjectsDiff(left, right) {
        const leftPaths = getObjectPaths(left);
        const reducer = {
            values: {},
            paths: [],
        };
        return leftPaths.reduce((result, path) => {
            const leftVal = convertSpecial(lodash.get(left, path));
            const rightVal = convertSpecial(lodash.get(right, path));
            if (!lodash.isEqual(leftVal, rightVal)) {
                lodash.set(result.values, path, leftVal);
                result.paths.push(path);
            }
            return result;
        }, reducer);
    }
    function getObjectValues(input, paths) {
        const values = paths.reduce((result, path) => {
            const value = convertSpecial(lodash.get(input, path));
            lodash.set(result, path, value);
            return result;
        }, {});
        return compact(values);
    }
    function isSimplePrimitive(value) {
        return (lodash.isNil(value) ||
            lodash.isBoolean(value) ||
            lodash.isNumber(value) ||
            lodash.isString(value) ||
            lodash.isDate(value) ||
            lodash.isSymbol(value) ||
            lodash.isRegExp(value));
    }
    function convertSpecial(value) {
        if (value && value.constructor.name === 'ObjectID') {
            return value.toString();
        }
        return value;
    }
    function compact(input) {
        const value = convertSpecial(input);
        if (isSimplePrimitive(value)) {
            return value;
        }
        if (Array.isArray(value)) {
            return lodash.compact(value);
        }
        const result = {};
        lodash.forEach(value, (objItem, objKey) => {
            objItem = convertSpecial(objItem);
            if (isSimplePrimitive(objItem)) {
                result[objKey] = objItem;
            }
            else if (Array.isArray(objItem)) {
                result[objKey] = lodash.filter(objItem, v => !lodash.isNil(v));
                lodash.forEach(result[objKey], (arrItem, arrIndex) => {
                    result[objKey][arrIndex] = compact(arrItem);
                });
            }
            else {
                result[objKey] = compact(objItem);
            }
        });
        return result;
    }

    const getLibVersion = () => {
        return '5.1.0';
    };
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
        const srcPaths = getObjectPaths(src, '', Array.isArray(src));
        return srcPaths.reduce((result, path) => {
            const destValue = lodash.get(dest, path);
            const srcValue = lodash.get(src, path);
            const value = customizer(destValue, srcValue);
            lodash.set(result, path, value);
            return result;
        }, {});
    }
    function getPaths(obj) {
        return getObjectPaths(obj, '', Array.isArray(obj));
    }
    function omitPaths(obj, excludedPaths) {
        const includedPaths = getPaths(obj).filter(path => {
            const isIgnored = excludedPaths.some(ignoredPath => {
                if (ignoredPath.startsWith('*.')) {
                    return path.endsWith(lodash.trimStart(ignoredPath, '*.'));
                }
                if (ignoredPath.endsWith('.*')) {
                    return path.startsWith(lodash.trimEnd(ignoredPath, '.*'));
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
        const changedPaths = lodash.intersection(addedAndChanged.paths, deletedAndChanged.paths);
        const addedPaths = lodash.difference(addedAndChanged.paths, changedPaths);
        const deletedPaths = lodash.difference(deletedAndChanged.paths, changedPaths);
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
    exports.getLibVersion = getLibVersion;
    exports.getPaths = getPaths;
    exports.omitPaths = omitPaths;
    exports.revert = revert;

}));
