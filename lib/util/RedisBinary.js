"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LATEST_VERSION = void 0;
var fs_1 = __importDefault(require("fs"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var lockfile_1 = __importDefault(require("lockfile"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var find_cache_dir_1 = __importDefault(require("find-cache-dir"));
var child_process_1 = require("child_process");
var util_1 = require("util");
var RedisBinaryDownload_1 = __importDefault(require("./RedisBinaryDownload"));
var resolve_config_1 = __importDefault(require("./resolve-config"));
var debug_1 = __importDefault(require("debug"));
var log = (0, debug_1.default)('RedisMS:RedisBinary');
exports.LATEST_VERSION = 'stable';
var RedisBinary = /** @class */ (function () {
    function RedisBinary() {
    }
    /**
     * Probe if the provided "systemBinary" is an existing path
     * @param systemBinary The Path to probe for an System-Binary
     * @return System Binary path or empty string
     */
    RedisBinary.getSystemPath = function (systemBinary) {
        return __awaiter(this, void 0, void 0, function () {
            var binaryPath, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        binaryPath = '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, util_1.promisify)(fs_1.default.access)(systemBinary)];
                    case 2:
                        _a.sent();
                        log("RedisBinary: found system binary path at \"" + systemBinary + "\"");
                        binaryPath = systemBinary;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        log("RedisBinary: can't find system binary at \"" + systemBinary + "\".\n" + (err_1 === null || err_1 === void 0 ? void 0 : err_1.message));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, binaryPath];
                }
            });
        });
    };
    /**
     * Check if specified version already exists in the cache
     * @param version The Version to check for
     */
    RedisBinary.getCachePath = function (version) {
        return this.cache[version];
    };
    /**
     * Probe download path and download the binary
     * @param options Options Configuring which binary to download and to which path
     * @returns The BinaryPath the binary has been downloaded to
     */
    RedisBinary.getDownloadPath = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var downloadDir, version, lockfile, downloader, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        downloadDir = options.downloadDir, version = options.version;
                        // create downloadDir
                        return [4 /*yield*/, (0, mkdirp_1.default)(downloadDir)];
                    case 1:
                        // create downloadDir
                        _c.sent();
                        lockfile = path_1.default.resolve(downloadDir, version + ".lock");
                        // wait to get a lock
                        // downloading of binaries may be quite long procedure
                        // that's why we are using so big wait/stale periods
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                lockfile_1.default.lock(lockfile, {
                                    wait: 1000 * 120,
                                    pollPeriod: 100,
                                    stale: 1000 * 110,
                                    retries: 3,
                                    retryWait: 100,
                                }, function (err) {
                                    return err ? reject(err) : resolve(null);
                                });
                            })];
                    case 2:
                        // wait to get a lock
                        // downloading of binaries may be quite long procedure
                        // that's why we are using so big wait/stale periods
                        _c.sent();
                        if (!!this.getCachePath(version)) return [3 /*break*/, 4];
                        downloader = new RedisBinaryDownload_1.default({
                            downloadDir: downloadDir,
                            version: version,
                        });
                        _a = this.cache;
                        _b = version;
                        return [4 /*yield*/, downloader.getRedisServerPath()];
                    case 3:
                        _a[_b] = _c.sent();
                        _c.label = 4;
                    case 4: 
                    // remove lock
                    return [4 /*yield*/, new Promise(function (res) {
                            lockfile_1.default.unlock(lockfile, function (err) {
                                log(err
                                    ? "RedisBinary: Error when removing download lock " + err
                                    : "RedisBinary: Download lock removed");
                                res(null); // we don't care if it was successful or not
                            });
                        })];
                    case 5:
                        // remove lock
                        _c.sent();
                        return [2 /*return*/, this.getCachePath(version)];
                }
            });
        });
    };
    /**
     * Probe all supported paths for an binary and return the binary path
     * @param opts Options configuring which binary to search for
     * @throws {Error} if no valid BinaryPath has been found
     * @return The first found BinaryPath
     */
    RedisBinary.getPath = function (opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var legacyDLDir, nodeModulesDLDir, defaultOptions, options, binaryPath, binaryVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legacyDLDir = path_1.default.resolve(os_1.default.homedir(), '.cache/redis-binaries');
                        nodeModulesDLDir = process.cwd();
                        while (nodeModulesDLDir.endsWith("node_modules" + path_1.default.sep + "redis-memory-server")) {
                            nodeModulesDLDir = path_1.default.resolve(nodeModulesDLDir, '..', '..');
                        }
                        defaultOptions = {
                            downloadDir: (0, resolve_config_1.default)('DOWNLOAD_DIR') ||
                                (fs_1.default.existsSync(legacyDLDir)
                                    ? legacyDLDir
                                    : path_1.default.resolve((0, find_cache_dir_1.default)({
                                        name: 'redis-memory-server',
                                        cwd: nodeModulesDLDir,
                                    }) || '', 'redis-binaries')),
                            version: (0, resolve_config_1.default)('VERSION') || exports.LATEST_VERSION,
                            systemBinary: (0, resolve_config_1.default)('SYSTEM_BINARY'),
                        };
                        options = __assign(__assign({}, defaultOptions), opts);
                        log("RedisBinary options:", JSON.stringify(options, null, 2));
                        binaryPath = '';
                        if (!options.systemBinary) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getSystemPath(options.systemBinary)];
                    case 1:
                        binaryPath = _a.sent();
                        if (binaryPath) {
                            if (binaryPath.indexOf(' ') >= 0) {
                                binaryPath = "\"" + binaryPath + "\"";
                            }
                            binaryVersion = (0, child_process_1.execSync)(binaryPath + " --version")
                                .toString()
                                .split('\n')[0]
                                .split(' ')[2];
                            if (options.version !== exports.LATEST_VERSION && options.version !== binaryVersion) {
                                // we will log the version number of the system binary and the version requested so the user can see the difference
                                log('RedisMemoryServer: Possible version conflict\n' +
                                    ("  SystemBinary version: " + binaryVersion + "\n") +
                                    ("  Requested version:    " + options.version + "\n\n") +
                                    '  Using SystemBinary!');
                            }
                        }
                        _a.label = 2;
                    case 2:
                        if (!binaryPath) {
                            binaryPath = this.getCachePath(options.version);
                        }
                        if (!!binaryPath) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getDownloadPath(options)];
                    case 3:
                        binaryPath = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!binaryPath) {
                            throw new Error("RedisBinary.getPath: could not find an valid binary path! (Got: \"" + binaryPath + "\")");
                        }
                        log("RedisBinary: redis-server binary path: \"" + binaryPath + "\"");
                        return [2 /*return*/, binaryPath];
                }
            });
        });
    };
    RedisBinary.cache = {};
    return RedisBinary;
}());
exports.default = RedisBinary;
//# sourceMappingURL=RedisBinary.js.map