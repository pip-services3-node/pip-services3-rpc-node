/** @module services */
// let _ = require('lodash');

// import { ICommandable } from 'pip-services3-commons-node';
// import { ICommand } from 'pip-services3-commons-node';
// import { CommandSet } from 'pip-services3-commons-node';
// import { Parameters } from 'pip-services3-commons-node';

// import { CommandableHttpService } from './CommandableHttpService';

// /**
//  * Abstract service that receives remove calls via REST protocol
//  * to operations automatically generated for commands defined in [[https://pip-services3-node.github.io/pip-services3-commons-node/interfaces/commands.icommandable.html ICommandable components]].
//  * HTTP verb for each command is defined from the command name: get* - GET, update* - PUT, delete* or remove* - DELETE, and the rest are POST.
//  * 
//  * Commandable services require only 3 lines of code to implement a robust external
//  * RESTful remote interface.
//  * 
//  * ### Configuration parameters ###
//  * 
//  * - base_route:              base route for remote URI
//  * - dependencies:
//  *   - endpoint:              override for HTTP Endpoint dependency
//  *   - controller:            override for Controller dependency
//  * - connection(s):           
//  *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
//  *   - protocol:              connection protocol: http or https
//  *   - host:                  host name or IP address
//  *   - port:                  port number
//  *   - uri:                   resource URI or connection string with all parameters in it
//  * 
//  * ### References ###
//  * 
//  * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
//  * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
//  * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
//  * - <code>\*:endpoint:http:\*:1.0</code>          (optional) [[HttpEndpoint]] reference
//  * 
//  * @see [[CommandableRestClient]]
//  * @see [[RestService]]
//  * 
//  * ### Example ###
//  * 
//  *     class MyCommandableRestService extends CommandableRestService {
//  *        public constructor() {
//  *           base();
//  *           this._dependencyResolver.put(
//  *               "controller",
//  *               new Descriptor("mygroup","controller","*","*","1.0")
//  *           );
//  *        }
//  *     }
//  * 
//  *     let service = new MyCommandableRestService();
//  *     service.configure(ConfigParams.fromTuples(
//  *         "connection.protocol", "http",
//  *         "connection.host", "localhost",
//  *         "connection.port", 8080
//  *     ));
//  *     service.setReferences(References.fromTuples(
//  *        new Descriptor("mygroup","controller","default","default","1.0"), controller
//  *     ));
//  * 
//  *     service.open("123", (err) => {
//  *        console.log("The REST service is running on port 8080");
//  *     });
//  */

//  export class CommandableRestService extends CommandableHttpService {
//     /**
//      * Creates a new instance of the service.
//      * 
//      * @param baseRoute a service base route.
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
//     private defineCommandVerb(command: ICommand): string {
//         let name = command.getName().toLowerCase();
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
//      * Registers all service routes in HTTP endpoint.
//      */
//     public register(): void {
//         let controller: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('controller');
//         this._commandSet = controller.getCommandSet();

//         let commands = this._commandSet.getCommands();
//         for (let index = 0; index < commands.length; index++) {
//             let command = commands[index];

//             let route = command.getName();
//             route = route[0] != '/' ? '/' + route : route;
//             let verb = this.defineCommandVerb(command);

//             this.registerRoute(verb, route, null, (req, res) => {
//                 // Accept parameters from body or query
//                 let params = _.assign(req.body, req.query);
//                 let correlationId = req.query.correlation_id;
//                 let args = Parameters.fromValue(params);
//                 let timing = this.instrument(correlationId, this._baseRoute + '.' + command.getName());

//                 command.execute(correlationId, args, (err, result) => {
//                     timing.endTiming();
//                     this.instrumentError(correlationId,
//                         this._baseRoute + '.' + command.getName(),
//                         err, result, this.sendResult(req, res));
//                 })
//             });
//         }
//     }

// }
