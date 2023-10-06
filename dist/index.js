"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omitPaths = exports.getPaths = exports.revert = exports.diffPaths = exports.diffValues = exports.diff = void 0;
const _ = __importStar(require("lodash"));
const utils_1 = require("./utils");
function diff(original, current) {
    const { addedAndChanged, deletedAndChanged } = _getPaths(original, current);
    return {
        left: (0, utils_1.compact)(deletedAndChanged.values),
        right: (0, utils_1.compact)(addedAndChanged.values),
    };
}
exports.diff = diff;
function diffValues(original, current) {
    const { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);
    return {
        changed: (0, utils_1.getObjectValues)(current, changedPaths),
        added: (0, utils_1.getObjectValues)(current, addedPaths),
        deleted: (0, utils_1.getObjectValues)(original, deletedPaths),
    };
}
exports.diffValues = diffValues;
function diffPaths(original, current) {
    const { changedPaths, addedPaths, deletedPaths } = _getPaths(original, current);
    return {
        changed: changedPaths,
        added: addedPaths,
        deleted: deletedPaths,
    };
}
exports.diffPaths = diffPaths;
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
exports.revert = revert;
function getPaths(obj) {
    return (0, utils_1.getObjectPaths)(obj, '', _.isArray(obj));
}
exports.getPaths = getPaths;
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
exports.omitPaths = omitPaths;
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
