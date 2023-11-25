import workerpool from "workerpool";
import {JSONSchema4} from "json-schema";
import chalk from "chalk";
import toJsonSchema from "gen-json-schema";
import {logger} from "./util";
import Ajv, {Options, ValidateFunction} from "ajv";
import fs from "fs";

const jsonSchemaAnnotations = [
    "title",
    "description",
    "default",
    "examples",
    "readOnly",
    "writeOnly",
    "deprecated"
]

/**
 * Compiling Ajv schemas into validation functions is expensive. This class helps to avoid unnecessary schema
 * compilations by caching validation functions and only recompiling when the schema has changed.
 */
class SchemaContainer<T = unknown> {

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

/**
 * Determines whether two JSON schemas are compatible. 'Compatible' in this context means that merging both schemas into
 * one doesn't cause any inconsistencies with the schemas' content. Essentially, when both schemas have a value for a
 * keyword/property, the values must match (unless it's value is another schema or map of schemas, e.g. on
 * `properties`, which are processed recursively). The function will return false should there be conflicting
 * data for the same property in the two schemas.
 *
 * @param a The first schema to compare.
 * @param b The second schema to compare.
 * @returns `true` if the schemas are compatible, `false` otherwise.
 */
function areSchemasCompatible(a: JSONSchema4, b: JSONSchema4): boolean {
    const values: Record<string, { aValue: unknown, bValue: unknown }> = {};
    for(const prop in a) {
        if(values[prop] === undefined) {
            values[prop] = {
                aValue: undefined,
                bValue: undefined
            }
        }
        values[prop].aValue = a[prop];
    }
    for(const prop in b) {
        if(values[prop] === undefined) {
            values[prop] = {
                aValue: undefined,
                bValue: undefined
            }
        }
        values[prop].bValue = b[prop];
    }

    for(const [key, value] of Object.entries(values)) {
        if(["properties", "items", "contains", "patternProperties", "definitions"].includes(key)) {
            continue;
        }
        if(value.aValue === undefined || value.bValue === undefined) {
            continue;
        }

        if(Array.isArray(value.aValue) !== Array.isArray(value.bValue)) {
            return false;
        } else if(Array.isArray(value.aValue)) {
            // bValue must also be an array. We don't compare array contents.
            continue;
        }

        // If the two values are not equal and they are not objects, or if they are objects but those objects
        // themselves are not compatible with each other, then these two objects are not compatible with each other.
        if(
            value.aValue !== value.bValue && (
                typeof value.aValue !== "object" || typeof value.bValue !== "object" ||
                value.aValue === null || value.bValue === null ||
                !areSchemasCompatible(value.aValue, value.bValue)
            )
        ) {
            return false;
        }
    }
    return true;
}

/**
 * Get the `patternProperties` value on a JSON schema that the given property name matches, or null if the property name
 * does not match any pattern property schema.
 *
 * @param propName The name of the property to be matched against the pattern properties.
 * @param schema The JSON schema containing the pattern properties to be matched against.
 *
 * @returns The pattern property name that matches the given property name, or null if no match is found.
 */
function matchingPatternProperty(propName: string, schema: JSONSchema4): string | null {
    for(const pattern in schema.patternProperties ?? []) {
        if(new RegExp(pattern).test(propName)) {
            return pattern
        }
    }
    return null;
}
/**
 * Modifies an existing JSON schema to also be compatible with a new schema, preserving the validity of previously
 * conforming data. It achieves this by adding new descriptive properties when compatible, or an 'anyOf' clause as deep
 * as the schema allows when not.
 *
 * This method takes in `base` and `source` parameters, however for all intents and purposes, you generally should not
 * treat these any different from one another. Swapping them around should always generate the same output.
 *
 * The function merges the new data into the schema without conflicting with existing property definitions. It creates
 * a new 'anyOf' clause only when necessary to avoid property conflicts.
 *
 * The function also handles `items`, `contains`, `properties`, `patternProperties`, and `definitions` recursively. All
 * other JSON schema keywords are checked for equality to determine compatibility (whether the two schemas can be
 * merged, or the new one needs to be appended to the `anyOf` array).
 *
 * @remarks Schema T is equivalent to `{anyOf: [T]}`. The `mergeSchemas` function attempts to add the new data to an
 * existing 'anyOf' array, creating a new 'anyOf' if necessary. It merges the new data as deep into the schema as it can
 * go without causing property conflicts, at which point `anyOf` is forced to be used.
 *
 * @param base The existing JSON schema that the new schema should be integrated into. This is not modified in place.
 * @param source The new schema to incorporate into the base schema.
 *
 * @returns A new schema that complies with both the `base` and `source` schemas.
 *
 * @example
 * const schemaOne = {
 *   "anyOf": [
 *     {
 *       "type": "null"
 *     },
 *     {
 *       "type": "object",
 *       "properties": {
 *         "propertyOne": {
 *           "type": "number"
 *         }
 *       }
 *     }
 *   ]
 * }
 * const schemaTwo = {
 *       "type": "object",
 *       "properties": {
 *         "propertyOne": {
 *           "type": "string"
 *         },
 *         "propertyTwo": {
 *             "type": "object",
 *             "properties": {
 *                 "child": {
 *                    "type": "boolean"
 *                 }
 *             }
 *         }
 *       }
 *     }
 *
 * console.log(JSON.stringify(mergeSchemas(schemaOne, schemaTwo), null, 2));
 * // {
 * //   "anyOf": [
 * //     {
 * //       "type": "null"
 * //     },
 * //     {
 * //       "type": "object",
 * //       "properties": {
 * //         "propertyOne": {
 * //            "anyOf": [
 * //               {
 * //                 "type": "number"
 * //               },
 * //               {
 * //                 "type": "string"
 * //               }
 * //            ]
 * //          },
 * //         "propertyTwo": {
 * //           "type": "object",
 * //           "properties": {
 * //             "child": {
 * //               "type": "boolean"
 * //             }
 * //           }
 * //         }
 * //       }
 * //     }
 * //   ]
 * // }
 * ```
 */
function mergeSchemas(base: JSONSchema4, source: JSONSchema4): JSONSchema4 {
    // Clone so we can return a fresh copy of the new schema without risking in-place modification
    base = structuredClone(base);
    source = structuredClone(source);

    // We do things a little differently if the schema we're merging in adds an anyOf. For data-related schema
    // properties, we try to merge them into the anyOf array. For annotation schema properties, we keep them on the base
    if(source.anyOf && !base.anyOf) {
        const annotationProperties: JSONSchema4 = {};
        const dataProperties: JSONSchema4 = {};
        for(const prop in base) {
            if(jsonSchemaAnnotations.includes(prop)) {
                annotationProperties[prop] = base[prop];
            } else {
                dataProperties[prop] = base[prop];
            }
        }

        base = {
            ...mergeSchemas(source, dataProperties),
            ...annotationProperties
        }
        return base;
    }

    // Create the implicit anyOf array with a single value, if anyOf array is missing.
    let baseAnyOf = base.anyOf ?? [base];
    const sourceAnyOf = source.anyOf ?? [source];

    for(const sourceSchema of sourceAnyOf) {

        // If the source schema is compatible with any schema in our anyOf, we can combine with that schema(s).
        // Otherwise we need to add it to the anyOf array.
        let shouldPushToAnyOf = true;
        for(const baseSchema of baseAnyOf) {
            if(areSchemasCompatible(baseSchema, sourceSchema)) {
                shouldPushToAnyOf = false;
                break;
            }
        }

        if(shouldPushToAnyOf) {
            baseAnyOf.push(sourceSchema);
        } else {
            // Merge sourceSchema into all schemas which it is compatible with
            for(const schema of baseAnyOf) {
                if(areSchemasCompatible(schema, sourceSchema)) {
                    for(const prop in sourceSchema) {
                        if(Array.isArray(sourceSchema[prop])) {
                            // areSchemasCompatible has already asserted that if sourceSchema[prop] is an
                            // array, then schema[prop] is either an array or undefined. Here, we're just
                            // merging the two arrays, and removing duplicates.
                            schema[prop] = Array.from(
                                new Set([...(schema[prop] ?? []), ...sourceSchema[prop]])
                            )
                        } else if(["properties", "definitions", "patternProperties"].includes(prop)) {
                            if(!schema[prop]) {
                                schema[prop] = {}
                            }
                            for(const item in sourceSchema[prop]) {
                                const propertyPattern: string | null =
                                    matchingPatternProperty(item, schema) ||
                                    matchingPatternProperty(item, sourceSchema);
                                if(prop === "properties" && propertyPattern) {
                                    if(!schema.patternProperties) {
                                        schema.patternProperties = {}
                                    }
                                    if(schema.patternProperties[propertyPattern]) {
                                        schema.patternProperties[propertyPattern] = mergeSchemas(
                                            schema.patternProperties[propertyPattern],
                                            sourceSchema[prop]![item]
                                        )
                                    } else {
                                        schema.patternProperties[propertyPattern] = sourceSchema[prop]![item]
                                    }
                                } else if(schema[prop][item]) {
                                    schema[prop][item] = mergeSchemas(schema[prop][item], sourceSchema[prop][item])
                                } else {
                                    schema[prop][item] = sourceSchema[prop][item]
                                }
                            }
                        } else if(["items", "contains"].includes(prop)) {
                            if(schema[prop]) {
                                schema[prop] = mergeSchemas(schema[prop], sourceSchema[prop]);
                            } else {
                                schema[prop] = sourceSchema[prop]
                            }
                        } else {
                            // We could be overwriting values here, but areSchemasCompatible should have already
                            // asserted that any values we're overwriting are equal anyway.
                            schema[prop] = sourceSchema[prop]
                        }
                    }
                }
            }
        }
    }


    // We can simplify any schema which matches any number or integer to simply match any number.
    const anyOfJson = JSON.stringify(baseAnyOf)
    if(anyOfJson === '[{"type":"number"},{"type":"integer"}]' || anyOfJson === '[{"type":"integer"},{"type":"number"}]') {
        baseAnyOf = [{type: "number"}]
    }

    // We can simplify anyOf arrays with 1 value to just be the value
    if(baseAnyOf.length === 1) {
        return baseAnyOf[0]
    } else if(base.anyOf) {
        base.anyOf = baseAnyOf
    } else {
        base = {
            anyOf: baseAnyOf
        }
    }

    return base;
}

/**
 * Visits each property/element in a given value and invokes a callback function on it. This is done recursively.
 * The callback will not be called at all for non-objects/arrays.
 *
 * @param {any} value - The value to visit.
 * @param {function} callback - The callback function to invoke on each element. It takes two parameters:
 *  - key {string | number}: The key or index of the current element being visited.
 *  - parent {any}: The parent object or array being visited.
 * The return value of the callback will replace the current element in the value.
 * @example
 * // This example appends '_processed' to each string value
 * const obj = {
 *  name: "John",
 *  age: 30,
 *  city: "New York",
 *  hobbies: ["Football", "Reading"]
 * };
 *
 * visit(obj, (key, parent) => {
 *  const value = parent[key];
 *  if (typeof value === "string") {
 *    return value + "_processed";
 *  }
 *  return value;
 * });
 *
 * console.log(obj)
 *
 * // {
 * //  name: 'John_processed',
 * //  age: 30,
 * //  city: 'New York_processed',
 * //  hobbies: [ 'Football_processed', 'Reading_processed' ]
 * // }
 */
function visit(value: any, callback: (key: string | number, parent: any) => any) {
    if(Array.isArray(value)) {
        for(let i = 0; i < value.length; i++) {
            value[i] = callback(i, value);
            visit(value[i], callback)
        }
    } else if(typeof value === "object" && value !== null) {
        for(const prop in value) {
            value[prop] = callback(prop, value)
            visit(value[prop], callback);
        }
    }
}

/**
 * Updates the given JSON schema to match the given data.
 *
 * This is intended for merging API responses from a loosely defined API/database, where an absent value is equivalent
 * to its default value. The consequence of this is that we might not know all the possible key/value pairs. This
 * method will merge schemas matching each data entry into the base given schema. Missing fields will not be removed
 * or touched. If there is a conflict, they will be merged into an `anyOf` array at the highest-possible specificity.
 *
 * @param {JSONSchema4} schema - The original JSON schema to be updated.
 * @param {Record<string, any>[]} data - An array of data used to generate a new JSON schema.
 * @return {JSONSchema4} - The updated JSON schema.
 * @throws Error if there are any JSON schema errors that the algorithm was not able to resolve, or that were
 * inadvertently introduced by the algorithm.
 */
function updateSchema(schema: JSONSchema4, data: Record<string, any>[]): JSONSchema4 {

    const container = new SchemaContainer({
        allErrors: true,
        inlineRefs: false
    }, schema);

    for(const datum of data) {
        // Create a JSON schema based on our data.
        const dataSchema = toJsonSchema(datum, {
            strings: {
                detectFormat: false
            },
            // Tuple is currently the only way to get types for all array entries. Immediately after this,
            // we traverse the schema and merge all items in each tuple
            arrays: {
                mode: 'tuple'
            }
        }) as JSONSchema4;

        // Merge all items tuples into a single item schema
        visit(dataSchema, (key, parent) => {
            if(key === "items" && parent.type === "array") {
                const itemsArray: JSONSchema4[] = parent[key];
                let mergedItems: JSONSchema4 = {};
                for(const item of itemsArray) {
                    mergedItems = mergeSchemas(mergedItems, item);
                }
                return mergedItems;
            }
            return parent[key]
        })

        // Merge the schema containing changed values with the schema we're updating
        container.schema = mergeSchemas(container.schema, dataSchema);

        logger(chalk.dim("WORKER > Re-validating final schema to check for unexpected errors"), true)
        container.validate(datum);
        logger(chalk.dim("WORKER > Final validation complete"), true)
        if(container.validate.errors?.length ?? 0 >= 1) {
            logger(chalk.dim("WORKER > Unexpected errors within final validation"), true)
            const schemaDumpFile = "schema-" + Date.now() + ".dmp";
            fs.writeFileSync(schemaDumpFile, JSON.stringify({
                schema: container.schema,
                data: datum
            }))
            throw new Error("Unexpected errors were introduced after the addition of new schema properties. " +
                `Schema and data has been dumped to ${schemaDumpFile}.\n` +
                `Errors: ${container.ajv.errorsText(container.validate.errors)}`)
        }
    }
    return container.schema;
}

workerpool.worker({
    updateSchema
})
