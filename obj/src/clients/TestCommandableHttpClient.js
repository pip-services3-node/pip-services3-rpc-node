"use strict";
/** @module clients */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCommandableHttpClient = void 0;
const CommandableHttpClient_1 = require("./CommandableHttpClient");
/**
 * Provides a commandable HTTP client for automated tests
 */
class TestCommandableHttpClient extends CommandableHttpClient_1.CommandableHttpClient {
    constructor(baseRoute) {
        super(baseRoute);
    }
    /**
     * Calls a remote method via HTTP commadable protocol.
     * The call is made via POST operation and all parameters are sent in body object.
     * The complete route to remote method is defined as baseRoute + "/" + name.
     *
     * @param name              a name of the command to call.
     * @param correlationId     (optional) transaction id to trace execution through the call chain.
     * @param params            command parameters.
     * @param callback          callback function that receives result or error.
     */
    callCommand(name, correlationId, params, callback) {
        super.callCommand(name, correlationId, params, callback);
    }
}
exports.TestCommandableHttpClient = TestCommandableHttpClient;
//# sourceMappingURL=TestCommandableHttpClient.js.map