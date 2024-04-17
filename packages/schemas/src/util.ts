import chalk, {ChalkInstance} from "chalk";
import {compile} from "json-schema-to-typescript";
import fs from "fs";
import {dirname, join} from "path";
import {fileURLToPath} from "url";
import {JSONSchema4} from "json-schema";

const __dirname = dirname(fileURLToPath(import.meta.url))

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
 * While JSON schemas do not need to obey any specific order, when we write them to the file system, we want to make
 * as small of a diff as possible. Additionally, similar properties may be discovered by the generator at vastly
 * different times, which would normally place them potentially thousands of lines apart within the schema.
 *
 * To avoid both of these issues, we sort all of our schema's objects by key, and primitive arrays by value. Arrays of
 * objects are not touched.
 * @param input The schema to sort
 * @returns A sorted schema
 * @throws
 * - Stack overflow on very deep object inputs (this method is recursive).
 */
export function sortObject<T>(input: T): T {
    if(typeof input !== "object" || input === null) {
        return input;
    } else if(Array.isArray(input)) {
        return input.sort().map(v => {
            return sortObject(v);
        }) as T;
    } else {
        const inputObj: Record<string, any> = input;
        const newObj: T = {} as any;
        for(const key of Object.keys(input).sort()) {
            newObj[key as keyof T] = sortObject(inputObj[key])
        }
        return newObj;
    }
}

/**
 * Pick random values out of an array.
 * @param arr Array to pick items out of.
 * @param amount The number of items to pick. If less than or equal to 0, no items will be picked.
 * If greater than or equal to the length of the array, all items will be picked, but in a random order.
 * @returns An array with all of the randomly picked items.
 */
export function pickRandom<T>(arr: T[], amount: number): T[] {
    const output: T[] = [];
    const arrCopy = [...arr]
    amount = Math.min(amount, arr.length)
    for(let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * arrCopy.length);
        output.push(arrCopy.splice(randomIndex, 1)[0])
        logger(chalk.dim("Picked random value: " + output[output.length - 1]), true);
    }
    return output;
}
/**
 * Create a string of the passed lines encapsulated in a box. The box is automatically sized to fit the longest line,
 * and the text is centered on all shorter lines. Each line is its own string within the returned array.
 *
 * @example
 * console.log(textBox(["You won!", "Congratulations, you did it!"]).join('\n'))
 * // --------------------------------
 * // |           You won!           |
 * // | Congratulations, you did it! |
 * // --------------------------------
 * @param lines Lines to print within the box
 * @param boxColor A Chalk instance that is used to color the box outline
 * @param textColor A Chalk instance that is used to color the text within the box
 * @returns An array of strings containing the text box, where each string is one line of the box. No new lines or
 * characters before the first `-`, or after the last `-`.
 */
export function textBox(lines: string[], boxColor?: ChalkInstance, textColor?: ChalkInstance): string[] {
    const boxSideMargins = 1;
    let boxWidth = boxSideMargins * 2;
    for(const line of lines) {
        const lineWidth = line.length + boxSideMargins * 2;
        if(lineWidth > boxWidth) {
            boxWidth = lineWidth;
        }
    }


    let topLines = '-'.repeat(boxWidth + 2)
    let sideLines = '|';
    if(boxColor) {
        topLines = boxColor(topLines);
        sideLines = boxColor(sideLines);
    }
    const output: string[] = [];
    output.push(topLines)
    for(const line of lines) {
        const spacesToCenter = (boxWidth - line.length) / 2;
        const coloredLine = textColor ? textColor(line) : line;
        output.push(sideLines + ' '.repeat(Math.floor(spacesToCenter)) + coloredLine + ' '.repeat(Math.ceil(spacesToCenter)) + sideLines);
    }
    output.push(topLines)

    return output;
}

