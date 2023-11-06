import workerpool from "workerpool";
import {JSONSchema4} from "json-schema";
import chalk from "chalk";
import toJsonSchema from "gen-json-schema";
import {logger} from "./util";
import Ajv, {Options} from "ajv";
import {diff} from "json-diff";

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
    let next: unknown;
    if(nextIndex === "#" || nextIndex === '') {
        next = obj
    } else if((obj === null || obj === undefined) && !strict) {
        return undefined;
    } else {
        next = obj[decodeURIComponent(nextIndex)]
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

/**
 *
 * @param schema
 * @param data
 */
function updateSchema(schema: JSONSchema4, data: Record<string, any>[]): JSONSchema4 {
    let newSchema = schema;

    const ajvOptions: Options = {
        allErrors: true,
        inlineRefs: false
    }

    for(const datum of data) {
        // Compile the schema into two validators: One which keeps unknown properties and one which removes them.
        const validate = new Ajv(ajvOptions).compile(schema);
        const strictValidate = new Ajv({
            ...ajvOptions,
            removeAdditional: "all"
        }).compile(schema);
        // Pass the input through the two validators. They modify the data in place. We can then compare their results.
        const strictDatum = structuredClone(datum);
        validate(datum);
        strictValidate(strictDatum);

        // Before comparing results, check the validator errors for type mismatches or missing required properties
        for(const error of validate.errors ?? []) {
            console.log(error);
            console.log(accessProperty(error.schemaPath, schema))
            console.log(accessProperty(error.instancePath, datum))
            if(error.keyword === "type") {
                /* ... */
            }
        }


        // changesDiff is an object with all values that are already in the schema removed, even if the value
        // doesn't match the schema (e.g. an "object" is where there's supposed to be a "number")
        const changesDiff = diff(strictDatum, datum, {
            keysOnly: true
        })
        if(!changesDiff) {
            logger(chalk.dim("WORKER > No schema changes detected"), true)
            continue;
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

        newSchema = combineSchemas(schema, changesSchema);
    }
    return newSchema;
}

workerpool.worker({
    updateSchema
})
