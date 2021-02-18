"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandableHttpService = void 0;
/** @module services */
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const RestService_1 = require("./RestService");
const CommandableSwaggerDocument_1 = require("./CommandableSwaggerDocument");
/**
 * Abstract service that receives remove calls via HTTP protocol
 * to operations automatically generated for commands defined in [[https://pip-services3-node.github.io/pip-services3-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as POST operation that receives all parameters in body object.
 *
 * Commandable services require only 3 lines of code to implement a robust external
 * HTTP-based remote interface.
 *
 * ### Configuration parameters ###
 *
 * - base_route:              base route for remote URI
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
 *   - controller:            override for Controller dependency
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:endpoint:http:\*:1.0</code>          (optional) [[HttpEndpoint]] reference
 *
 * @see [[CommandableHttpClient]]
 * @see [[RestService]]
 *
 * ### Example ###
 *
 *     class MyCommandableHttpService extends CommandableHttpService {
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let service = new MyCommandableHttpService();
 *     service.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 *
 *     service.open("123", (err) => {
 *        console.log("The REST service is running on port 8080");
 *     });
 */
class CommandableHttpService extends RestService_1.RestService {
    /**
     * Creates a new instance of the service.
     *
     * @param baseRoute a service base route.
     */
    constructor(baseRoute) {
        super();
        this._swaggerAuto = true;
        this._baseRoute = baseRoute;
        this._dependencyResolver.put('controller', 'none');
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._swaggerAuto = config.getAsBooleanWithDefault("swagger.auto", this._swaggerAuto);
    }
    /**
     * Registers all service routes in HTTP endpoint.
     */
    register() {
        let controller = this._dependencyResolver.getOneRequired('controller');
        this._commandSet = controller.getCommandSet();
        let commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            let command = commands[index];
            let route = command.getName();
            route = route[0] != '/' ? '/' + route : route;
            this.registerRoute('post', route, null, (req, res) => {
                let params = req.body || {};
                let correlationId = req.query.correlation_id;
                let args = pip_services3_commons_node_1.Parameters.fromValue(params);
                let timing = this.instrument(correlationId, this._baseRoute + '.' + command.getName());
                command.execute(correlationId, args, (err, result) => {
                    timing.endTiming();
                    this.instrumentError(correlationId, this._baseRoute + '.' + command.getName(), err, result, this.sendResult(req, res));
                });
            });
        }
        if (this._swaggerAuto) {
            var swaggerConfig = this._config.getSection("swagger");
            var doc = new CommandableSwaggerDocument_1.CommandableSwaggerDocument(this._baseRoute, swaggerConfig, commands);
            this.registerOpenApiSpec(doc.toString());
        }
    }
}
exports.CommandableHttpService = CommandableHttpService;
//# sourceMappingURL=CommandableHttpService.js.map