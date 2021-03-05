/** @module clients */
import { RestClient } from './RestClient';
/**
 * Abstract client that calls commandable HTTP service.
 *
 * Commandable services are generated automatically for [[https://pip-services3-node.github.io/pip-services3-commons-node/interfaces/commands.icommandable.html ICommandable objects]].
 * Each command is exposed as POST operation that receives all parameters
 * in body object.
 *
 * ### Configuration parameters ###
 *
 * base_route:              base route for remote URI
 *
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
 * ### Example ###
 *
 *     class MyCommandableHttpClient extends CommandableHttpClient implements IMyClient {
 *        ...
 *
 *         public getData(correlationId: string, id: string,
 *            callback: (err: any, result: MyData) => void): void {
 *
 *            this.callCommand(
 *                "get_data",
 *                correlationId,
 *                { id: id },
 *                (err, result) => {
 *                    callback(err, result);
 *                }
 *             );
 *         }
 *         ...
 *     }
 *
 *     let client = new MyCommandableHttpClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *
 *     client.getData("123", "1", (err, result) => {
 *     ...
 *     });
 */
export declare class CommandableHttpClient extends RestClient {
    /**
     * Creates a new instance of the client.
     *
     * @param baseRoute     a base route for remote service.
     */
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
