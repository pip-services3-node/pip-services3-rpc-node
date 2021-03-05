/** @module clients */
// const _ = require('lodash');
// const querystring = require('querystring');
// import { CommandableHttpClient } from './CommandableHttpClient';
// /**
//  * Abstract client that calls commandable REST service.
//  * 
//  * Commandable services are generated automatically for [[https://pip-services3-node.github.io/pip-services3-commons-node/interfaces/commands.icommandable.html ICommandable objects]].
//  * HTTP verb for each command is defined from the command name: get* - GET, update* - PUT, delete* or remove* - DELETE, and the rest are POST.
//  * 
//  * ### Configuration parameters ###
//  * 
//  * base_route:              base route for remote URI
//  * 
//  * - connection(s):           
//  *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
//  *   - protocol:              connection protocol: http or https
//  *   - host:                  host name or IP address
//  *   - port:                  port number
//  *   - uri:                   resource URI or connection string with all parameters in it
//  * - options:
//  *   - retries:               number of retries (default: 3)
//  *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
//  *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
//  * 
//  * ### References ###
//  * 
//  * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
//  * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
//  * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
//  * 
//  * ### Example ###
//  * 
//  *     class MyCommandableRestClient extends CommandableRestClient implements IMyClient {
//  *        ...
//  * 
//  *         public getData(correlationId: string, id: string, 
//  *            callback: (err: any, result: MyData) => void): void {
//  *        
//  *            this.callCommand(
//  *                "get_data",
//  *                correlationId,
//  *                { id: id },
//  *                (err, result) => {
//  *                    callback(err, result);
//  *                }
//  *             );        
//  *         }
//  *         ...
//  *     }
//  * 
//  *     let client = new MyCommandableRestClient();
//  *     client.configure(ConfigParams.fromTuples(
//  *         "connection.protocol", "http",
//  *         "connection.host", "localhost",
//  *         "connection.port", 8080
//  *     ));
//  * 
//  *     client.getData("123", "1", (err, result) => {
//  *     ...
//  *     });
//  */
// export class CommandableRestClient extends CommandableHttpClient {
//     /**
//      * Creates a new instance of the client.
//      * 
//      * @param baseRoute     a base route for remote service. 
//      */
//     public constructor(baseRoute: string) {
//         super(baseRoute);
//     }
//     /**
//      * Defines a HTTP verb for a given command.
//      * 
//      * @param command a command
//      * @returns an HTTP verb
//      */
//     protected defineCommandVerb(name: string): string {
//         name = name.toLowerCase();
//         if (name.startsWith('get'))
//             return 'get';
//         if (name.startsWith('update'))
//             return 'put';
//         if (name.startsWith('delete'))
//             return 'delete'
//         if (name.startsWith('remove'))
//             return 'delete'
//         return 'post';
//     }
//     /**
//      * Calls a remote method via HTTP commadable protocol.
//      * The call is made via POST operation and all parameters are sent in body object.
//      * The complete route to remote method is defined as baseRoute + "/" + name.
//      * 
//      * @param name              a name of the command to call. 
//      * @param correlationId     (optional) transaction id to trace execution through the call chain.
//      * @param params            command parameters.
//      * @param callback          callback function that receives result or error.
//      */
//     public callCommand(name: string, correlationId: string, params: any, callback: (err: any, result: any) => void): void {
//         let timing = this.instrument(correlationId, this._baseRoute + '.' + name);
//         let verb = this.defineCommandVerb(name);
//         params = params || {};
//         let queryParams = {};
//         // Define query parameters for GET and DELETE
//         if (verb == 'get' || verb == 'delete') {
//             for (let param in params) {
//                 if (params.hasOwnProperty(param)) {
//                     let value = params[param];
//                     // Flatten objects for FilterParams and PagingParams
//                     // Todo: How to pass sorting and projection parameters in the query?
//                     if (_.isObject(value)) {
//                         for (let param in value) {
//                          if (value.hasOwnProperty(param))
//                             queryParams[param] = value[param];
//                         }
//                     } else {
//                         queryParams[param] = value;
//                     }
//                 }
//             }
//             params = {};
//         }
//         this.call(verb, name,
//             correlationId,
//             queryParams,
//             params,
//             (err, result) => {
//                 timing.endTiming();
//                 this.instrumentError(correlationId, this._baseRoute + '.' + name, err, result, callback);
//             }
//         );
//     }    
// }
//# sourceMappingURL=CommandableRestClient.js.map