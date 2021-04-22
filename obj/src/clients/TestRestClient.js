"use strict";
/** @module clients */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRestClient = void 0;
const RestClient_1 = require("./RestClient");
/**
 * Provides a Rest client for automated tests
 */
class TestRestClient extends RestClient_1.RestClient {
    constructor(baseRoute) {
        super();
        this._baseRoute = baseRoute;
    }
    /**
     * Calls a remote method via HTTP/REST protocol.
     *
     * @param method            HTTP method: "get", "head", "post", "put", "delete"
     * @param route             a command route. Base route will be added to this route
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param params            (optional) query parameters.
     * @param data              (optional) body object.
     * @param callback          (optional) callback function that receives result object or error.
     */
    call(method, route, correlationId, params = {}, data, callback) {
        super.call(method, route, correlationId, params, data, callback);
    }
}
exports.TestRestClient = TestRestClient;
//# sourceMappingURL=TestRestClient.js.map