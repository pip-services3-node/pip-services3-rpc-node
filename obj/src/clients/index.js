"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCommandableHttpClient = exports.TestRestClient = exports.CommandableHttpClient = exports.RestClient = exports.DirectClient = void 0;
/**
 * @module clients
 * @preferred
 */
var DirectClient_1 = require("./DirectClient");
Object.defineProperty(exports, "DirectClient", { enumerable: true, get: function () { return DirectClient_1.DirectClient; } });
var RestClient_1 = require("./RestClient");
Object.defineProperty(exports, "RestClient", { enumerable: true, get: function () { return RestClient_1.RestClient; } });
var CommandableHttpClient_1 = require("./CommandableHttpClient");
Object.defineProperty(exports, "CommandableHttpClient", { enumerable: true, get: function () { return CommandableHttpClient_1.CommandableHttpClient; } });
// export { CommandableRestClient } from './CommandableRestClient';
var TestRestClient_1 = require("./TestRestClient");
Object.defineProperty(exports, "TestRestClient", { enumerable: true, get: function () { return TestRestClient_1.TestRestClient; } });
var TestCommandableHttpClient_1 = require("./TestCommandableHttpClient");
Object.defineProperty(exports, "TestCommandableHttpClient", { enumerable: true, get: function () { return TestCommandableHttpClient_1.TestCommandableHttpClient; } });
//# sourceMappingURL=index.js.map