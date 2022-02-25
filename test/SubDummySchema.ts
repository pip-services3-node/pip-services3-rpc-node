import { TypeCode } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';

export class SubDummySchema extends ObjectSchema {

    public constructor() {
        super();
        this.withRequiredProperty("key", TypeCode.String);
        this.withOptionalProperty("content", TypeCode.String);
    }

}
