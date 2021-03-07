import { IReferences } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';

import { DummySchema } from '../DummySchema';
import { RestService } from '../../src/services/RestService';
import { IDummyController } from '../IDummyController';

export class DummyRestService extends RestService {
    private _controller: IDummyController;
    private _numberOfCalls: number = 0;
    private _openApiContent: string;
    private _openApiFile: string;

    public constructor() {
        super();
        this._dependencyResolver.put('controller', new Descriptor("pip-services-dummies", "controller", "default", "*", "*"));
    }

    public configure(config: ConfigParams): void {
        super.configure(config);

        this._openApiContent = config.getAsNullableString("openapi_content");
        this._openApiFile = config.getAsNullableString("openapi_file");
    }

	public setReferences(references: IReferences): void {
		super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IDummyController>('controller');
    }
    
    public getNumberOfCalls(): number {
        return this._numberOfCalls;
    }

    private incrementNumberOfCalls(req: any, res: any, next: () => void) {
        this._numberOfCalls++;
        next();
    }

    private getPageByFilter(req: any, res: any) {
        this._controller.getPageByFilter(
            this.getCorrelationId(req),
            new FilterParams(req.params),
            new PagingParams(req.params),
            this.sendResult(req, res)
        );
    }

    private getOneById(req, res) {
        this._controller.getOneById(
            this.getCorrelationId(req),
            req.params.dummy_id,
            this.sendResult(req, res)
        );
    }

    private create(req, res) {
        this._controller.create(
            this.getCorrelationId(req),
            req.body,
            this.sendCreatedResult(req, res)
        );
    }

    private update(req, res) {
        this._controller.update(
            this.getCorrelationId(req),
            req.body,
            this.sendResult(req, res)
        );
    }

    private deleteById(req, res) {
        this._controller.deleteById(
            this.getCorrelationId(req),
            req.params.dummy_id,
            this.sendDeletedResult(req, res)
        );
    }    

    private checkCorrelationId(req, res) {
        this._controller.checkCorrelationId(this.getCorrelationId(req), this.sendResult(req, res));
    }
        
    public register() {
        this.registerInterceptor('/dummies', this.incrementNumberOfCalls);

        this.registerRoute(
            'get', '/dummies', 
            new ObjectSchema(true)
                .withOptionalProperty("skip", TypeCode.String)
                .withOptionalProperty("take", TypeCode.String)
                .withOptionalProperty("total", TypeCode.String)
                .withOptionalProperty("body", new FilterParamsSchema()),
            this.getPageByFilter
        );

        this.registerRoute(
            "get", "/dummies/check/correlation_id",
            new ObjectSchema(true),
            this.checkCorrelationId,
        )

        this.registerRoute(
            'get', '/dummies/:dummy_id', 
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
            this.getOneById
        );

        this.registerRoute(
            'post', '/dummies', 
            new ObjectSchema(true)
                .withRequiredProperty("body", new DummySchema()),
            this.create
        );

        this.registerRoute(
            'put', '/dummies', 
            new ObjectSchema(true)
                .withRequiredProperty("body", new DummySchema()),
            this.update
        );

        this.registerRoute(
            'delete', '/dummies/:dummy_id', 
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
            this.deleteById
        );

		if (this._openApiContent)
            this.registerOpenApiSpec(this._openApiContent);

        if (this._openApiFile)
            this.registerOpenApiSpecFromFile(this._openApiFile);
    }
}
