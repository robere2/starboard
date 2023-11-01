import {dirname, join} from "path"
import {fileURLToPath} from "url"
import dotenv from "dotenv";
import {SchemaData} from "./SchemaData";
import fs from "fs";
import toJsonSchema, {JSONSchema3or4} from "gen-json-schema";
import {compile} from "json-schema-to-typescript";
import Ajv, {Options, ValidateFunction} from "ajv";
import {diff} from "json-diff";
import * as crypto from "crypto";
dotenv.config();

const ajvCache: Record<string, ValidateFunction> = {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            HYPIXEL_API_KEY: string;
        }
    }
}

const __dirname = dirname(fileURLToPath(import.meta.url))

if(!process.env.HYPIXEL_API_KEY) {
    throw new Error('Required environment variable "HYPIXEL_API_KEY" is missing or malformed. Visit https://developer.hypixel.net/dashboard to get one.')
}

// The URLs we scan are dynamically determined from API responses. For example, for the `player.json` schema, we scan a
// sample of the top players on the leaderboards. In addition to that, we have some starting points for types of data
// which can't be collected from the leaderboards, or which may be edge cases. These are arrays of URLs to be scanned.
const guildsToScan: string[] = [ // Top 3 guilds
    "https://api.hypixel.net/guild?id=5363aa4eed50df539dca00ad",
    "https://api.hypixel.net/guild?id=53bd67d7ed503e868873eceb",
    "https://api.hypixel.net/guild?id=56ece7c40cf2e4f9ffcc284e",
];
const playersToScan: string[] = [
    "https://api.hypixel.net/player?uuid=f7c77d999f154a66a87dc4a51ef30d19", // hypixel
    "https://api.hypixel.net/player?uuid=b876ec32e396476ba1158438d83c67d4", // Technoblade
    "https://api.hypixel.net/player?uuid=869c2a8943b041a8865667a2cc8c7923", // X
];


const boosterChanges = await processHypixelSchemaChanges({
    defName: "HypixelBooster",
    schemaPath: join(__dirname, 'schemas', 'hypixel', 'boosters.json'),
    dtsOutDir: join(__dirname, '..', 'types'),
    dataPreprocess: (input) => input.boosters,
    testUrls: ["https://api.hypixel.net/boosters"]
})
const leaderboardChanges = await processHypixelSchemaChanges({
    defName: "HypixelLeaderboard",
    schemaPath: join(__dirname, 'schemas', 'hypixel', 'leaderboards.json'),
    dtsOutDir: join(__dirname, '..', 'types'),
    dataPreprocess: (input) => {
        return Object.values(input.leaderboards).flat()
    },
    testUrls: ["https://api.hypixel.net/leaderboards"]
})

// Flatten all leaderboards down into an array containing just player UUIDs, then pass to the Set constructor to remove
// duplicates. Spread back into array so we can get values at an index.
const allUniqueLeaderboardPlayers = [
    ...new Set<string>(
        Object.values(leaderboardChanges.responses["https://api.hypixel.net/leaderboards"].leaderboards)
            .flat()
            .map(v => (v as any).leaders ?? [])
            .flat()
    )
]

// Pick 25 random players from all leaderboards
let leaderboardPlayersCount = 25;
if(allUniqueLeaderboardPlayers.length < leaderboardPlayersCount) {
    leaderboardPlayersCount = allUniqueLeaderboardPlayers.length;
}
for(let i = 0; i < leaderboardPlayersCount; i++) {

    const randomIndex = Math.floor(allUniqueLeaderboardPlayers.length * Math.random());
    playersToScan.push(`https://api.hypixel.net/player?uuid=${allUniqueLeaderboardPlayers[randomIndex]}`);
    allUniqueLeaderboardPlayers.splice(randomIndex, 1);
}

const guildChanges = await processHypixelSchemaChanges({
    defName: "HypixelGuild",
    schemaPath: join(__dirname, 'schemas', 'hypixel', 'guild.json'),
    dtsOutDir: join(__dirname, '..', 'types'),
    dataPreprocess: (input) => input.guild,
    testUrls: guildsToScan
})

await processHypixelSchemaChanges({
    defName: "HypixelPlayer",
    schemaPath: join(__dirname, 'schemas', 'hypixel', 'player.json'),
    dtsOutDir: join(__dirname, '..', 'types'),
    dataPreprocess: (input) => input.player,
    testUrls: playersToScan
})

// -------------------------------------------------------------

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
    const fullSchema = JSON.parse((await fs.promises.readFile(input.schemaPath)).toString())
    const schemaDef: JSONSchema3or4 | undefined = fullSchema.definitions?.[input.defName] ?? undefined;

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
            headers: {"API-Key": process.env.HYPIXEL_API_KEY}
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
            const changesSchema = toJsonSchema(changesDiff, {
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
            })

            newSchemaDef = combineSchemas(newSchemaDef, changesSchema);
        }
    }

    fullSchema.definitions[input.defName] = newSchemaDef;
    await fs.promises.writeFile(input.schemaPath, JSON.stringify(fullSchema, null, 2))
    await writeSchemaTypedefs(fullSchema, input.defName, input.dtsOutDir)

    return {
        responses,
        schema: fullSchema
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
export function combineSchemas(originalSchema: JSONSchema3or4, newSchema: JSONSchema3or4): JSONSchema3or4 {
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
export function findSchemaChanges(schema: JSONSchema3or4, input: Record<string, any>): Record<string, any> {
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
