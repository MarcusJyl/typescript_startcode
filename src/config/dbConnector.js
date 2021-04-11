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
exports.__esModule = true;
exports.InMemoryDbConnector = exports.DbConnector = void 0;
var mongodb_1 = require("mongodb");
var mongodb_memory_server_1 = require("mongodb-memory-server");
/**
 *  Connector which you should use for developement and production
 *  Connection String must be given via process.env.CONNECTION
 */
var DbConnector = /** @class */ (function () {
    function DbConnector() {
    }
    DbConnector.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var uri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (DbConnector.client) {
                            return [2 /*return*/, DbConnector.client];
                        }
                        uri = process.env.CONNECTION;
                        if (uri === undefined) {
                            throw new Error("NO Database Connection available");
                        }
                        DbConnector.client = new mongodb_1.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                        return [4 /*yield*/, DbConnector.client.connect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, DbConnector.client];
                }
            });
        });
    };
    DbConnector.close = function () {
        if (DbConnector.client) {
            DbConnector.client.close();
            DbConnector.client = null;
        }
    };
    return DbConnector;
}());
exports.DbConnector = DbConnector;
/**
 * In-memory MongoDB which you should use for testing
 */
var InMemoryDbConnector = /** @class */ (function () {
    function InMemoryDbConnector() {
    }
    InMemoryDbConnector.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mongod, uri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (InMemoryDbConnector.client) {
                            return [2 /*return*/, InMemoryDbConnector.client];
                        }
                        mongod = new mongodb_memory_server_1.MongoMemoryServer();
                        return [4 /*yield*/, mongod.getUri()];
                    case 1:
                        uri = _a.sent();
                        InMemoryDbConnector.client = new mongodb_1.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                        return [4 /*yield*/, InMemoryDbConnector.client.connect()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, InMemoryDbConnector.client];
                }
            });
        });
    };
    return InMemoryDbConnector;
}());
exports.InMemoryDbConnector = InMemoryDbConnector;
