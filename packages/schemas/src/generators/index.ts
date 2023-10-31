import {compile} from 'json-schema-to-typescript'
import * as fs from "fs";
import {dirname, join} from "path"
import {fileURLToPath} from "url"
import Ajv from "ajv";
import { diff } from "json-diff";
import toJsonSchema from "to-json-schema";

const __dirname = dirname(fileURLToPath(import.meta.url))

const data = {
    _id: "51e5ae2b0cf2a5a89b742a92",
    "achievements": {
        "arena_bossed": 77,
        "arena_climb_the_ranks": 1005,
        "arena_gladiator": 77,
        "arena_gotta_wear_em_all": 4
    },
    "test": [1, 2, 3],
    "alpha": [{
        "beta": 456
    }, {
        "beta": 789
    }]
}

// Read schema from file system
const schema = JSON.parse((await fs.promises.readFile(join(__dirname, '../schemas/hypixel/player.json'))).toString())
await writeSchemaTypedefs(schema, "HypixelPlayer", join(__dirname, "..", "..", "types"))
const playerSchema = getSchemaDefinition(schema, "HypixelPlayer")!;

const changesDiff = findSchemaChanges(playerSchema, data);
if(!changesDiff) {
    console.log(undefined);
} else {
    const changesSchema = toJsonSchema(changesDiff, {
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
    console.log(JSON.stringify(combineSchemas(playerSchema, changesSchema)));
}

function getSchemaDefinition(schema: Record<string, any>, name: string): Record<string, any> | undefined {
    return schema.definitions?.[name] ?? undefined;
}

/**
 * Combine two JSON schemas on top of each other
 * @param originalSchema
 * @param newSchema
 */
function combineSchemas(originalSchema: Record<string, any>, newSchema: Record<string, any>): Record<string, any> {
    const finalSchema = structuredClone(originalSchema);

    crawl(newSchema, (identifier, value) => {
        if(identifier.length === 0) {
            return;
        }

        const currentId = identifier[identifier.length - 1] as any;
        if(finalSchema[currentId] === undefined) {
            finalSchema[currentId] = value;
        }
    })
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
export async function writeSchemaTypedefs(schema: Record<string, any>, name: string, outdir: string) {
    // compile schema to TypeScript
    const ts = await compile(schema, name, {
        additionalProperties: true
    })

    // Write compiled TypeScript to .d.ts files
    await fs.promises.mkdir(outdir, { recursive: true });
    await fs.promises.writeFile(join(outdir, `${name}.d.ts`), ts)
}

type CrawlCallbackEntry = {
    path: (number | symbol | string)[],
    value: any,
    update(newValue: any): void
}
type CrawlCallback = (entries: CrawlCallbackEntry[]) => any | Promise<any>;

export function crawlv2(objs: any[], cb: CrawlCallback): any {
    const queue: { values: any[], path: (string | number | symbol)[]}[] = [];

    queue.push({
        values: objs,
        path: []
    });

    while(queue.length > 0) {
        const item = queue.shift()!;
        const entries: CrawlCallbackEntry[] = [];
        for(const obj of item.values) {
            entries.push({
                path: item.path,
                value: obj,
                update: (newValue: any) => {

                }
            })
        }
        const result = cb(entries);
        if(result !== undefined) {
            return result;
        }


    }
}

/**
 * Crawl recursively breadth-first through an object. The callback is called for each value in the object.
 *
 * @param obj The object or array to crawl through. Technically this may also be primitives, `null`, or `undefined`,
 * however the callback will only be called once.
 * @param cb Callback to call for each value. Takes two parameters:
 *
 *  - `identifier` - An array of the keys used to access this point. For example, the property `obj.some.value[0].here`
 * would equate to an identifier of `['some', 'value', 0, 'here']`.
 * - `value` - The value located at the given identifier. Could be a primitive, object, or array.
 *
 * The callback is called for all child properties, including objects, arrays, and the values within arrays. For objects
 * and arrays, the callback is later called for all the value's child properties.
 *
 * If callback ever returns a value other than `undefined`, the crawling is stopped and the returned value is returned.
 * @returns The value returned by `callback` if it ever returns anything other than `undefined`. Otherwise, `undefined`
 * is returned.
 */
export function crawl(obj: any, cb: (identifier: (string | number | symbol)[], value: any) => any): any {
    const valuesToCrawl: { value: any, namespace: (string | number | symbol)[]}[] = [{
        value: obj,
        namespace: []
    }];
    while(valuesToCrawl.length > 0) {
        const next = valuesToCrawl.shift();
        const value = next!.value;
        const namespace = next!.namespace;
        const returnVal = cb(namespace, value);
        if(returnVal !== undefined) {
            return returnVal;
        }

        if(Array.isArray(value)) {
            for(let i = 0; i < value.length; i++) {
                valuesToCrawl.push({
                    value: value[i],
                    namespace: [...namespace, i]
                })
            }
        } else if(typeof value === "object" && value !== null) {
            for(const key in value) {
                valuesToCrawl.push({
                    value: value[key],
                    namespace: [...namespace, key]
                })
            }
        }
    }
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
export function findSchemaChanges(schema: Record<string, any>, input: Record<string, any>): Record<string, any> {
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

