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
 * TODO
 * @param schema
 */
function followReference(schema: JSONSchema4): JSONSchema4 {
    return schema
}

/**
 * Check if two objects have conflicting values. If we attempted to merge the two objects, would we have to
 * either change the data structure or remove some data.
 * @param a
 * @param b
 */
function areObjectsCompatible(a: Record<string, any>, b: Record<string, any>): boolean {
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
                !areObjectsCompatible(value.aValue, value.bValue)
            )
        ) {
            return false;
        }
    }
    return true;
}

/**
 * Get the `patternProperties` value on a JSON schema that the given property name matches, or null if the
 * property name does not match any pattern property schema.
 * @param propName
 * @param schema
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
 *
 * @param base
 * @param source
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
    let anyOf = base.anyOf ?? [base];

    // If the source schema is compatible with any schema in our anyOf, we can combine with that schema(s).
    // Otherwise we need to add it to the anyOf array.
    let shouldPushToAnyOf = true;
    for(const schema of anyOf) {
        if(areObjectsCompatible(schema, source)) {
            shouldPushToAnyOf = false;
            break;
        }
    }

    if(shouldPushToAnyOf) {
        anyOf.push(source);
    } else {
        // Merge source schema into all schemas which it is compatible with
        for(const schema of anyOf) {
            if(areObjectsCompatible(schema, source)) {
                for(const prop in source) {
                    if(Array.isArray(source[prop])) {
                        // areObjectsCompatible has already asserted that if source[prop] is an
                        // array, then schema[prop] is either an array or undefined. Here, we're just
                        // merging the two arrays, and removing duplicates.
                        schema[prop] = Array.from(
                            new Set([...(schema[prop] ?? []), ...source[prop]])
                        )
                    } else if(["properties", "definitions", "patternProperties"].includes(prop)) {
                        if(!schema[prop]) {
                           schema[prop] = {}
                        }
                        for(const item in source[prop]) {
                            const propertyPattern: string | null =
                                matchingPatternProperty(item, schema) ||
                                matchingPatternProperty(item, source);
                            if(prop === "properties" && propertyPattern) {
                                if(!schema.patternProperties) {
                                    schema.patternProperties = {}
                                }
                                if(schema.patternProperties[propertyPattern]) {
                                    schema.patternProperties[propertyPattern] = mergeSchemas(
                                        schema.patternProperties[propertyPattern],
                                        source[prop]![item]
                                    )
                                } else {
                                    schema.patternProperties[propertyPattern] = source[prop]![item]
                                }
                            } else if(schema[prop][item]) {
                                schema[prop][item] = mergeSchemas(schema[prop][item], source[prop][item])
                            } else {
                                schema[prop][item] = source[prop][item]
                            }
                        }
                    } else if(["items", "contains"].includes(prop)) {
                        if(schema[prop]) {
                            schema[prop] = mergeSchemas(schema[prop], source[prop]);
                        } else {
                            schema[prop] = source[prop]
                        }
                    } else {
                        // We could be overwriting values here, but areSchemasCompatible should have already
                        // asserted that any values we're overwriting are equal anyway.
                        schema[prop] = source[prop]
                    }
                }
            }
        }
    }

    // We can simplify any schema which matches any number or integer to simply match any number.
    const anyOfJson = JSON.stringify(anyOf)
    if(anyOfJson === '[{"type":"number"},{"type":"integer"}]' || anyOfJson === '[{"type":"integer"},{"type":"number"}]') {
        anyOf = [{type: "number"}]
    }

    // We can simplify anyOf arrays with 1 value to just be the value
    if(anyOf.length === 1) {
        return anyOf[0]
    } else if(base.anyOf) {
        base.anyOf = anyOf
    } else {
        base = {
            anyOf
        }
    }

    return base;
}

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
