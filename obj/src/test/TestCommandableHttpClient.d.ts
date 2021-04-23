/** @module clients */
import { CommandableHttpClient } from '../clients/CommandableHttpClient';
/**
 * Provides a commandable HTTP client for automated tests
 */
export declare class TestCommandableHttpClient extends CommandableHttpClient {
    constructor(baseRoute: string);
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
    callCommand(name: string, correlationId: string, params: any, callback: (err: any, result: any) => void): void;
}
