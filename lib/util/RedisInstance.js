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
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var path_1 = __importDefault(require("path"));
var RedisBinary_1 = __importDefault(require("./RedisBinary"));
var debug_1 = __importDefault(require("debug"));
var db_util_1 = require("./db_util");
var semver_1 = require("semver");
if ((0, semver_1.lt)(process.version, '10.15.0')) {
    console.warn('Using NodeJS below 10.15.0');
}
var log = (0, debug_1.default)('RedisMS:RedisInstance');
/**
 * Redis Instance Handler Class
 */
var RedisInstance = /** @class */ (function () {
    function RedisInstance(opts) {
        var _a;
        this.isInstanceReady = false;
        this.instanceReady = function () { };
        this.instanceFailed = function () { };
        this.opts = opts;
        this.childProcess = null;
        this.killerProcess = null;
        if (!this.opts.instance) {
            this.opts.instance = {};
        }
        if (!this.opts.binary) {
            this.opts.binary = {};
        }
        if (debug_1.default.enabled('RedisMS:RedisInstance')) {
            // add instance's port to debug output
            var port_1 = (_a = this.opts.instance) === null || _a === void 0 ? void 0 : _a.port;
            this.debug = function (msg) {
                log("Redis[" + port_1 + "]: " + msg);
            };
        }
        else {
            this.debug = function () { };
        }
    }
    /**
     * Create an new instance an call method "run"
     * @param opts Options passed to the new instance
     */
    RedisInstance.run = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                instance = new this(opts);
                return [2 /*return*/, instance.run()];
            });
        });
    };
    /**
     * Create an array of arguments for the redis-server instance
     */
    RedisInstance.prototype.prepareCommandArgs = function () {
        var _a = this.opts.instance, ip = _a.ip, port = _a.port, args = _a.args;
        var result = [];
        result.push('--save', ''); // disable RDB snapshotting
        result.push('--appendonly', 'no'); // disable AOF
        result.push('--bind', ip || '127.0.0.1');
        if (port) {
            result.push('--port', port.toString());
        }
        return result.concat(args !== null && args !== void 0 ? args : []);
    };
    /**
     * Create the redis-server process
     */
    RedisInstance.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var launch, redisBin;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        launch = new Promise(function (resolve, reject) {
                            _this.instanceReady = function () {
                                _this.isInstanceReady = true;
                                _this.debug('RedisInstance: Instance is ready!');
                                resolve(__assign({}, _this.childProcess));
                            };
                            _this.instanceFailed = function (err) {
                                _this.debug("RedisInstance: Instance has failed: " + err.toString());
                                if (_this.killerProcess) {
                                    _this.killerProcess.kill();
                                }
                                reject(err);
                            };
                        });
                        return [4 /*yield*/, RedisBinary_1.default.getPath(this.opts.binary)];
                    case 1:
                        redisBin = _a.sent();
                        this.childProcess = this._launchRedisServer(redisBin);
                        this.killerProcess = this._launchKiller(process.pid, this.childProcess.pid);
                        return [4 /*yield*/, launch];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    RedisInstance.prototype.kill = function () {
        return __awaiter(this, void 0, void 0, function () {
            /**
             * Function to De-Duplicate Code
             * @param process The Process to kill
             * @param name the name used in the logs
             * @param debugfn the debug function
             */
            function kill_internal(process, name, debugfn) {
                return __awaiter(this, void 0, void 0, function () {
                    var timeoutTime;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                timeoutTime = 1000 * 10;
                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        var timeout = setTimeout(function () {
                                            debugfn('kill_internal timeout triggered, trying SIGKILL');
                                            if (!debug_1.default.enabled('RedisMS:RedisInstance')) {
                                                console.warn('An Process didnt exit with signal "SIGINT" within 10 seconds, using "SIGKILL"!\n' +
                                                    'Enable debug logs for more information');
                                            }
                                            process.kill('SIGKILL');
                                            timeout = setTimeout(function () {
                                                debugfn('kill_internal timeout triggered again, rejecting');
                                                reject(new Error('Process didnt exit, enable debug for more information.'));
                                            }, timeoutTime);
                                        }, timeoutTime);
                                        process.once("exit", function (code, signal) {
                                            debugfn("- " + name + ": got exit signal, Code: " + code + ", Signal: " + signal);
                                            clearTimeout(timeout);
                                            resolve(null);
                                        });
                                        debugfn("- " + name + ": send \"SIGINT\"");
                                        process.kill('SIGINT');
                                    })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug('Called RedisInstance.kill():');
                        if (!!(0, db_util_1.isNullOrUndefined)(this.childProcess)) return [3 /*break*/, 2];
                        return [4 /*yield*/, kill_internal(this.childProcess, 'childProcess', this.debug)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.debug('- childProcess: nothing to shutdown, skipping.');
                        _a.label = 3;
                    case 3:
                        if (!!(0, db_util_1.isNullOrUndefined)(this.killerProcess)) return [3 /*break*/, 5];
                        return [4 /*yield*/, kill_internal(this.killerProcess, 'killerProcess', this.debug)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        this.debug('- killerProcess: nothing to shutdown, skipping.');
                        _a.label = 6;
                    case 6:
                        this.debug('Instance Finished Shutdown');
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Get the PID of the redis-server instance
     */
    RedisInstance.prototype.getPid = function () {
        var _a;
        return (_a = this.childProcess) === null || _a === void 0 ? void 0 : _a.pid;
    };
    /**
     * Actually launch redis-server
     * @param redisBin The binary to run
     */
    RedisInstance.prototype._launchRedisServer = function (redisBin) {
        var _a, _b, _c;
        var spawnOpts = (_a = this.opts.spawn) !== null && _a !== void 0 ? _a : {};
        if (!spawnOpts.stdio) {
            spawnOpts.stdio = 'pipe';
        }
        var childProcess = (0, cross_spawn_1.default)(redisBin, this.prepareCommandArgs(), spawnOpts);
        (_b = childProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', this.stderrHandler.bind(this));
        (_c = childProcess.stdout) === null || _c === void 0 ? void 0 : _c.on('data', this.stdoutHandler.bind(this));
        childProcess.on('close', this.closeHandler.bind(this));
        childProcess.on('error', this.errorHandler.bind(this));
        if ((0, db_util_1.isNullOrUndefined)(childProcess.pid)) {
            throw new Error('Spawned Redis Instance PID is undefined');
        }
        return childProcess;
    };
    /**
     * Spawn an child to kill the parent and the redis-server instance if both are Dead
     * @param parentPid Parent to kill
     * @param childPid redis-server process to kill
     */
    RedisInstance.prototype._launchKiller = function (parentPid, childPid) {
        var _this = this;
        var _a, _b, _c;
        this.debug("Called RedisInstance._launchKiller(parent: " + parentPid + ", child: " + childPid + "):");
        // spawn process which kills itself and redis process if current process is dead
        var killer = (0, cross_spawn_1.default)((_a = process.env['NODE']) !== null && _a !== void 0 ? _a : process.argv[0], // try Environment variable "NODE" before using argv[0]
        [
            path_1.default.resolve(__dirname, '../../scripts/redis_killer.js'),
            parentPid.toString(),
            childPid.toString(),
        ], { stdio: 'pipe' });
        (_b = killer.stdout) === null || _b === void 0 ? void 0 : _b.on('data', function (data) {
            _this.debug("[RedisKiller]: " + data);
        });
        (_c = killer.stderr) === null || _c === void 0 ? void 0 : _c.on('data', function (data) {
            _this.debug("[RedisKiller]: " + data);
        });
        ['exit', 'message', 'disconnect', 'error'].forEach(function (type) {
            killer.on(type, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.debug("[RedisKiller]: " + type + " - " + JSON.stringify(args));
            });
        });
        return killer;
    };
    RedisInstance.prototype.errorHandler = function (err) {
        this.instanceFailed(err);
    };
    /**
     * Write the CLOSE event to the debug function
     * @param code The Exit code
     */
    RedisInstance.prototype.closeHandler = function (code) {
        if (code != 0) {
            this.debug('redis-server instance closed with an non-0 code!');
        }
        this.debug("CLOSE: " + code);
        this.instanceFailed("redis-server instance closed with code \"" + code + "\"");
    };
    /**
     * Write STDERR to debug function
     * @param message The STDERR line to write
     */
    RedisInstance.prototype.stderrHandler = function (message) {
        this.debug("STDERR: " + message.toString());
    };
    /**
     * Write STDOUT to debug function AND instanceReady/instanceFailed if inputs match
     * @param message The STDOUT line to write/parse
     */
    RedisInstance.prototype.stdoutHandler = function (message) {
        var line = message.toString();
        this.debug("STDOUT: " + line);
        if (/Ready to accept connections/i.test(line)) {
            this.instanceReady();
        }
        else if (/Address already in use/i.test(line)) {
            this.instanceFailed("Port " + this.opts.instance.port + " already in use");
        }
        else if (/redis-server instance already running/i.test(line)) {
            this.instanceFailed('redis-server already running');
        }
        else if (/permission denied/i.test(line)) {
            this.instanceFailed('redis-server permission denied');
        }
        else if (/shutting down with code/i.test(line)) {
            // if redis-server started succesfully then no error on shutdown!
            if (!this.isInstanceReady) {
                this.instanceFailed('redis-server shutting down');
            }
        }
        else if (/\*\*\*aborting after/i.test(line)) {
            this.instanceFailed('redis-server internal error');
        }
    };
    RedisInstance.childProcessList = [];
    return RedisInstance;
}());
exports.default = RedisInstance;
//# sourceMappingURL=RedisInstance.js.map