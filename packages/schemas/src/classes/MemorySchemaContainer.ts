import {Options} from "ajv";
import {JSONSchema4} from "json-schema";
import {SchemaContainer} from "./SchemaContainer";

/**
 * Compiling Ajv schemas into validation functions is expensive. This class helps to avoid unnecessary schema
 * compilations by caching validation functions and only recompiling when the schema has changed.
 */
export class MemorySchemaContainer<T = unknown> extends SchemaContainer<T> {
    private _schema: JSONSchema4;

    constructor(options: Options, schema: JSONSchema4) {
        super(options);
        this._schema = schema;
    }

    public set schema(val: JSONSchema4) {
        // Fast but not perfect if the objects' properties change order. Since our schemas are alphanumerically ordered,
        // this should be a non-issue.
        if(JSON.stringify(this._schema) !== JSON.stringify(val)) {
            this.resetCache();
        }
        this._schema = val;
    }

    public get schema() {
        return structuredClone(this._schema);
    }
}
