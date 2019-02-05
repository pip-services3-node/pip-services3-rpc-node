import { IConfigurable } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { CompositeLogger } from 'pip-services3-components-node';
import { CompositeCounters } from 'pip-services3-components-node';
import { DependencyResolver } from 'pip-services3-commons-node';
export declare abstract class RestOperations implements IConfigurable, IReferenceable {
    protected _logger: CompositeLogger;
    protected _counters: CompositeCounters;
    protected _dependencyResolver: DependencyResolver;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    protected getCorrelationId(req: any): any;
    protected getFilterParams(req: any): FilterParams;
    protected getPagingParams(req: any): PagingParams;
    protected sendResult(req: any, res: any): (err: any, result: any) => void;
    protected sendEmptyResult(req: any, res: any): (err: any) => void;
    protected sendCreatedResult(req: any, res: any): (err: any, result: any) => void;
    protected sendDeletedResult(req: any, res: any): (err: any, result: any) => void;
    protected sendError(req: any, res: any, error: any): void;
    protected sendBadRequest(req: any, res: any, message: string): void;
    protected sendUnauthorized(req: any, res: any, message: string): void;
    protected sendNotFound(req: any, res: any, message: string): void;
    protected sendConflict(req: any, res: any, message: string): void;
    protected sendSessionExpired(req: any, res: any, message: string): void;
    protected sendInternalError(req: any, res: any, message: string): void;
    protected sendServerUnavailable(req: any, res: any, message: string): void;
    invoke(operation: string): (req: any, res: any) => void;
}