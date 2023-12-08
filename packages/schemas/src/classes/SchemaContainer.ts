import Ajv, {Options, ValidateFunction} from "ajv";
import {JSONSchema4} from "json-schema";

/**
 * Compiling Ajv schemas into validation functions is expensive. This class helps to avoid unnecessary schema
 * compilations by caching validation functions and only recompiling when the schema has changed.
 */
export class SchemaContainer<T = unknown> {

    public ajv: Ajv;

    private _schema: JSONSchema4;

    private cachedValidate?: ValidateFunction<T>;

    constructor(options: Options, schema: JSONSchema4) {
        this.ajv = new Ajv(options);
        this._schema = schema;
    }

    public set schema(val: JSONSchema4) {
        // Fast but not perfect if the objects' properties change order. Since our schemas are alphanumerically ordered,
        // this should be a non-issue.
        if(JSON.stringify(this._schema) !== JSON.stringify(val)) {
            this.cachedValidate = undefined;
        }
        this._schema = val;
    }

    public get schema() {
        return structuredClone(this._schema);
    }

    public get validate(): ValidateFunction<T> {
        if(!this.cachedValidate) {
            this.cachedValidate = this.ajv.compile<T>(this._schema)
        }
        return this.cachedValidate;
    }
}
