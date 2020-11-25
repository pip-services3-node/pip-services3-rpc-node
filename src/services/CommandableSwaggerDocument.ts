/** @module services */

const _ = require('lodash');

import { ConfigParams, ICommand, ObjectSchema, TypeCode } from "pip-services3-commons-node";

export class CommandableSwaggerDocument {
    private content: string = '';

    public commands: ICommand[];

    public version: string = "3.0.2";
    public baseRoute: string;

    public infoTitle: string;
    public infoDescription: string;
    public infoVersion: string = "1";
    public infoTermsOfService: string;

    public infoContactName: string;
    public infoContactUrl: string;
    public infoContactEmail: string;

    public infoLicenseName: string;
    public infoLicenseUrl: string;

    constructor(baseRoute: string, config: ConfigParams, commands: ICommand[]) {
        this.baseRoute = baseRoute;
        this.commands = commands ?? [];

        config = config ?? new ConfigParams();

        this.infoTitle = config.getAsStringWithDefault("name", "CommandableHttpService");
        this.infoDescription = config.getAsStringWithDefault("description", "Commandable microservice");
    }

    public toString(): string {
        var data = new Map<string, any>([
            ['openapi', this.version],
            ['info', new Map<string, any>(
                [
                    ['title', this.infoTitle],
                    ['description', this.infoDescription],
                    ['version', this.infoVersion],
                    ['termsOfService', this.infoTermsOfService],
                    ['contact', new Map<string, any>(
                        [
                            ['name', this.infoContactName],
                            ['url', this.infoContactUrl],
                            ['email', this.infoContactEmail]
                        ])
                    ],
                    ['license', new Map<string, any>(
                        [
                            ['name', this.infoLicenseName],
                            ['url', this.infoLicenseUrl]
                        ])
                    ]
                ])
            ],
            ['paths', this.createPathsData()]
        ]);

        this.writeData(0, data);

        //console.log(this.content);
        return this.content;
    }

    private createPathsData(): Map<string, any> {
        var data = new Map<string, any>();
        for (let index = 0; index < this.commands.length; index++) {
            const command = this.commands[index];

            var path = this.baseRoute + "/" + command.getName();
            if (!path.startsWith("/")) path = "/" + path;

            data.set(path, new Map<string, any>(
                [
                    ["post", new Map<string, any>(
                        [
                            ["tags", [this.baseRoute]],
                            ["operationId", command.getName()],
                            ["requestBody", this.createRequestBodyData(command)],
                            ["responses", this.createResponsesData()]
                        ])
                    ]
                ]));
        }

        return data;
    }

    private createRequestBodyData(command: ICommand): Map<string, any> {
        var schemaData = this.createSchemaData(command);
        return schemaData == null ? null : new Map<string, any>(
            [
                ["content", new Map<string, any>(
                    [
                        ["application/json", new Map<string, any>(
                            [
                                ["schema", schemaData]
                            ])
                        ]
                    ])
                ]
            ]);
    }

    private createSchemaData(command: ICommand): Map<string, object> {
        var schema = (<any>command)._schema; //command.getSchema();// as ObjectSchema;

        if (schema == null || schema.getProperties() == null)
            return null;

        var properties = new Map<string, any>();
        var required = [];

        schema.getProperties().forEach(property => {
            properties.set(property.getName(), new Map<string, any>(
                [
                    ["type", this.typeToString(property.getType())]
                ]
            ));

            if (property.isRequired) required.push(property.getName());
        });

        var data = new Map<string, any>(
            [
                ["properties", properties]
            ]
        );

        if (required.length > 0) {
            data.set("required", required);
        }

        return data;
    }

    private createResponsesData(): Map<string, any> {
        return new Map<string, any>(
            [
                ["200", new Map<string, any>(
                    [
                        ["description", "Successful response"],
                        ["content", new Map<string, any>(
                            [
                                ["application/json", new Map<string, any>(
                                    [
                                        ["schema", new Map<string, any>(
                                            [
                                                ["type", "object"]
                                            ])
                                        ]
                                    ])
                                ]
                            ])
                        ]
                    ])
                ]
            ]);
    }

    protected writeData(indent: number, data: Map<string, any>) {
        data.forEach((value, key) => {

            if (_.isString(value)) {
                this.writeAsString(indent, key, value);
            }
            else if (_.isArray(value)) {
                if (value.length > 0) {
                    this.writeName(indent, key);
                    for (let index = 0; index < value.length; index++) {
                        const item = value[index];
                        this.writeArrayItem(indent + 1, item);
                    }
                }
            }
            else if (_.isMap(value)) {
                if (_.findIndex(Array.from(value.values()), (item: any) => { return item != null; }) >= 0) {
                    this.writeName(indent, key);
                    this.writeData(indent + 1, value);
                }
            }
            else {
                this.writeAsObject(indent, key, value);
            }
        });
    }

    protected writeName(indent: number, name: string) {
        var spaces = this.getSpaces(indent);
        this.content += spaces + name + ":\n";
    }

    protected writeArrayItem(indent: number, name: string, isObjectItem: boolean = false) {
        var spaces = this.getSpaces(indent);
        this.content += spaces + "- ";

        if (isObjectItem) this.content += name + ":\n";
        else this.content += name + "\n";
    }

    protected writeAsObject(indent: number, name: string, value: any) {
        if (value == null) return;

        var spaces = this.getSpaces(indent);
        this.content += spaces + name + ": " + value + "\n";
    }

    protected writeAsString(indent: number, name: string, value: string) {
        if (!value) return;

        var spaces = this.getSpaces(indent);
        this.content += spaces + name + ": '" + value + "'\n";
    }

    protected getSpaces(length: number): string {
        return ' '.repeat(length * 2);
    }

    protected typeToString(type: any): string {
        // allowed types: array, boolean, integer, number, object, string
        if (type == TypeCode.Integer || type == TypeCode.Long) return 'integer';
        if (type == TypeCode.Double || type == TypeCode.Float) return 'number';
        if (type == TypeCode.String) return 'string';
        if (type == TypeCode.Boolean) return 'boolean';
        if (type == TypeCode.Array) return 'array';

        return 'object';
    }
}