"use strict";
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
var url_1 = __importDefault(require("url"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var rimraf_1 = __importDefault(require("rimraf"));
var https_1 = __importDefault(require("https"));
var tar_1 = __importDefault(require("tar"));
var extract_zip_1 = __importDefault(require("extract-zip"));
var RedisBinaryDownloadUrl_1 = __importDefault(require("./RedisBinaryDownloadUrl"));
var RedisBinary_1 = require("./RedisBinary");
var https_proxy_agent_1 = require("https-proxy-agent");
var child_process_1 = require("child_process");
var util_1 = require("util");
require("./resolve-config");
var debug_1 = __importDefault(require("debug"));
var log = (0, debug_1.default)('RedisMS:RedisBinaryDownload');
/**
 * Download and extract the "redis-server" binary
 */
var RedisBinaryDownload = /** @class */ (function () {
    function RedisBinaryDownload(_a) {
        var downloadDir = _a.downloadDir, version = _a.version;
        this.version = version !== null && version !== void 0 ? version : RedisBinary_1.LATEST_VERSION;
        this.downloadDir = path_1.default.resolve(downloadDir || 'redis-download');
        this.dlProgress = {
            current: 0,
            length: 0,
            totalMb: 0,
            lastPrintedAt: 0,
        };
    }
    /**
     * Get the path of the already downloaded "redis-server" file
     * otherwise download it and then return the path
     */
    RedisBinaryDownload.prototype.getRedisServerPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var binaryName, redisServerPath, redisArchive, extractDir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        binaryName = process.platform === 'win32' ? 'redis-server.exe' : 'redis-server';
                        redisServerPath = path_1.default.resolve(this.downloadDir, this.version, binaryName);
                        return [4 /*yield*/, this.locationExists(redisServerPath)];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, redisServerPath];
                        }
                        return [4 /*yield*/, this.startDownload()];
                    case 2:
                        redisArchive = _a.sent();
                        return [4 /*yield*/, this.extract(redisArchive)];
                    case 3:
                        extractDir = _a.sent();
                        if (!(process.platform === 'win32')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.makeInstallWin32(extractDir)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.makeInstall(extractDir)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        fs_1.default.unlinkSync(redisArchive);
                        return [4 /*yield*/, this.locationExists(redisServerPath)];
                    case 8:
                        if (_a.sent()) {
                            return [2 /*return*/, redisServerPath];
                        }
                        throw new Error("Cannot find downloaded redis-server binary by path " + redisServerPath);
                }
            });
        });
    };
    /**
     * Download the Redis Archive
     * @returns The Redis Archive location
     */
    RedisBinaryDownload.prototype.startDownload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mbdUrl, downloadUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mbdUrl = new RedisBinaryDownloadUrl_1.default({
                            version: this.version,
                        });
                        if (!fs_1.default.existsSync(this.downloadDir)) {
                            fs_1.default.mkdirSync(this.downloadDir);
                        }
                        return [4 /*yield*/, mbdUrl.getDownloadUrl()];
                    case 1:
                        downloadUrl = _a.sent();
                        return [2 /*return*/, this.download(downloadUrl)];
                }
            });
        });
    };
    /**
     * Download file from downloadUrl
     * @param downloadUrl URL to download a File
     */
    RedisBinaryDownload.prototype.download = function (downloadUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var proxy, strictSsl, urlObject, downloadOptions, filename, downloadLocation, tempDownloadLocation, downloadedFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proxy = process.env['yarn_https-proxy'] ||
                            process.env.yarn_proxy ||
                            process.env['npm_config_https-proxy'] ||
                            process.env.npm_config_proxy ||
                            process.env.https_proxy ||
                            process.env.http_proxy ||
                            process.env.HTTPS_PROXY ||
                            process.env.HTTP_PROXY;
                        strictSsl = process.env.npm_config_strict_ssl === 'true';
                        urlObject = url_1.default.parse(downloadUrl);
                        if (!urlObject.hostname || !urlObject.path) {
                            throw new Error("Provided incorrect download url: " + downloadUrl);
                        }
                        downloadOptions = {
                            hostname: urlObject.hostname,
                            port: urlObject.port || '443',
                            path: urlObject.path,
                            method: 'GET',
                            rejectUnauthorized: strictSsl,
                            agent: proxy ? new https_proxy_agent_1.HttpsProxyAgent(proxy) : undefined,
                        };
                        filename = (urlObject.pathname || '').split('/').pop();
                        if (!filename) {
                            throw new Error("RedisBinaryDownload: missing filename for url " + downloadUrl);
                        }
                        downloadLocation = path_1.default.resolve(this.downloadDir, filename);
                        tempDownloadLocation = path_1.default.resolve(this.downloadDir, filename + ".downloading");
                        log("Downloading" + (proxy ? " via proxy " + proxy : '') + ": \"" + downloadUrl + "\"");
                        return [4 /*yield*/, this.locationExists(downloadLocation)];
                    case 1:
                        if (_a.sent()) {
                            log('Already downloaded archive found, skipping download');
                            return [2 /*return*/, downloadLocation];
                        }
                        this._downloadingUrl = downloadUrl;
                        return [4 /*yield*/, this.httpDownload(downloadOptions, downloadLocation, tempDownloadLocation)];
                    case 2:
                        downloadedFile = _a.sent();
                        return [2 /*return*/, downloadedFile];
                }
            });
        });
    };
    /**
     * Extract given Archive
     * @param redisArchive Archive location
     * @returns extracted directory location
     */
    RedisBinaryDownload.prototype.extract = function (redisArchive) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var extractDir;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        extractDir = path_1.default.resolve(this.downloadDir, this.version, 'extracted');
                        log("extract(): " + extractDir);
                        if (!fs_1.default.existsSync(extractDir)) {
                            fs_1.default.mkdirSync(extractDir, { recursive: true });
                        }
                        if (!redisArchive.endsWith('.zip')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.extractZip(redisArchive, extractDir)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!redisArchive.endsWith('.tar.gz')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.extractTarGz(redisArchive, extractDir)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new Error("RedisBinaryDownload: unsupported archive " + redisArchive + " (downloaded from " + ((_a = this._downloadingUrl) !== null && _a !== void 0 ? _a : 'unkown') + "). Broken archive from Redis Provider?");
                    case 5: return [2 /*return*/, extractDir];
                }
            });
        });
    };
    /**
     * Extract a .tar.gz archive
     * @param redisArchive Archive location
     * @param extractDir Directory to extract to
     */
    RedisBinaryDownload.prototype.extractTarGz = function (redisArchive, extractDir) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tar_1.default.extract({
                            file: redisArchive,
                            cwd: extractDir,
                            strip: 1,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Extract a .zip archive
     * @param redisArchive Archive location
     * @param extractDir Directory to extract to
     */
    RedisBinaryDownload.prototype.extractZip = function (redisArchive, extractDir) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, extract_zip_1.default)(redisArchive, { dir: extractDir })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Downlaod given httpOptions to tempDownloadLocation, then move it to downloadLocation
     * @param httpOptions The httpOptions directly passed to https.get
     * @param downloadLocation The location the File should be after the download
     * @param tempDownloadLocation The location the File should be while downloading
     */
    RedisBinaryDownload.prototype.httpDownload = function (httpOptions, downloadLocation, tempDownloadLocation) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var fileStream = fs_1.default.createWriteStream(tempDownloadLocation);
                        log("trying to download https://" + httpOptions.hostname + httpOptions.path);
                        var get = function () {
                            https_1.default
                                .get(httpOptions, function (response) {
                                // "as any" because otherwise the "agent" wouldnt match
                                if (response.statusCode != 200) {
                                    if (response.statusCode === 301 || response.statusCode === 302) {
                                        var urlObject = url_1.default.parse(response.headers.location);
                                        if (urlObject.hostname) {
                                            httpOptions.hostname = urlObject.hostname;
                                        }
                                        if (urlObject.port) {
                                            httpOptions.port = urlObject.port;
                                        }
                                        if (urlObject.path) {
                                            httpOptions.path = urlObject.path;
                                        }
                                        if (!urlObject.hostname || !urlObject.path) {
                                            return reject(new Error("Provided incorrect download url: " + response.headers.location));
                                        }
                                        return get();
                                    }
                                    if (response.statusCode === 404) {
                                        reject(new Error('Status Code is 404\n' +
                                            "This means that the requested version doesn't exist\n" +
                                            ("  Used Url: \"https://" + httpOptions.hostname + httpOptions.path + "\"\n") +
                                            "Try to use different version 'new RedisMemoryServer({ binary: { version: 'X.Y.Z' } })'\n"));
                                        return;
                                    }
                                    reject(new Error('Status Code isnt 200!'));
                                    return;
                                }
                                if (typeof response.headers['content-length'] != 'string') {
                                    reject(new Error('Response header "content-length" is empty!'));
                                    return;
                                }
                                _this.dlProgress.current = 0;
                                _this.dlProgress.length = parseInt(response.headers['content-length'], 10);
                                _this.dlProgress.totalMb = Math.round((_this.dlProgress.length / 1048576) * 10) / 10;
                                response.pipe(fileStream);
                                fileStream.on('finish', function () { return __awaiter(_this, void 0, void 0, function () {
                                    var downloadUrl;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (this.dlProgress.current < this.dlProgress.length) {
                                                    downloadUrl = this._downloadingUrl || "https://" + httpOptions.hostname + "/" + httpOptions.path;
                                                    reject(new Error("Too small (" + this.dlProgress.current + " bytes) redis-server binary downloaded from " + downloadUrl));
                                                    return [2 /*return*/];
                                                }
                                                fileStream.close();
                                                return [4 /*yield*/, (0, util_1.promisify)(fs_1.default.rename)(tempDownloadLocation, downloadLocation)];
                                            case 1:
                                                _a.sent();
                                                log("moved " + tempDownloadLocation + " to " + downloadLocation);
                                                resolve(downloadLocation);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                response.on('data', function (chunk) {
                                    _this.printDownloadProgress(chunk);
                                });
                            })
                                .on('error', function (e) {
                                // log it without having debug enabled
                                console.error("Couldnt download " + httpOptions.path + "!", e.message);
                                reject(e);
                            });
                        };
                        get();
                    })];
            });
        });
    };
    /**
     * Print the Download Progress to STDOUT
     * @param chunk A chunk to get the length
     */
    RedisBinaryDownload.prototype.printDownloadProgress = function (chunk) {
        this.dlProgress.current += chunk.length;
        var now = Date.now();
        if (now - this.dlProgress.lastPrintedAt < 2000) {
            return;
        }
        this.dlProgress.lastPrintedAt = now;
        var percentComplete = Math.round(((100.0 * this.dlProgress.current) / this.dlProgress.length) * 10) / 10;
        var mbComplete = Math.round((this.dlProgress.current / 1048576) * 10) / 10;
        var crReturn = '\r';
        var message = "Downloading Redis " + this.version + ": " + percentComplete + " % (" + mbComplete + "mb / " + this.dlProgress.totalMb + "mb)" + crReturn;
        if (process.stdout.isTTY) {
            // if TTY overwrite last line over and over until finished
            process.stdout.write(message);
        }
        else {
            console.log(message);
        }
    };
    /**
     * Make and install given extracted directory
     * @param extractDir Extracted directory location
     * @returns void
     */
    RedisBinaryDownload.prototype.makeInstall = function (extractDir) {
        return __awaiter(this, void 0, void 0, function () {
            var binaryName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        binaryName = 'redis-server';
                        log("makeInstall(): " + extractDir);
                        return [4 /*yield*/, (0, util_1.promisify)(child_process_1.exec)('make', {
                                cwd: extractDir,
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, util_1.promisify)(fs_1.default.copyFile)(path_1.default.resolve(extractDir, 'src', binaryName), path_1.default.resolve(extractDir, '..', binaryName))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, util_1.promisify)(rimraf_1.default)(extractDir)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * copy binary to parent folder and delete given extracted directory
     * @param extractDir Extracted directory location
     * @returns void
     */
    RedisBinaryDownload.prototype.makeInstallWin32 = function (extractDir) {
        return __awaiter(this, void 0, void 0, function () {
            var binaryName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        binaryName = 'redis-server.exe';
                        log("makeInstallWin32(): " + extractDir);
                        return [4 /*yield*/, (0, util_1.promisify)(fs_1.default.copyFile)(path_1.default.resolve(extractDir, '.', binaryName), path_1.default.resolve(extractDir, '..', binaryName))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, util_1.promisify)(rimraf_1.default)(extractDir)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Test if the location given is already used
     * Does *not* dereference links
     * @param location The Path to test
     */
    RedisBinaryDownload.prototype.locationExists = function (location) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, util_1.promisify)(fs_1.default.lstat)(location)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1.code !== 'ENOENT') {
                            throw e_1;
                        }
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RedisBinaryDownload;
}());
exports.default = RedisBinaryDownload;
//# sourceMappingURL=RedisBinaryDownload.js.map