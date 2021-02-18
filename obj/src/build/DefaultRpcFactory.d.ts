/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
/**
 * Creates RPC components by their descriptors.
 *
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/build.factory.html Factory]]
 * @see [[HttpEndpoint]]
 * @see [[HeartbeatRestService]]
 * @see [[StatusRestService]]
 */
export declare class DefaultRpcFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly HttpEndpointDescriptor: Descriptor;
    static readonly StatusServiceDescriptor: Descriptor;
    static readonly HeartbeatServiceDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
