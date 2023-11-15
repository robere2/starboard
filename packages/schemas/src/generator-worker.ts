import workerpool from "workerpool";
import {JSONSchema4} from "json-schema";
import chalk from "chalk";
import toJsonSchema from "gen-json-schema";
import {logger} from "./util";
import Ajv, {ErrorObject, Options, ValidateFunction} from "ajv";
import {diff} from "json-diff";
import fs from "fs";

/**
 * Compiling Ajv schemas into validation functions is expensive. This class helps to avoid unnecessary schema
 * compilations by caching validation functions and only recompiling when the schema has changed.
 */
class SchemaContainer<T = unknown> {

    public ajv: Ajv;
    public ajvStrict: Ajv;

    private _schema: JSONSchema4;

    private cachedValidate?: ValidateFunction<T>;
    private cachedValidateStrict?: ValidateFunction<T>;

    constructor(options: Options, schema: JSONSchema4) {
        this.ajv = new Ajv(options);
        this.ajvStrict = new Ajv({
            ...options,
            removeAdditional: true
        })
        this._schema = schema;
    }

    public set schema(val: JSONSchema4) {
        // Fast but not perfect if the objects' properties change order. Since our schemas are alphanumerically ordered,
        // this should be a non-issue.
        if(JSON.stringify(this._schema) !== JSON.stringify(val)) {
            this.cachedValidate = undefined;
            this.cachedValidateStrict = undefined;
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

    public get validateStrict(): ValidateFunction<T> {
        if(!this.cachedValidateStrict) {
            this.cachedValidateStrict = this.ajvStrict.compile<T>(this._schema)
        }
        return this.cachedValidateStrict;
    }
}

/**
 * Access a deep property on an object via the string notation used by JSON schemas
 * @param path Path to access. This should be a string with each key separated by a `/`, and each key is URI encoded.
 * Optionally, the path may start with a '#', indicating the root of the schema. For the purposes of this function,
 * this has no effect on the returned value. Similarly, a leading slash `/` will be ignored.
 * @param obj Object to get the value on.
 * @param strict Whether the function should throw an error when you try to access an inaccessible property, i.e. a
 * property on a nullish value. If this is false, then `undefined` is simply returned instead.
 * @throws
 * - `TypeError` if the path is not accessible and `strict` is set to true
 * @returns Whatever value is stored at the given path.
 */
function accessProperty(path: string, obj: unknown, strict = true): unknown {
    const splitPath = path.split('/');
    const nextIndex = splitPath.shift();
    if(nextIndex === undefined) {
        throw new Error("The given index is undefined");
    }
    let next: unknown;
    if(nextIndex === "#" || nextIndex === '') {
        next = obj
    } else if((obj === null || obj === undefined) && !strict) {
        return undefined;
    } else {
        next = (obj as any)[decodeURIComponent(nextIndex)]
    }
    if(splitPath.length === 0) {
        return next;
    } else {
        return accessProperty(splitPath.join('/'), next);
    }
}

/**
 * Iterate over a `newSchema` and add to `originalSchema` any properties that it didn't already have.
 * @param originalSchema The schema that new properties should be added to. This value is not modified.
 * @param newSchema The schema to find properties in and add to `originalSchema`. This value is not modified.
 * @returns An object like `originalSchema` but with all new properties from `newSchema` added on.
 * @throws
 * - `Error` if either provided schema is not a valid JSON schema
 * - `Error` for some schema conflicts that can't be handled without losing data
 * - `Error` if `newSchema` contains an `items` array at any point. Only singular item types are currently supported.
 * - Stack overflow for very deep schemas (this method is recursive)
 */
function combineSchemas(originalSchema: JSONSchema4, newSchema: JSONSchema4): JSONSchema4 {
    const finalSchema = structuredClone(originalSchema);

    if(newSchema.properties) {
        if(!finalSchema.properties) {
            finalSchema.properties = {};
        }
        newSchemaPropsLoop:
            for(const prop in newSchema.properties) {
                if(!finalSchema.properties[prop]) {
                    // Before adding property, first check if it's recognized as a pattern property on the finalSchema.
                    // If it is a pattern, combine with the pattern property schema instead. Otherwise we can
                    for(const pattern in finalSchema.patternProperties ?? {}) {
                        if(new RegExp(pattern).test(prop)) {
                            logger(chalk.dim(`WORKER > Property ${prop} matches existing pattern property ${pattern}`), true)
                            finalSchema.patternProperties![pattern] = combineSchemas(finalSchema.patternProperties![pattern], newSchema.properties[prop]);
                            continue newSchemaPropsLoop; // We don't want to break as that'd write to "properties"
                        }
                    }
                    logger(chalk.dim(`WORKER > Property ${prop} added as a new property`), true)
                    finalSchema.properties[prop] = structuredClone(newSchema.properties[prop]);
                } else {
                    logger(chalk.dim(`WORKER > Property ${prop} extended on original schema`), true)
                    finalSchema.properties[prop] = combineSchemas(finalSchema.properties[prop], newSchema.properties[prop]);
                }
            }
    }

    if(Array.isArray(newSchema.items)) {
        throw new Error('Arrays for `items` properties is currently not supported.');
    } else if(newSchema.items?.properties) {
        if(Array.isArray(finalSchema.items)) {
            throw new Error('Type conflict - Should never happen if a value directly from `toJsonSchema` is given as the `newSchema` input')
        }
        if(!finalSchema.items) {
            finalSchema.items = {}
        }
        if(!finalSchema.items.properties) {
            logger(chalk.dim(`WORKER > Added array items`), true)
            finalSchema.items.properties = structuredClone(newSchema.items.properties);
        } else {
            logger(chalk.dim(`WORKER > Updated array items`), true)
            finalSchema.items.properties = combineSchemas(finalSchema.items.properties, newSchema.items.properties);
        }
    }

    return finalSchema
}

function addMissingSchemaProperties(container: SchemaContainer, data: Record<string, any>): JSONSchema4 {
    // Pass data through strict validator to remove unknown properties
    const strictData = structuredClone(data);
    container.validateStrict(strictData);

    // changesDiff is an object with all values that are already in the schema removed, even if the value
    // doesn't match the schema (e.g. an "object" is where there's supposed to be a "number")
    const changesDiff = diff(strictData, data, {
        keysOnly: true
    })
    if(!changesDiff) {
        logger(chalk.dim("WORKER > No schema changes detected"), true)
        return container.schema;
    }

    logger(chalk.dim("WORKER > Schema changes detected"), true);
    // The changesDiff converted into a schema, to be combined with original schema.
    const changesSchema: JSONSchema4 = toJsonSchema(changesDiff, {
        strings: {
            detectFormat: false
        },
        objects: {
            preProcessFnc: (obj, defaultFunc) => {
                return defaultFunc(Object.fromEntries(Object
                    .entries(obj)
                    .map(([key, value]) => {
                        if (key.endsWith("__added")) {
                            key = key.slice(0, -7)
                            logger(chalk.dim("WORKER > New key: " + key), true)
                        }
                        return [key, value]
                    })
                ));
            }
        }
    }) as JSONSchema4;

    return combineSchemas(container.schema, changesSchema);
}

function resolveSchemaError(schema: JSONSchema4, error: ErrorObject | null, data: Record<string, any>): JSONSchema4 {
    const newSchema = structuredClone(schema);
    if(error == null) {
        return newSchema;
    }
    if(error.keyword === "type") {
        return resolveTypeError(newSchema, error, data);
    } else {
        // If the error was retrieved from getNextSolvableError, this should never happen.
        logger(chalk.yellow(`WORKER > Unresolvable schema error: ${new Ajv().errorsText([error])}`))
        return newSchema;
    }
}

function resolveTypeError(schema: JSONSchema4, error: ErrorObject, data: Record<string, any>): JSONSchema4 {
    let newSchema = structuredClone(schema);
    const splitPath = error.schemaPath.split("/");

    const newType = toJsonSchema(accessProperty(error.instancePath, data), {
        strings: {
            detectFormat: false
        }
    })

    const anyOfArray: JSONSchema4[] = [
        newType as JSONSchema4
    ]

    // If this property is already in a anyOf array, we want to add to that array. Otherwise we want to
    // construct a new anyOf array
    if(splitPath.length >= 3 && splitPath[splitPath.length - 3] === "anyOf") {
        // FIXME in anyOf errors, the error will appear three times. Only need to handle once.
        const oldAnyOfArray = accessProperty(splitPath.slice(0, -2).join('/'), newSchema);
        if(!Array.isArray(oldAnyOfArray)) {
            throw new Error("Malformed JSON schema - Expected anyOf property to be an array.")
        }
        anyOfArray.push(...oldAnyOfArray);
        const anyOfParent = accessProperty(splitPath.slice(0, -3).join('/'), newSchema);
        (anyOfParent as any).anyOf = anyOfArray
    } else {
        const parentName = splitPath[splitPath.length - 2];
        const parent = accessProperty(splitPath.slice(0, -1).join('/'), newSchema);

        if(splitPath.length < 2) {
            newSchema = {
                anyOf: anyOfArray
            }
        } else {
            const grandparent = accessProperty(splitPath.slice(0, -2).join('/'), newSchema);
            anyOfArray.push(parent as JSONSchema4);
            (grandparent as any)[parentName] = {
                anyOf: anyOfArray
            }
        }
    }

    return newSchema;
}

function getNextSolvableError(errors: ErrorObject[]): ErrorObject | null {
    for(const err of errors) {
        if(err.keyword === "type") {
            return err;
        }
    }
    return null;
}

/**
 *
 * @param schema
 * @param data
 */
function updateSchema(schema: JSONSchema4, data: Record<string, any>[]): JSONSchema4 {
    const container = new SchemaContainer({
        allErrors: true,
        inlineRefs: false
    }, schema);

    for(const datum of data) {
        // Resolve all schema errors that we're able to, until there's no more to fix. We recompile the
        // validation function between each resolution because multiple errors could be caused by the same
        // problem, and we don't want to repeat them. This is inefficient and could likely be improved.

        let nextErrorToResolve: ErrorObject | null;
        do {
            container.validate(datum);
            nextErrorToResolve = getNextSolvableError(container.validate.errors ?? [])
            if(nextErrorToResolve) {
                logger(chalk.dim(`WORKER > Attempting to resolve error ${container.ajv.errorsText([nextErrorToResolve])}`))
            }
            container.schema = resolveSchemaError(container.schema, nextErrorToResolve, datum)
        } while(nextErrorToResolve !== null)

        // These are errors that we don't know how to solve, and they should be reported for a human to solve.
        const remainingErrors = container.validate.errors ?? [];

        if(remainingErrors.length > 0) {
            logger(chalk.yellow(`WORKER > Unresolvable schema errors: ${container.ajv.errorsText(remainingErrors)}`))
        }

        // Add all missing properties
        container.schema = addMissingSchemaProperties(container, datum);

        logger(chalk.dim("WORKER > Re-validating final schema to check for unexpected errors"), true)
        container.validate(datum);
        logger(chalk.dim("WORKER > Final validation complete"), true)
        const newErrors = container.ajv.errorsText(container.validate.errors)
        const oldErrors = container.ajv.errorsText(remainingErrors);
        if(newErrors !== oldErrors) {
            logger(chalk.dim("WORKER > Unexpected errors within final validation"), true)
            const schemaDumpFile = "schema-" + Date.now() + ".dmp";
            fs.writeFileSync(schemaDumpFile, JSON.stringify({
                schema: container.schema,
                data: datum
            }))
            throw new Error("Unexpected errors were introduced after the addition of new schema properties. " +
                `Schema and data has been dumped to ${schemaDumpFile}.\n` +
                `Old errors: ${oldErrors}\n` +
                `New errors: ${newErrors}`)
        }
    }
    return container.schema;
}

workerpool.worker({
    updateSchema
})
