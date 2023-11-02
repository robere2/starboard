import Schemas from "./schemas.js";
import crypto from "crypto";
import {SchemaData} from "./SchemaData";
import {JSONSchema4} from "json-schema";
import fs from "fs";
import Ajv, {Options, ValidateFunction} from "ajv";
import toJsonSchema from "gen-json-schema";
import {diff} from "json-diff";
import {compile} from "json-schema-to-typescript";
import {dirname, join} from "path";
import {fileURLToPath} from "url";

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Pick 25 player UUIDs at random from the leaderboards in the response from the `/leaderboards` endpoint. This gives
 * us a good sample of active players.
 * @remarks The returned array's length could be less than 25 if there aren't at least 25 players on all leaderboards,
 * but practically this will not happen (usually there is around 5,000 unique players, as of writing).
 * @param body JSON-parsed response body from the Hypixel API
 * @returns An array of 25 player UUIDs.
 */
export function pickRandomLeaderboardPlayers(body: any): string[] {
    // Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to
    // remove duplicates. Spread back into array so we can get values at an index.
    const allUniqueLeaderboardPlayers = [
        ...new Set<string>(
            Object.values(body.leaderboards)
                .flat()
                .map(v => (v as any).leaders ?? [])
                .flat()
        )
    ]

    // Pick 25 random players from all leaderboards
    let leaderboardPlayersCount = 25;
    const pickedPlayers: string[] = [];
    if(allUniqueLeaderboardPlayers.length < leaderboardPlayersCount) {
        leaderboardPlayersCount = allUniqueLeaderboardPlayers.length;
    }
    for(let i = 0; i < leaderboardPlayersCount; i++) {
        const randomIndex = Math.floor(allUniqueLeaderboardPlayers.length * Math.random());
        pickedPlayers.push(`https://api.hypixel.net/player?uuid=${allUniqueLeaderboardPlayers[randomIndex]}`);
        allUniqueLeaderboardPlayers.splice(randomIndex, 1);
    }

    return pickedPlayers;
}

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
 * Crawl a selection of Hypixel API URLs to look for changes in the schemas. If changes exist, write them to the file
 * system. The order of schemas is important, as the output of some schemas lead as input into others.
 * @returns A `Promise` that resolves when all Hypixel schemas have been updated.
 * @throws
 * - `Error` on Hypixel API request failure
 * - `Error` on file I/O error
 * - `Error` if any of the required schema `.json` files are not present on the file system
 */
export async function updateAndBuildHypixelSchemas() {
    // The order of these function calls matters. The API response of different endpoints feeds into the
    // list of other URLs to test.
    await processHypixelSchemaChanges(Schemas.HypixelBooster)
    await processHypixelSchemaChanges(Schemas.HypixelLeaderboard)
    await processHypixelSchemaChanges(Schemas.HypixelPlayer)
    await processHypixelSchemaChanges(Schemas.HypixelGuild)
}

/**
 * Hash a string into it's md5 hexadecimal output.
 * @param str String to hash
 * @returns An MD5 hash encoded in a hexadecimal string
 */
function md5(str: string): string {
    return crypto.createHash("md5").update(str).digest().toString("hex");
}

/**
 * Read a Hypixel API schema from the file system and test it against various URLs to search for new changes. Any
 * changes that are found will be written back to the schema, and new type definitions will be generated.
 * @param input Required information about the schema, such as its file location.
 * @see {@link SchemaData} for more information on the input.
 * @returns A `Promise` that resolves to an object containing a `responses` property and a `schema` property. The
 * `responses` property is a record mapping each of the input URLs to the response body, JSON-parsed. The `schema`
 * property contains the new schema that was just written to the file system.
 * @throws
 * - `Error` if the schema file does not exist
 * - `Error` if the given schema file is not a valid JSON schema
 * - `Error` if the schema definition does not exist in the given schema file
 * - `Error` if the HTTP request(s) fail
 * - `Error` if file writing for the new schema or type definitions file fails
 * - `Error` if the schema is very deep (this method currently features recursion)
 */
