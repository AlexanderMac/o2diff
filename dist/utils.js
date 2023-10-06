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
exports.compact = exports.convertSpecial = exports.isSimplePrimitive = exports.getObjectValues = exports.getObjectsDiff = exports.getObjectPaths = void 0;
const _ = __importStar(require("lodash"));
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
exports.getObjectPaths = getObjectPaths;
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
exports.getObjectsDiff = getObjectsDiff;
function getObjectValues(obj, paths) {
    const values = paths.reduce((result, path) => {
        const val = convertSpecial(_.get(obj, path));
        _.set(result, path, val);
        return result;
    }, {});
    return compact(values);
}
exports.getObjectValues = getObjectValues;
function isSimplePrimitive(val) {
    return (_.isNil(val) ||
        _.isBoolean(val) ||
        _.isNumber(val) ||
        _.isString(val) ||
        _.isDate(val) ||
        _.isSymbol(val) ||
        _.isRegExp(val));
}
exports.isSimplePrimitive = isSimplePrimitive;
function convertSpecial(val) {
    if (val && val.constructor.name === 'ObjectID') {
        return val.toString();
    }
    return val;
}
exports.convertSpecial = convertSpecial;
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
exports.compact = compact;
