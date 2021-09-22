"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullOrUndefined = void 0;
/**
 * Because since node 4.0.0 the internal util.is* functions got deprecated
 * @param val Any value to test if null or undefined
 */
function isNullOrUndefined(val) {
    return val === null || val === undefined;
}
exports.isNullOrUndefined = isNullOrUndefined;
//# sourceMappingURL=db_util.js.map