export async function processHypixelSchemaChanges(input: SchemaData): Promise<{responses: Record<string, any>, schema: Record<string, any> | undefined}> {
    console.log("Processing schema changes for type", input.defName);
    const fullSchema: JSONSchema4 = JSON.parse((await fs.promises.readFile(input.schemaPath)).toString())
    const schemaDef: JSONSchema4 | undefined = fullSchema.definitions?.[input.defName] ?? undefined;

    if (!schemaDef) {
        throw new Error(`Schema definition ${input.defName} could not be found in the given schema!\nPath: ${input.schemaPath}`);
    }

    let urls: string[];
    if (Array.isArray(input.testUrls)) {
        urls = input.testUrls;
    } else {
        urls = await input.testUrls();
    }

    // newSchemaDef is modified after each URL and written back to disk after all URLs are done.
    let newSchemaDef = schemaDef;
    const responses: Record<string, any> = {};

    const validateFullSchema = new Ajv({
        allErrors: true
    }).compile(fullSchema)

    for (const url of urls) {
        console.log("Sending request to", url)
        const res = await fetch(url, {
            headers: {"API-Key": process.env.HYPIXEL_GEN_API_KEY}
        });

        responses[url] = await res.json() as any; // Type checking is done below
        // Assert that a valid Hypixel API response was received
        if (typeof responses[url] !== "object" || Array.isArray(responses[url]) || responses[url] == null) {
            throw new Error('HTTP response did not include a JSON object.');
        }
        if (!responses[url].success) {
            throw new Error('Hypixel API Error: ' + responses[url].cause);
        }

        let data = responses[url];

        // Perform full schema validation before preprocessing down to the schema definition
        validateFullSchema(data)
        if(validateFullSchema.errors) {
            console.log(validateFullSchema.errors);
        }

        // Currently all type definitions cannot be arrays. Thus, we can use arrays as a way to iterate multiple values
        // in the same response (e.g. all boosters from `/boosters`)
        if(input.dataPreprocess) {
            data = input.dataPreprocess(responses[url])
        }
        if(!Array.isArray(data)) {
            data = [data];
        }

        for(const datum of data) {
            // changesDiff is an object with all values that are already in the schema removed, even if the value
            // doesn't match the schema (e.g. an "object" is where there's supposed to be a "number")
            const changesDiff = findSchemaChanges(newSchemaDef, datum);
            if(!changesDiff) {
                continue;
            }
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
                                }
                                return [key, value]
                            })
                        ));
                    }
                }
            }) as JSONSchema4;

            newSchemaDef = combineSchemas(newSchemaDef, changesSchema);
        }
    }

    fullSchema.definitions![input.defName] = sortObject(newSchemaDef);
    await fs.promises.writeFile(input.schemaPath, JSON.stringify(fullSchema, null, 2))

    const output = {
        responses,
        schema: fullSchema
    };

    if(input.dataPostprocess) {
        input.dataPostprocess(output);
    }

    return output;
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
export function combineSchemas(originalSchema: JSONSchema4, newSchema: JSONSchema4): JSONSchema4 {
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

const ajvCache: Record<string, ValidateFunction> = {}
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

    // Compiling an AJV validator is expensive. We want to cache the compiled validator for use in future checks.
    // To do this we just hash the schema and store it in an object. For the validateAndRemove function, we just hash
    // the hash to get a new unique value.
    const schemaHash = md5(JSON.stringify(schema));
    const schemaDoubleHash = md5(schemaHash);

    let validate = ajvCache[schemaHash];
    let validateAndRemove = ajvCache[schemaDoubleHash];
    const ajvOptions: Options = {
        allErrors: true
    }
    if(!validate) {
        validate = new Ajv(ajvOptions).compile(schema);
        ajvCache[schemaHash] = validate;
    }
    if(!validateAndRemove) {
        validateAndRemove = new Ajv({
            ...ajvOptions,
            removeAdditional: "all"
        }).compile(schema);
        ajvCache[schemaDoubleHash] = validateAndRemove;
    }

    validate(allValues);
    validateAndRemove(definedValues);

    if(validate.errors) {
        console.log(validate.errors);
    }

    return diff(definedValues, allValues, {
        keysOnly: true
    })
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
        console.log("Copying", from, "to", to);
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
    let indexContents = "";
    for(const type of typeFiles) {
        indexContents += `export * from "./types/${type}"\n`
    }
    await fs.promises.writeFile(join(__dirname, "..", "dist", "index.d.ts"), indexContents);
}
