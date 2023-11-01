import {compile} from 'json-schema-to-typescript'
import * as fs from "fs";
import {dirname, join} from "path"
import {fileURLToPath} from "url"
import Ajv from "ajv";
import { diff } from "json-diff";
import toJsonSchema, {JSONSchema3or4} from "gen-json-schema";
import {SchemaData} from "./SchemaData";

const __dirname = dirname(fileURLToPath(import.meta.url))

await processSchemaChanges({
    defName: "HypixelPlayer",
    schemaPath: join(__dirname, '..', 'schemas', 'hypixel', 'player.json'),
    dtsOutDir: join(__dirname, '..', '..', 'types'),
    testUrls: []
})

async function processSchemaChanges(input: SchemaData) {
    const fullSchema = JSON.parse((await fs.promises.readFile(input.schemaPath)).toString())
    const schemaDef: JSONSchema3or4 | undefined = fullSchema.definitions?.[input.defName] ?? undefined;

    if(!schemaDef) {
        throw new Error(`Schema definition ${input.defName} could not be found in the given schema!\nPath: ${input.schemaPath}`);
    }

    let urls: string[];
    if(Array.isArray(input.testUrls)) {
        urls = input.testUrls;
    } else {
        urls = await input.testUrls();
    }

    for(const url of urls) {
        const req = new 
        const changesDiff = findSchemaChangesFromRequest(schemaDef, );
    }

    if(!changesDiff) {
        console.log(undefined);
    } else {
        const changesSchema = toJsonSchema(changesDiff, {
            strings: {
                detectFormat: false
            },
            objects: {
                preProcessFnc: (obj, defaultFunc) => {
                    return defaultFunc(Object.fromEntries(Object
                        .entries(obj)
                        .map(([key, value]) => {
                            if(key.endsWith("__added")) {
                                key = key.slice(0, -7)
                            }
                            return [key, value]
                        })
                    ));
                }
            }
        })
        console.log(JSON.stringify(combineSchemas(schemaDef, changesSchema)));

        await writeSchemaTypedefs(fullSchema, input.defName, input.dtsOutDir)
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
function combineSchemas(originalSchema: JSONSchema3or4, newSchema: JSONSchema3or4): JSONSchema3or4 {
    const finalSchema = structuredClone(originalSchema);

    if(newSchema.properties) {
        if(!finalSchema.properties) {
            finalSchema.properties = {};
        }
        for(const prop in newSchema.properties) {
            if(!finalSchema.properties[prop]) {
                finalSchema.properties[prop] = structuredClone(newSchema.properties[prop]);
            } else {
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
            finalSchema.items.properties = structuredClone(newSchema.items.properties);
        } else {
            finalSchema.items.properties = combineSchemas(finalSchema.items.properties, newSchema.items.properties);
        }
    }

    return finalSchema
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
async function writeSchemaTypedefs(schema: Record<string, any>, name: string, outdir: string) {
    // compile schema to TypeScript
    const ts = await compile(schema, name, {
        additionalProperties: true
    })

    // Write compiled TypeScript to .d.ts files
    await fs.promises.mkdir(outdir, { recursive: true });
    await fs.promises.writeFile(join(outdir, `${name}.d.ts`), ts)
}

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
function findSchemaChanges(schema: JSONSchema3or4, input: Record<string, any>): Record<string, any> {
    const allValues = structuredClone(input)
    const definedValues = structuredClone(input)

    const validate = new Ajv().compile(schema);
    const validateAndRemove = new Ajv({removeAdditional: "all"}).compile(schema);

    validate(allValues);
    validateAndRemove(definedValues);

    return diff(definedValues, allValues, {
        keysOnly: true
    })
}

async function findSchemaChangesFromRequest(schema: JSONSchema3or4, req: Request, preprocessor?: (v: Record<string, any>) => Record<string, any>): Promise<Record<string, any>> {
    const res = await fetch(req);

    // Type check JSON before re-assigning to a different variale to gain the new type inference
    const unknownData = await res.json();
    if(typeof unknownData !== "object" || Array.isArray(unknownData) || unknownData == null) {
        throw new Error('HTTP response did not include a JSON object.');
    }
    let data = unknownData;

    if(preprocessor) {
        data = preprocessor(data);
    }

    return findSchemaChanges(schema, data)
}

