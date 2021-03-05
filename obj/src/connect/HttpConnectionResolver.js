"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpConnectionResolver = void 0;
/** @module connect */
/** @hidden */
let url = require('url');
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_components_node_2 = require("pip-services3-components-node");
const pip_services3_components_node_3 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
/**
 * Helper class to retrieve connections for HTTP-based services abd clients.
 *
 * In addition to regular functions of ConnectionResolver is able to parse http:// URIs
 * and validate connection parameters before returning them.
 *
 * ### Configuration parameters ###
 *
 * - connection:
 *   - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - ...                          other connection parameters
 *
 * - connections:                   alternative to connection
 *   - [connection params 1]:       first connection parameters
 *   -  ...
 *   - [connection params N]:       Nth connection parameters
 *   -  ...
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 *
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/connect.connectionparams.html ConnectionParams]]
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/connect.connectionresolver.html ConnectionResolver]]
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *          "connection.host", "10.1.1.100",
 *          "connection.port", 8080
 *     );
 *
 *     let connectionResolver = new HttpConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *
 *     connectionResolver.resolve("123", (err, connection) => {
 *          // Now use connection...
 *     });
 */
class HttpConnectionResolver {
    constructor() {
        /**
         * The base connection resolver.
         */
        this._connectionResolver = new pip_services3_components_node_1.ConnectionResolver();
        /**
         * The base credential resolver.
         */
        this._credentialResolver = new pip_services3_components_node_2.CredentialResolver();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }
    validateConnection(correlationId, connection, credential) {
        if (connection == null)
            return new pip_services3_commons_node_1.ConfigException(correlationId, "NO_CONNECTION", "HTTP connection is not set");
        let uri = connection.getUri();
        if (uri != null)
            return null;
        let protocol = connection.getProtocol("http");
        if ("http" != protocol && "https" != protocol) {
            return new pip_services3_commons_node_1.ConfigException(correlationId, "WRONG_PROTOCOL", "Protocol is not supported by REST connection")
                .withDetails("protocol", protocol);
        }
        let host = connection.getHost();
        if (host == null)
            return new pip_services3_commons_node_1.ConfigException(correlationId, "NO_HOST", "Connection host is not set");
        let port = connection.getPort();
        if (port == 0)
            return new pip_services3_commons_node_1.ConfigException(correlationId, "NO_PORT", "Connection port is not set");
        // Check HTTPS credentials
        if (protocol == "https") {
            // Check for credential
            if (credential == null) {
                return new pip_services3_commons_node_1.ConfigException(correlationId, "NO_CREDENTIAL", "SSL certificates are not configured for HTTPS protocol");
            }
            else {
                // Sometimes when we use https we are on an internal network and do not want to have to deal with security.
                // When we need a https connection and we don't want to pass credentials, flag is 'credential.internal_network',
                // this flag just has to be present and non null for this functionality to work.
                if (credential.getAsNullableString("internal_network") == null) {
                    if (credential.getAsNullableString('ssl_key_file') == null) {
                        return new pip_services3_commons_node_1.ConfigException(correlationId, "NO_SSL_KEY_FILE", "SSL key file is not configured in credentials");
                    }
                    else if (credential.getAsNullableString('ssl_crt_file') == null) {
                        return new pip_services3_commons_node_1.ConfigException(correlationId, "NO_SSL_CRT_FILE", "SSL crt file is not configured in credentials");
                    }
                }
            }
        }
        return null;
    }
    updateConnection(connection, credential) {
        if (connection == null)
            return;
        let uri = connection.getUri();
        if (uri == null || uri == "") {
            let protocol = connection.getProtocol('http');
            let host = connection.getHost();
            let port = connection.getPort();
            uri = protocol + "://" + host;
            if (port != 0)
                uri += ':' + port;
            connection.setUri(uri);
        }
        else {
            let address = url.parse(uri);
            let protocol = ("" + address.protocol).replace(':', '');
            connection.setProtocol(protocol);
            connection.setHost(address.hostname);
            connection.setPort(address.port);
        }
        if (connection.getProtocol() == "https") {
            connection.addSection("credential", credential.getAsNullableString("internal_network") == null ? credential : new pip_services3_components_node_3.CredentialParams());
        }
        else {
            connection.addSection("credential", new pip_services3_components_node_3.CredentialParams());
        }
    }
    /**
     * Resolves a single component connection. If connections are configured to be retrieved
     * from Discovery service it finds a IDiscovery and resolves the connection there.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives resolved connection or error.
     */
    resolve(correlationId, callback) {
        this._connectionResolver.resolve(correlationId, (err, connection) => {
            if (err) {
                callback(err, null, null);
                return;
            }
            this._credentialResolver.lookup(correlationId, (err, credential) => {
                if (err == null) {
                    err = this.validateConnection(correlationId, connection, credential);
                }
                if (err == null && connection != null) {
                    this.updateConnection(connection, credential);
                }
                callback(err, connection, credential);
            });
        });
    }
    /**
     * Resolves all component connection. If connections are configured to be retrieved
     * from Discovery service it finds a IDiscovery and resolves the connection there.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives resolved connections or error.
     */
    resolveAll(correlationId, callback) {
        this._connectionResolver.resolveAll(correlationId, (err, connections) => {
            if (err) {
                callback(err, null, null);
                return;
            }
            this._credentialResolver.lookup(correlationId, (err, credential) => {
                connections = connections || [];
                for (let connection of connections) {
                    if (err == null) {
                        err = this.validateConnection(correlationId, connection, credential);
                    }
                    if (err == null && connection != null) {
                        this.updateConnection(connection, credential);
                    }
                }
                callback(err, connections, credential);
            });
        });
    }
    /**
     * Registers the given connection in all referenced discovery services.
     * This method can be used for dynamic service discovery.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param connection        a connection to register.
     * @param callback          callback function that receives registered connection or error.
     */
    register(correlationId, callback) {
        this._connectionResolver.resolve(correlationId, (err, connection) => {
            if (err) {
                callback(err);
                return;
            }
            this._credentialResolver.lookup(correlationId, (err, credential) => {
                // Validate connection
                if (err == null)
                    err = this.validateConnection(correlationId, connection, credential);
                if (err == null)
                    this._connectionResolver.register(correlationId, connection, callback);
                else
                    callback(err);
            });
        });
    }
}
exports.HttpConnectionResolver = HttpConnectionResolver;
//# sourceMappingURL=HttpConnectionResolver.js.map