/**
 * Write text to stdout, overwriting the current line(s). Multiple lines can be printed by passing an array, and they
 * will all be overwritten by the next call to `log`, unless you append a `\n` to the last string.
 * the string.
 * @param text Text to print to stdout.
 * @param debug Whether to only print this text if debug mode is enabled.
 */
export function logger(text: string | string[], debug = false) {
    if(!debug || process.env.MCSB_DEBUG === "true") {
        if(!Array.isArray(text)) {
            text = [text];
        }
        for(let i = 0; i < text.length; i++) {
            console.log(text[i]);
        }
    }
}

/**
 * Create TypeScript type definition files based on a JSON schema.
 * @param schema The JSON schema to create type definitions for.
 * @param name Output file name, without the extension (`.d.ts` will be appended).
 * @param outdir Directory to write TypeScript definitions file to.
 * @returns A `Promise` that resolves when the TypeScript definition file has been written.
 * @throws
 * - `Error` on file system error
 * - `Error` if `schema` is not a valid JSON schema
 */
export async function writeSchemaTypedefs(schema: Record<string, any>, name: string, outdir: string) {
    // compile schema to TypeScript
    const ts = await compile(schema, name, {
        additionalProperties: true
    })

    // Write compiled TypeScript to .d.ts files
    await fs.promises.mkdir(outdir, { recursive: true });
    await fs.promises.writeFile(join(outdir, `${name}.d.ts`), ts)
}

/**
 * Copy static files that should be compiled with the distributed package, such as the schema `.json` files, README,
 * LICENSE, and package.json.
 * @returns A `Promise` that resolves when all files have been copied.
 * @throws
 * - `Error` on file I/O error
 */
export async function copyExtraFiles() {
    // Tiny wrapper around fs.cp for logging the file we're copying
    async function copy(from: string, to: string) {
        logger(chalk.cyan("Copying", from, "to", to));
        await fs.promises.cp(from, to, {
            recursive: true
        });
    }
    await copy(join(__dirname, "schemas"), join(__dirname, "..", "dist", "schemas"))
    await copy(join(__dirname, "..", "..", "..", "LICENSE"), join(__dirname, "..", "dist", "LICENSE"))
}

/**
 * Create the `index.js` and `index.d.ts` files in the `dist` directory.
 * @returns A `Promise` that resolves when all files have been written.
 * @throws
 * - `Error` on file I/O error
 */
export async function createIndexFiles() {
    // Create a default index.js file with no contents
    await fs.promises.writeFile(join(__dirname, "..", "dist", "index.js"), "module.exports = {}")

    // Create a default index.d.ts file that contains all types concatenated
    const typeFiles = await fs.promises.readdir(join(__dirname, "..", "dist", "types"));
    logger(chalk.dim("Found type definition files: " + typeFiles.join(", ") + "\n"), true);
    let indexContents = "";
    for(const type of typeFiles) {
        indexContents += `export * from "./types/${type}"\n`
    }
    await fs.promises.writeFile(join(__dirname, "..", "dist", "index.d.ts"), indexContents);
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
export function areSchemasCompatible(a: JSONSchema4, b: JSONSchema4): boolean {
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
export function matchingPatternProperty(propName: string, schema: JSONSchema4): string | null {
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
 * ```ts
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
export function mergeSchemas(base: JSONSchema4, source: JSONSchema4): JSONSchema4 {
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
    if(baseAnyOf.length === 1 && (!base.anyOf || Object.keys(base).length === 1)) {
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
 * Generate a string containing the stack of an error and the stack for all causes, recursively.
 * @param e Thrown value to get the stack for. If not an `Error`, then the value as a String is returned.
 */
export function getFullStack(e: unknown): string {
    let str = (e instanceof Error ? e.stack : String(e)) ?? "";
    if(e instanceof Error && e.cause) {
        str += `\nCause: ${ getFullStack(e.cause) }`;
    }
    return str;
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
export function visit(value: any, callback: (key: string | number, parent: any) => any) {
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
