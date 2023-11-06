import workerpool from "workerpool";
import {JSONSchema4} from "json-schema";
import chalk from "chalk";
import toJsonSchema from "gen-json-schema";
import {logger} from "./util";
import Ajv, {Options, ValidateFunction} from "ajv";
import {diff} from "json-diff";
import crypto from "crypto";


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
export function combineSchemas(originalSchema: JSONSchema4, newSchema: JSONSchema4): JSONSchema4 {
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
 * Hash a string into it's md5 hexadecimal output.
 * @param str String to hash
 * @returns An MD5 hash encoded in a hexadecimal string
 */
function md5(str: string): string {
    return crypto.createHash("md5").update(str).digest().toString("hex");
}

let lastUsedSchemaHash: string;
let lastUsedValidationFunction: ValidateFunction;
let lastUsedValidationRemovalFunction: ValidateFunction;
/**
 * Find divergences in an input object's keys from a given JSON schema. Changes in value or type will not be reported.
 * @param schema A valid JSON schema to check the difference of `input` against.
 * @param input Any object that you want to check for new/removed keys compared to the given `schema`.
 * @returns An object containing differences in object keys. New keys will have `__added` appended, and removed keys
 * will have `__deleted` appended. If a deleted property is an object or an array, its children properties will not
 * have `__added` or `__deleted` appended.
 *
 * @throws
 * - `Error` if the given schema is not a valid JSON schema
 * @example
 * const schema = {
 *     type: "object",
 *     properties: {
 *         prop_one: {
 *             type: "string"
 *         }
 *     }
 * }
 *
 * const output = findSchemaChanges(schema, {
 *     prop_one: "Hello, world!",
 *     prop_two: false
 * })
 * console.log(output)
 * // Output: { prop_two__added: false }
 */
export function findSchemaChanges(schema: JSONSchema4, input: Record<string, any>): Record<string, any> {
    const allValues = structuredClone(input)
    const definedValues = structuredClone(input)

    const ajvOptions: Options = {
        allErrors: true,
        inlineRefs: false
    }

    // Compiling an AJV validator is expensive. We want to cache the compiled validator for use in subsequent checks.
    // To do this, we hash the schema, and only use the cached functions if they match the previous schema's hash.
    const schemaHash = md5(JSON.stringify(schema));
    let validate;
    let validateAndRemove;
    if(schemaHash === lastUsedSchemaHash) {
        validate = lastUsedValidationFunction;
        validateAndRemove = lastUsedValidationRemovalFunction;
    } else {
        lastUsedSchemaHash = schemaHash;
        lastUsedValidationFunction = validate = new Ajv(ajvOptions).compile(schema);
        lastUsedValidationRemovalFunction = validateAndRemove = new Ajv({
            ...ajvOptions,
            removeAdditional: "all"
        }).compile(schema);
    }

    validate(allValues);
    validateAndRemove(definedValues);

    if(validate.errors) {
        logger(chalk.dim('WORKER > ' + JSON.stringify(validate.errors)));
    }

    return diff(definedValues, allValues, {
        keysOnly: true
    })
}

function updateSchema(schema: JSONSchema4, data: Record<string, any>[]): JSONSchema4 {
    let newSchema = schema;
    for(const datum of data) {

        // changesDiff is an object with all values that are already in the schema removed, even if the value
        // doesn't match the schema (e.g. an "object" is where there's supposed to be a "number")
        const changesDiff = findSchemaChanges(schema, datum);
        if(!changesDiff) {
            logger(chalk.dim("WORKER > No schema changes detected"), true)
            return schema;
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
