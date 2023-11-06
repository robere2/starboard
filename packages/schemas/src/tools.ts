import {LoadedSchemaData, SchemaData} from "./SchemaData";
import {JSONSchema4} from "json-schema";
import fs from "fs";
import {compile} from "json-schema-to-typescript";
import {dirname, join} from "path";
import {fileURLToPath} from "url";
import chalk, {ChalkInstance} from "chalk";
import * as readline from 'readline'
import {initialGenerationUrlList} from "./schemas";
import workerpool from "workerpool";

const __dirname = dirname(fileURLToPath(import.meta.url))
const pool = workerpool.pool(join(__dirname, 'generator-worker.ts'));

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

let percentCompleted = 0;
let totalUrlsCompleted = 0;
/**
 * Get the total number of Hypixel API HTTP requests sent by the generator via {@link processHypixelSchemaChanges}.
 * @returns The total number of requests sent, including unsuccessful ones.
 */
export function getTotalRequests(): number {
    return totalUrlsCompleted;
}

function getPercentPrefix(): string {
    const percentStr = `${Math.floor(percentCompleted * 100)}%`.padEnd(3, ' ')
    return percentStr + " > ";
}

const schemaData: Record<string, LoadedSchemaData> = {}
async function getSchema(input: SchemaData): Promise<LoadedSchemaData> {
    if(schemaData[input.schemaPath]) {
        return schemaData[input.schemaPath]
    }
    logger(chalk.dim("Reading file " + input.schemaPath), true)
    const fileContents = (await fs.promises.readFile(input.schemaPath)).toString()
    const schema: JSONSchema4 = JSON.parse(fileContents)
    const definition: JSONSchema4 | undefined = schema.definitions?.[input.defName] ?? undefined;

    if (!definition) {
        throw new Error(`Schema definition ${input.defName} could not be found in the given schema!\nPath: ${input.schemaPath}`);
    }

    return schemaData[input.schemaPath] = { schema, definition, ...input };
}

type ApiDataCallback = (url: string | null, schema: SchemaData | undefined, data: Record<string, any> | Record<string, any>[] | undefined) => Promise<void> | void

/**
 * Get data from all Hypixel API endpoints used by the generator. This method is responsible for constructing and
 * scheduling of requests to the API, scheduling meaning both the order and the delay required to comply with rate
 * limits.
 *
 * @param callback A function that is called for every API response, once it is received. Once all responses have been
 * passed to `callback`, `null` is passed as the final call.
 * @returns A `Promise` that resolves after the initial list of requests has been determined. Later requests may be
 * added depending on the
 */
async function getAllHypixelApiData(callback: ApiDataCallback): Promise<void> {
    // Delay each request by 250ms. This is multipurpose:
    //  a) The API has a limit on how many requests you can send per minute
    //  b) this gives operators the chance to cancel an operation before 100+ API requests are sent out
    const requestDelay = 250;

    // Keep an array of all requests we've sent so we a) know how long to delay the next one and b) know when all
    // requests are done
    const requestArray: Promise<any>[] = [];

    /**
     * Send an API request to the Hypixel API, process it through the preprocessor if present, and then call the
     * callback with the url, schema, and response body.
     *
     * Defined internally to allow us to access requestArray and callback directly. Each schema post processor receives
     * a function they can call to send additional requests.
     * @param url URL to send the request to.
     * @param schemaData Data about the schema we're expecting the response to follow
     */
    async function queueHypixelRequest(url: string, schemaData: SchemaData): Promise<Record<string, any>> {
        await new Promise(resolve => setTimeout(resolve, requestDelay * requestArray.length))

        const res = await fetch(url, {
            headers: {"API-Key": process.env.HYPIXEL_GEN_API_KEY}
        });
        // API response is required to be a JSON object
        const json = await res.json() as Record<string, any>;
        if(typeof json !== "object" || Array.isArray(json) || json === null) {
            throw new Error("Malformed response received from Hypixel API: " + json)
        }

        if (!json.success) {
            // Unlike the rest of the API, a player without a SkyBlock bingo card will mark the request as failed
            // instead of just setting the requested value to null.
            if(json.cause === "No bingo data could be found") {
                totalUrlsCompleted++;
                percentCompleted = totalUrlsCompleted / requestArray.length;
                return json;
            }
            throw new Error('Hypixel API Error: ' + json.cause);
        }

        // Post processors can perform mutations on the response, and they can add URLs based on the response
        let output: Record<string, any> | Record<string, any>[] = json;
        if(schemaData.postProcess) {
            output = schemaData.postProcess(json, ([newUrl, newSchema]) => {

                requestArray.push(queueHypixelRequest(newUrl, newSchema))
            })
        }
        await callback(url, schemaData, output);
        totalUrlsCompleted++;
        percentCompleted = totalUrlsCompleted / requestArray.length;
        return json
    }

    // Jumpstart the generation process by sending requests to all of the initial URLs. Additional URLs may have
    // requests sent to them by each schema's post-processor.
    for(const [url, schemaData] of initialGenerationUrlList) {
        requestArray.push(queueHypixelRequest(url, schemaData))
    }

    // Wait for all requests to all URLs to complete, then call callback with null. Since some requests may add
    // additional URLs after completing, we need to repeatedly check until we detect that no additional requests
    // have been added.
    (async () => {
        while(requestArray.length > getTotalRequests()) {
            await Promise.all(requestArray);
        }
    })().then(() => {
        callback(null, undefined, undefined);
    })
}

/**
 * Read a Hypixel API schema from the file system and test it against various URLs to search for new changes. Any
 * changes that are found will be written back to the schema, and new type definitions will be generated.
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
export async function processHypixelSchemaChanges(): Promise<void> {

    let done: () => void;

    await getAllHypixelApiData(async (url, schemaOrUndef, dataOrUndef) => {
        // schema and response are only undefined when URL is null.
        if(url === null) {
            done();
            return;
        }
        const schema = schemaOrUndef!;
        let data = dataOrUndef!;

        logger([
            getPercentPrefix() + chalk.dim("Received response from", url),
        ]);

        const loadedSchema = await getSchema(schema);
        const definitionSchema = loadedSchema.definition;

        if(!Array.isArray(data)) {
            data = [data];
        }

        // Offload schema updating to a worker thread. This includes compiling the schema.
        const newDefinitionSchema: JSONSchema4 = await pool.exec("updateSchema", [definitionSchema, data as Record<string, any>[]])
        logger(getPercentPrefix() + chalk.dim("Completed", url))

        // Sort the schema definition alphanumerically. The schema was served from cache and any updates
        // will be saved to disk by saveSchemas()
        loadedSchema.schema.definitions![schema.defName] = sortObject(newDefinitionSchema);
    })

    // This promise's resolver will be called after all API requests have been received and their callbacks
    // have resolved (i.e., the updating process is complete)
    await new Promise<void>((resolve) => {
        done = resolve;
    })

    await saveSchemas();
    await pool.terminate()
}

async function saveSchemas(): Promise<void> {
    for(const path in schemaData) {
        const loadedSchema = schemaData[path];
        await fs.promises.writeFile(path, JSON.stringify(loadedSchema.schema, null, 2))
        delete schemaData[path];
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
            process.stdout.write(text[i]);
            process.stdout.write('\n')
        }
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
