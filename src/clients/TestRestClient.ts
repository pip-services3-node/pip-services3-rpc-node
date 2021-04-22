/** @module clients */

import { RestClient } from './RestClient';

/**
 * Provides a Rest client for automated tests
 */
export class TestRestClient extends RestClient {
 
    public constructor(baseRoute: string) {
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
    public call(method: string, route: string, correlationId?: string, params: any = {}, data?: any,
        callback?: (err: any, result: any) => void): void {
        super.call(method, route, correlationId, params, data, callback);
    }

}