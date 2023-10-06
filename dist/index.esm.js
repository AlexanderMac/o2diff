import * as _ from 'lodash';

function getObjectPaths(obj, curPath = '', isArray = false) {
    let paths = [];
    _.each(obj, (val, key) => {
        val = convertSpecial(val);
        const newPath = isArray ? `${curPath}[${key}]` : `${curPath}.${key}`;
        if (isSimplePrimitive(val)) {
            paths.push(newPath);
        }
        else if (_.isArray(val)) {
            paths = paths.concat(getObjectPaths(val, newPath, true));
        }
        else {
            paths = paths.concat(getObjectPaths(val, newPath));
        }
    });
    if (!curPath) {
        paths = paths.map((path) => _.trimStart(path, '.'));
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
        const leftVal = convertSpecial(_.get(left, path));
        const rightVal = convertSpecial(_.get(right, path));
        if (!_.isEqual(leftVal, rightVal)) {
            _.set(result.values, path, leftVal);
            result.paths.push(path);
        }
        return result;
    }, reducer);
}
function getObjectValues(obj, paths) {
    const values = paths.reduce((result, path) => {
        const val = convertSpecial(_.get(obj, path));
        _.set(result, path, val);
        return result;
    }, {});
    return compact(values);
}
function isSimplePrimitive(val) {
    return (_.isNil(val) ||
        _.isBoolean(val) ||
        _.isNumber(val) ||
        _.isString(val) ||
        _.isDate(val) ||
        _.isSymbol(val) ||
        _.isRegExp(val));
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
    if (_.isArray(obj)) {
        return _.compact(obj);
    }
    const result = {};
    _.each(obj, (objItem, objKey) => {
        objItem = convertSpecial(objItem);
        if (isSimplePrimitive(objItem)) {
            result[objKey] = objItem;
        }
        else if (_.isArray(objItem)) {
            result[objKey] = _.filter(objItem, (v) => !_.isNil(v));
            _.each(result[objKey], (arrItem, arrIndex) => {
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
    const srcPaths = getObjectPaths(src, '', _.isArray(src));
    return srcPaths.reduce((result, path) => {
        const destValue = _.get(dest, path);
        const srcValue = _.get(src, path);
        const value = customizer(destValue, srcValue);
        _.set(result, path, value);
        return result;
    }, {});
}
function getPaths(obj) {
    return getObjectPaths(obj, '', _.isArray(obj));
}
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
    return getObjectValues(obj, includedPaths);
}
function _getPaths(original, current) {
    const addedAndChanged = getObjectsDiff(current, original);
    const deletedAndChanged = getObjectsDiff(original, current);
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

export { diff, diffPaths, diffValues, getPaths, omitPaths, revert };
