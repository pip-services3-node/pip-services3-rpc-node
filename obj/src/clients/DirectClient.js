"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectClient = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_components_node_2 = require("pip-services3-components-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
/**
 * Abstract client that calls controller directly in the same memory space.
 *
 * It is used when multiple microservices are deployed in a single container (monolyth)
 * and communication between them can be done by direct calls rather then through
 * the network.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - controller:            override controller descriptor
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>       (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:controller:\*:\*:1.0</code>     controller to call business methods
 *
 * ### Example ###
 *
 *     class MyDirectClient extends DirectClient<IMyController> implements IMyClient {
 *
 *         public constructor() {
 *           super();
 *           this._dependencyResolver.put('controller', new Descriptor(
 *               "mygroup", "controller", "*", "*", "*"));
 *         }
 *         ...
 *
 *         public getData(correlationId: string, id: string,
 *           callback: (err: any, result: MyData) => void): void {
 *
 *           let timing = this.instrument(correlationId, 'myclient.get_data');
 *           this._controller.getData(correlationId, id, (err, result) => {
 *              timing.endTiming();
 *              this.instrumentError(correlationId, 'myclient.get_data', err, result, callback);
 *           });
 *         }
 *         ...
 *     }
 *
 *     let client = new MyDirectClient();
 *     client.setReferences(References.fromTuples(
 *         new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 *
 *     client.getData("123", "1", (err, result) => {
 *       ...
 *     });
 */
class DirectClient {
    /**
     * Creates a new instance of the client.
     */
    constructor() {
        /**
         * The open flag.
         */
        this._opened = true;
        /**
         * The logger.
         */
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        /**
         * The performance counters
         */
        this._counters = new pip_services3_components_node_2.CompositeCounters();
        /**
         * The dependency resolver to get controller reference.
         */
        this._dependencyResolver = new pip_services3_commons_node_1.DependencyResolver();
        this._dependencyResolver.put('controller', 'none');
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired('controller');
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a CounterTiming object that is used to end the time measurement.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns CounterTiming object to end the time measurement.
     */
    instrument(correlationId, name) {
        this._logger.trace(correlationId, "Calling %s method", name);
        this._counters.incrementOne(name + '.call_count');
        return this._counters.beginTiming(name + ".call_time");
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
            this._logger.error(correlationId, err, "Failed to call %s method", name);
            this._counters.incrementOne(name + '.call_errors');
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
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId, callback) {
        if (this._opened) {
            callback(null);
            return;
        }
        if (this._controller == null) {
            let err = new pip_services3_commons_node_2.ConnectionException(correlationId, 'NO_CONTROLLER', 'Controller reference is missing');
            if (callback) {
                callback(err);
                return;
            }
            else {
                throw err;
            }
        }
        this._opened = true;
        this._logger.info(correlationId, "Opened direct client");
        callback(null);
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId, callback) {
        if (this._opened)
            this._logger.info(correlationId, "Closed direct client");
        this._opened = false;
        callback(null);
    }
}
exports.DirectClient = DirectClient;
//# sourceMappingURL=DirectClient.js.map