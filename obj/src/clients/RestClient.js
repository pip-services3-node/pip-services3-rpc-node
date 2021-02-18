"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestClient = void 0;
/** @module clients */
/** @hidden */
let _ = require('lodash');
/** @hidden */
let querystring = require('querystring');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_components_node_2 = require("pip-services3-components-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const HttpConnectionResolver_1 = require("../connect/HttpConnectionResolver");
/**
 * Abstract client that calls remove endpoints using HTTP/REST protocol.
 *
 * ### Configuration parameters ###
 *
 * - base_route:              base route for remote URI
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * @see [[RestService]]
 * @see [[CommandableHttpService]]
 *
 * ### Example ###
 *
 *     class MyRestClient extends RestClient implements IMyClient {
 *        ...
 *
 *        public getData(correlationId: string, id: string,
 *            callback: (err: any, result: MyData) => void): void {
 *
 *            let timing = this.instrument(correlationId, 'myclient.get_data');
 *            this.call("get", "/get_data" correlationId, { id: id }, null, (err, result) => {
 *                timing.endTiming();
 *                callback(err, result);
 *            });
 *        }
 *        ...
 *     }
 *
 *     let client = new MyRestClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *
 *     client.getData("123", "1", (err, result) => {
 *       ...
 *     });
 */
class RestClient {
    constructor() {
        /**
         * The connection resolver.
         */
        this._connectionResolver = new HttpConnectionResolver_1.HttpConnectionResolver();
        /**
         * The logger.
         */
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        /**
         * The performance counters.
         */
        this._counters = new pip_services3_components_node_2.CompositeCounters();
        /**
         * The configuration options.
         */
        this._options = new pip_services3_commons_node_1.ConfigParams();
        /**
         * The number of retries.
         */
        this._retries = 1;
        /**
         * The default headers to be added to every request.
         */
        this._headers = {};
        /**
         * The connection timeout in milliseconds.
         */
        this._connectTimeout = 10000;
        /**
         * The invocation timeout in milliseconds.
         */
        this._timeout = 10000;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(RestClient._defaultConfig);
        this._connectionResolver.configure(config);
        this._options = this._options.override(config.getSection("options"));
        this._retries = config.getAsIntegerWithDefault("options.retries", this._retries);
        this._connectTimeout = config.getAsIntegerWithDefault("options.connect_timeout", this._connectTimeout);
        this._timeout = config.getAsIntegerWithDefault("options.timeout", this._timeout);
        this._baseRoute = config.getAsStringWithDefault("base_route", this._baseRoute);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._connectionResolver.setReferences(references);
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    instrument(correlationId, name) {
        const typeName = this.constructor.name || "unknown-target";
        this._logger.trace(correlationId, "Calling %s method of %s", name, typeName);
        this._counters.incrementOne(typeName + "." + name + '.call_count');
        return this._counters.beginTiming(typeName + "." + name + ".call_time");
    }
    /**
     * Adds instrumentation to error handling.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @param err               an occured error
     * @param result            (optional) an execution result
     * @param callback          (optional) an execution callback
     */
    instrumentError(correlationId, name, err, result = null, callback = null) {
        if (err != null) {
            const typeName = this.constructor.name || "unknown-target";
            this._logger.error(correlationId, err, "Failed to call %s method of %s", name, typeName);
            this._counters.incrementOne(typeName + "." + name + '.call_errors');
        }
        if (callback)
            callback(err, result);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._client != null;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId, callback) {
        if (this.isOpen()) {
            if (callback)
                callback(null);
            return;
        }
        this._connectionResolver.resolve(correlationId, (err, connection) => {
            if (err) {
                if (callback)
                    callback(err);
                return;
            }
            try {
                this._uri = connection.getUri();
                let restify = require('restify-clients');
                this._client = restify.createJsonClient({
                    url: this._uri,
                    connectTimeout: this._connectTimeout,
                    requestTimeout: this._timeout,
                    headers: this._headers,
                    retry: {
                        minTimeout: this._timeout,
                        maxTimeout: Infinity,
                        retries: this._retries
                    },
                    version: '*'
                });
                this._logger.debug(correlationId, "Connected via REST to %s", this._uri);
                if (callback)
                    callback(null);
            }
            catch (err) {
                this._client = null;
                let ex = new pip_services3_commons_node_3.ConnectionException(correlationId, "CANNOT_CONNECT", "Connection to REST service failed")
                    .wrap(err).withDetails("url", this._uri);
                if (callback)
                    callback(ex);
            }
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId, callback) {
        if (this._client != null) {
            // Eat exceptions
            try {
                this._logger.debug(correlationId, "Closed REST service at %s", this._uri);
            }
            catch (ex) {
                this._logger.warn(correlationId, "Failed while closing REST service: %s", ex);
            }
            this._client = null;
            this._uri = null;
        }
        if (callback)
            callback(null);
    }
    /**
     * Adds a correlation id (correlation_id) to invocation parameter map.
     *
     * @param params            invocation parameters.
     * @param correlationId     (optional) a correlation id to be added.
     * @returns invocation parameters with added correlation id.
     */
    addCorrelationId(params, correlationId) {
        // Automatically generate short ids for now
        if (correlationId == null)
            //correlationId = IdGenerator.nextShort();
            return params;
        params = params || {};
        params.correlation_id = correlationId;
        return params;
    }
    /**
     * Adds filter parameters (with the same name as they defined)
     * to invocation parameter map.
     *
     * @param params        invocation parameters.
     * @param filter        (optional) filter parameters
     * @returns invocation parameters with added filter parameters.
     */
    addFilterParams(params, filter) {
        params = params || {};
        if (filter) {
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop))
                    params[prop] = filter[prop];
            }
        }
        return params;
    }
    /**
     * Adds paging parameters (skip, take, total) to invocation parameter map.
     *
     * @param params        invocation parameters.
     * @param paging        (optional) paging parameters
     * @returns invocation parameters with added paging parameters.
     */
    addPagingParams(params, paging) {
        params = params || {};
        if (paging) {
            if (paging.total)
                params.total = paging.total;
            if (paging.skip)
                params.skip = paging.skip;
            if (paging.take)
                params.take = paging.take;
        }
        return params;
    }
    createRequestRoute(route) {
        let builder = "";
        if (this._baseRoute != null && this._baseRoute.length > 0) {
            if (this._baseRoute[0] != "/")
                builder += "/";
            builder += this._baseRoute;
        }
        if (route[0] != "/")
            builder += "/";
        builder += route;
        return builder;
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
        method = method.toLowerCase();
        if (_.isFunction(data)) {
            callback = data;
            data = {};
        }
        route = this.createRequestRoute(route);
        params = this.addCorrelationId(params, correlationId);
        if (!_.isEmpty(params))
            route += '?' + querystring.stringify(params);
        let self = this;
        let action = null;
        if (callback) {
            action = (err, req, res, data) => {
                // Handling 204 codes
                if (res && res.statusCode == 204)
                    callback.call(self, null, null);
                else if (err == null)
                    callback.call(self, null, data);
                else {
                    // Restore application exception
                    if (data != null)
                        err = pip_services3_commons_node_2.ApplicationExceptionFactory.create(data).withCause(err);
                    callback.call(self, err, null);
                }
            };
        }
        if (method == 'get')
            this._client.get(route, action);
        else if (method == 'head')
            this._client.head(route, action);
        else if (method == 'post')
            this._client.post(route, data, action);
        else if (method == 'put')
            this._client.put(route, data, action);
        else if (method == 'delete')
            this._client.del(route, action);
        else {
            let error = new pip_services3_commons_node_4.UnknownException(correlationId, 'UNSUPPORTED_METHOD', 'Method is not supported by REST client')
                .withDetails('verb', method);
            if (callback)
                callback(error, null);
            else
                throw error;
        }
    }
}
exports.RestClient = RestClient;
RestClient._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "0.0.0.0", "connection.port", 3000, "options.request_max_size", 1024 * 1024, "options.connect_timeout", 10000, "options.timeout", 10000, "options.retries", 3, "options.debug", true);
//# sourceMappingURL=RestClient.js.map