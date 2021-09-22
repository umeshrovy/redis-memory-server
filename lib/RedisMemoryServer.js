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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var tmp = __importStar(require("tmp"));
var get_port_1 = __importDefault(require("get-port"));
var db_util_1 = require("./util/db_util");
var RedisInstance_1 = __importDefault(require("./util/RedisInstance"));
var debug_1 = __importDefault(require("debug"));
var log = (0, debug_1.default)('RedisMS:RedisMemoryServer');
tmp.setGracefulCleanup();
var RedisMemoryServer = /** @class */ (function () {
    /**
     * Create an Redis-Memory-Sever Instance
     *
     * Note: because of JavaScript limitations, autoStart cannot be awaited here, use ".create" for async/await ability
     * @param opts Redis-Memory-Sever Options
     */
    function RedisMemoryServer(opts) {
        this.runningInstance = null;
        this.instanceInfoSync = null;
        this.opts = __assign({}, opts);
        if ((opts === null || opts === void 0 ? void 0 : opts.autoStart) === true) {
            log('Autostarting Redis instance...');
            this.start();
        }
    }
    /**
     * Create an Redis-Memory-Sever Instance that can be awaited
     * @param opts Redis-Memory-Sever Options
     */
    RedisMemoryServer.create = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new RedisMemoryServer(__assign(__assign({}, opts), { autoStart: false }));
                        if (!(opts === null || opts === void 0 ? void 0 : opts.autoStart)) return [3 /*break*/, 2];
                        return [4 /*yield*/, instance.start()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, instance];
                }
            });
        });
    };
    /**
     * Start the in-memory Instance
     * (when options.autoStart is true, this already got called)
     */
    RedisMemoryServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                log('Called RedisMemoryServer.start() method');
                if (this.runningInstance) {
                    throw new Error('Redis instance already in status startup/running/error. Use debug for more info.');
                }
                this.runningInstance = this._startUpInstance()
                    .catch(function (err) {
                    var _a;
                    if (err.message === 'redis-server shutting down' || err === 'redis-server shutting down') {
                        log("Redis did not start. Trying to start on another port one more time...");
                        if ((_a = _this.opts.instance) === null || _a === void 0 ? void 0 : _a.port) {
                            _this.opts.instance.port = null;
                        }
                        return _this._startUpInstance();
                    }
                    throw err;
                })
                    .catch(function (err) {
                    if (!debug_1.default.enabled('RedisMS:RedisMemoryServer')) {
                        console.warn('Starting the instance failed, please enable debug for more infomation');
                    }
                    throw err;
                });
                return [2 /*return*/, this.runningInstance.then(function (data) {
                        _this.instanceInfoSync = data;
                        return true;
                    })];
            });
        });
    };
    /**
     * Internal Function to start an instance
     * @private
     */
    RedisMemoryServer.prototype._startUpInstance = function () {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var instOpts, data, instance;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        instOpts = (_a = this.opts.instance) !== null && _a !== void 0 ? _a : {};
                        _e = {};
                        return [4 /*yield*/, (0, get_port_1.default)({ port: (_b = instOpts.port) !== null && _b !== void 0 ? _b : undefined })];
                    case 1:
                        data = (_e.port = _f.sent(),
                            _e.ip = (_c = instOpts.ip) !== null && _c !== void 0 ? _c : '127.0.0.1',
                            _e.tmpDir = undefined,
                            _e);
                        if (instOpts.port != data.port) {
                            log("starting with port " + data.port + ", since " + instOpts.port + " was locked:", data.port);
                        }
                        log("Starting Redis instance with following options: " + JSON.stringify(data));
                        return [4 /*yield*/, RedisInstance_1.default.run({
                                instance: {
                                    ip: data.ip,
                                    port: data.port,
                                    args: instOpts.args,
                                },
                                binary: this.opts.binary,
                                spawn: this.opts.spawn,
                            })];
                    case 2:
                        instance = _f.sent();
                        return [2 /*return*/, __assign(__assign({}, data), { instance: instance, childProcess: (_d = instance.childProcess) !== null && _d !== void 0 ? _d : undefined })];
                }
            });
        });
    };
    /**
     * Stop the current In-Memory Instance
     */
    RedisMemoryServer.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, instance, port, tmpDir;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log('Called RedisMemoryServer.stop() method');
                        // just return "true" if the instance is already running / defined
                        if ((0, db_util_1.isNullOrUndefined)(this.runningInstance)) {
                            log('Instance is already stopped, returning true');
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, this.ensureInstance()];
                    case 1:
                        _a = _b.sent(), instance = _a.instance, port = _a.port, tmpDir = _a.tmpDir;
                        log("Shutdown Redis server on port " + port + " with pid " + (instance.getPid() || ''));
                        return [4 /*yield*/, instance.kill()];
                    case 2:
                        _b.sent();
                        this.runningInstance = null;
                        this.instanceInfoSync = null;
                        if (tmpDir) {
                            log("Removing tmpDir " + tmpDir.name);
                            tmpDir.removeCallback();
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Get Information about the currently running instance, if it is not running it returns "false"
     */
    RedisMemoryServer.prototype.getInstanceInfo = function () {
        var _a;
        return (_a = this.instanceInfoSync) !== null && _a !== void 0 ? _a : false;
    };
    /**
     * Ensure that the instance is running
     * -> throws if instance cannot be started
     */
    RedisMemoryServer.prototype.ensureInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log('Called RedisMemoryServer.ensureInstance() method');
                        if (this.runningInstance) {
                            return [2 /*return*/, this.runningInstance];
                        }
                        log(' - no running instance, call `start()` command');
                        return [4 /*yield*/, this.start()];
                    case 1:
                        _a.sent();
                        log(' - `start()` command was succesfully resolved');
                        // check again for 1. Typescript-type reasons and 2. if .start failed to throw an error
                        if (!this.runningInstance) {
                            throw new Error('Ensure-Instance failed to start an instance!');
                        }
                        return [2 /*return*/, this.runningInstance];
                }
            });
        });
    };
    /**
     * Get a redis host
     */
    RedisMemoryServer.prototype.getHost = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getIp()];
            });
        });
    };
    /**
     * Get a redis IP
     */
    RedisMemoryServer.prototype.getIp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureInstance()];
                    case 1:
                        ip = (_a.sent()).ip;
                        return [2 /*return*/, ip];
                }
            });
        });
    };
    /**
     * Get the Port of the currently running Instance
     * Note: calls "ensureInstance"
     */
    RedisMemoryServer.prototype.getPort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var port;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureInstance()];
                    case 1:
                        port = (_a.sent()).port;
                        return [2 /*return*/, port];
                }
            });
        });
    };
    return RedisMemoryServer;
}());
exports.default = RedisMemoryServer;
//# sourceMappingURL=RedisMemoryServer.js.map