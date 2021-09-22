"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envToBool = exports.findPackageJson = exports.setDefaultValue = void 0;
var camelcase_1 = __importDefault(require("camelcase"));
var find_package_json_1 = __importDefault(require("find-package-json"));
var debug_1 = __importDefault(require("debug"));
var path_1 = require("path");
var lodash_defaultsdeep_1 = __importDefault(require("lodash.defaultsdeep"));
var log = (0, debug_1.default)('RedisMS:ResolveConfig');
var ENV_CONFIG_PREFIX = 'REDISMS_';
var defaultValues = new Map();
/**
 * Set an Default value for an specific key
 * Mostly only used internally (for the "global-x.x" packages)
 * @param key The Key the default value should be assigned to
 * @param value The Value what the default should be
 */
function setDefaultValue(key, value) {
    defaultValues.set(key, value);
}
exports.setDefaultValue = setDefaultValue;
var packageJsonConfig = {};
/**
 * Traverse up the hierarchy and combine all package.json files
 * @param directory Set an custom directory to search the config in (default: process.cwd())
 */
function findPackageJson(directory) {
    var _packageJsonConfig = {};
    var finderIterator = (0, find_package_json_1.default)(directory || process.cwd());
    var foundPackageJson;
    while ((foundPackageJson = finderIterator.next())) {
        if (foundPackageJson.done) {
            break;
        }
        var value = foundPackageJson.value, filename = foundPackageJson.filename;
        log("Found package.json at \"" + filename + "\"");
        var ourConfig = (value === null || value === void 0 ? void 0 : value.redisMemoryServer) || {};
        // resolve relative paths
        for (var _i = 0, _a = ['downloadDir', 'systemBinary']; _i < _a.length; _i++) {
            var relativePathProp = _a[_i];
            if (ourConfig[relativePathProp]) {
                ourConfig[relativePathProp] = (0, path_1.resolve)((0, path_1.dirname)(filename), ourConfig[relativePathProp]);
            }
        }
        (0, lodash_defaultsdeep_1.default)(_packageJsonConfig, ourConfig);
    }
    packageJsonConfig = _packageJsonConfig;
}
exports.findPackageJson = findPackageJson;
findPackageJson();
/**
 * Resolve "variableName" with a prefix of "ENV_CONFIG_PREFIX"
 * @param variableName The variable to use
 */
function resolveConfig(variableName) {
    var _a, _b;
    return ((_b = (_a = process.env["" + ENV_CONFIG_PREFIX + variableName]) !== null && _a !== void 0 ? _a : packageJsonConfig === null || packageJsonConfig === void 0 ? void 0 : packageJsonConfig[(0, camelcase_1.default)(variableName)]) !== null && _b !== void 0 ? _b : defaultValues.get(variableName));
}
exports.default = resolveConfig;
/**
 * Convert "1, on, yes, true" to true (otherwise false)
 * @param env The String / Environment Variable to check
 */
function envToBool(env) {
    if (env === void 0) { env = ''; }
    return ['1', 'on', 'yes', 'true'].indexOf(env.toLowerCase()) !== -1;
}
exports.envToBool = envToBool;
// enable debug if "REDISMS_DEBUG" is true
if (envToBool(resolveConfig('DEBUG'))) {
    debug_1.default.enable('RedisMS:*');
}
//# sourceMappingURL=resolve-config.js.map