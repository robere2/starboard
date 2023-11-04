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
import chalk, {ChalkInstance} from "chalk";
import * as readline from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
    for(let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * arrCopy.length);
        output.push(arrCopy.splice(randomIndex, 1)[0])
        logger(chalk.dim("Picked random value: " + output[output.length - 1] + "\n"), true);
    }
    return output;
}

/**
 * Hash a string into it's md5 hexadecimal output.
 * @param str String to hash
 * @returns An MD5 hash encoded in a hexadecimal string
 */
function md5(str: string): string {
    return crypto.createHash("md5").update(str).digest().toString("hex");
}

let totalRequests = 0;
/**
 * Get the total number of Hypixel API HTTP requests sent by the generator via {@link processHypixelSchemaChanges}.
 * @returns The total number of requests sent, including unsuccessful ones.
 */
export function getTotalRequests(): number {
    return totalRequests;
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
        allErrors: true,
        inlineRefs: false
    }).compile(fullSchema)

    for (const url of urls) {
        logger([
            chalk.cyanBright("Processing schema changes for type", input.defName),
            chalk.dim("Sending request to", url),
        ]);
        const res = await fetch(url, {
            headers: {"API-Key": process.env.HYPIXEL_GEN_API_KEY}
        });
        totalRequests++;

        responses[url] = await res.json() as any; // Type checking is done below
        // Assert that a valid Hypixel API response was received
        if (typeof responses[url] !== "object" || Array.isArray(responses[url]) || responses[url] == null) {
            throw new Error('HTTP response did not include a JSON object.');
        }
        if (!responses[url].success) {
            // Unlike the rest of the API, a player without a SkyBlock bingo card will mark the request as failed
            // instead of just setting the requested value to null.
            if(responses[url].cause === "No bingo data could be found") {
                continue;
            }
            throw new Error('Hypixel API Error: ' + responses[url].cause);
        }

        let data = responses[url];

        // Perform full schema validation before preprocessing down to the schema definition
        validateFullSchema(data)

        if(validateFullSchema.errors) {
            logger([
                "Validation error(s) for full schema:",
                JSON.stringify(validateFullSchema.errors) + "\n"
            ], true);
        }

        // Currently all type definitions cannot be arrays. Thus, we can use arrays as a way to iterate multiple values
        // in the same response (e.g. all boosters from `/boosters`)
        if(input.dataPreprocess) {
            logger(chalk.dim("Calling preprocessor\n"), true);
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
                logger(chalk.dim("No schema changes detected\n"), true)
                continue;
            }
            logger(chalk.dim("Schema changes detected" + "\n"), true);
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
                                    logger(chalk.dim("New key: " + key + "\n"), true)
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
        logger(chalk.dim("Calling postprocessor\n"), true);
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
        newSchemaPropsLoop:
        for(const prop in newSchema.properties) {
            if(!finalSchema.properties[prop]) {
                // Before adding property, first check if it's recognized as a pattern property on the finalSchema.
                // If it is a pattern, combine with the pattern property schema instead. Otherwise we can
                for(const pattern in finalSchema.patternProperties ?? {}) {
                    if(new RegExp(pattern).test(prop)) {
                        logger(chalk.dim(`Property ${prop} matches existing pattern property ${pattern}\n`), true)
                        finalSchema.patternProperties![pattern] = combineSchemas(finalSchema.patternProperties![pattern], newSchema.properties[prop]);
                        continue newSchemaPropsLoop; // We don't want to break as that'd write to "properties"
                    }
                }
                logger(chalk.dim(`Property ${prop} added as a new property\n`), true)
                finalSchema.properties[prop] = structuredClone(newSchema.properties[prop]);
            } else {
                logger(chalk.dim(`Property ${prop} extended on original schema\n`), true)
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
            logger(chalk.dim(`Added array items\n`), true)
            finalSchema.items.properties = structuredClone(newSchema.items.properties);
        } else {
            logger(chalk.dim(`Updated array items\n`), true)
            finalSchema.items.properties = combineSchemas(finalSchema.items.properties, newSchema.items.properties);
        }
    }

    return finalSchema
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
        logger('\n' + JSON.stringify(validate.errors) + '\n');
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

let previousLog: string[] = [];
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
        if(!previousLog[previousLog.length - 1]?.endsWith('\n')) {
            clearLines(previousLog?.length)
            readline.moveCursor(process.stdout, 0, -text.length);
        }
        for(let i = 0; i < text.length; i++) {
            readline.moveCursor(process.stdout, 0, 1);
            process.stdout.write(text[i]);
            if(i < text.length - 1) {
                process.stdout.write('\n')
            }
        }
        previousLog = text;
    }
}

export function clearLines(count: number): void {
    readline.moveCursor(process.stdout, 0, -count);
    for(let i = 0; i < count; i++) {
        readline.moveCursor(process.stdout, 0, 1);
        readline.clearLine(process.stdout, 0);
    }
    readline.cursorTo(process.stdout, 0);
}
