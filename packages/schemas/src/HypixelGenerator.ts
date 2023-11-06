import {dirname, join} from "path";
import {fileURLToPath} from "url";
import workerpool from "workerpool";
import chalk from "chalk";
import {LoadedSchemaData, SchemaData} from "./SchemaData";
import fs from "fs";
import {JSONSchema4} from "json-schema";
import {initialGenerationUrlList} from "./schemas";
import {logger, sortObject} from "./common";
import {HypixelApiError} from "./HypixelApiError";

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Type of the callback that clients can provide to {@link processAllHypixelData} to process API responses. This is used
 * by {@link processAllHypixelData}.
 * @see {@link processAllHypixelData}
 * @see {@link hypixelRequest}
 */
type ApiDataCallback = (url: string, schema: SchemaData, data: Record<string, any> | Record<string, any>[]) => Promise<void> | void

/**
 * The `HypixelGenerator` is responsible for fetching data from the Hypixel API and generating updated JSON schemas
 * based off of it.
 */
export class HypixelGenerator {
    /**
     * Worker pool is used to offload the CPU-heavy tasks of compiling, validating, and updating the schema.
     */
    private readonly pool = workerpool.pool(join(__dirname, 'generator-worker.ts'));
    /**
     * Total number of URLs that have been processed & their schemas updated.
     * @see {@link percentCompleted}
     * @see {@link getCompletedRequests}
     */
    private totalUrlsCompleted = 0;
    /**
     * Cache of schemas loaded from the file system, mapping their file path + definition to their
     * {@link LoadedSchemaData} object. Since the processing of each API response is self-contained, we store all
     * processing results here, and then once all URLs are processed, finally write all our schemas back to disk.
     * @see {@link getSchema}
     * @see {@link saveSchemas}
     */
    private loadedSchemas: Record<string, LoadedSchemaData> = {}
    /**
     * Constant of how much to delay each Hypixel API request by in milliseconds. This is multipurpose:
     *  a) The API has a limit on how many requests you can send per minute
     *  b) this gives operators the chance to cancel an operation before 100+ API requests are sent out
     */
    private readonly requestDelay = 150;
    /**
     * Array of Promises that will resolve with the body of an HTTP request sent out by this generator via
     * {@link hypixelRequest}. We use this to keep track of how many requests are still pending by comparing the
     * length of this array to the value stored in {@link totalUrlsCompleted}. In the same notion, this array's length
     * is used to update
     */
    private allRequests: Promise<any>[] = [];

    /**
     * Get the total number of Hypixel API HTTP requests sent by the generator via {@link run}.
     * @returns The total number of requests sent, including unsuccessful ones.
     */
    public getCompletedRequests(): number {
        return this.totalUrlsCompleted;
    }

    /**
     * Get a human-readable percentage of requests within {@link allRequests} that have been processed.
     * @returns The percentage, followed by a greater than sign. Padded with an extra space on the right side when the
     * percent is a single digit.
     * @example
     * const pct = getPercentPrefix();
     * console.log(pct + "Hello, world!");
     * // 7%  > Hello, world!
     */
    private getPercentPrefix(): string {
        const percentCompleted = this.totalUrlsCompleted / this.allRequests.length;
        const percentStr = `${Math.floor(percentCompleted * 100)}%`.padEnd(3, ' ')
        return percentStr + " > ";
    }

    /**
     * Retrieve a schema from our schema cache {@link loadedSchemas}, or if it's not present, load it from the file system.
     * @param input Data of the schema to load
     * @returns A `Promise` that resolves with the loaded schema data
     * @see {@link loadedSchemas}
     * @see {@link saveSchemas}
     */
    private async getSchema(input: SchemaData): Promise<LoadedSchemaData> {
        // FIXME this breaks when multiple schema definitions use the same schema file (e.g. pets.json)
        if(this.loadedSchemas[input.schemaPath]) {
            return this.loadedSchemas[input.schemaPath]
        }
        logger(this.getPercentPrefix() + chalk.dim("Reading file " + input.schemaPath), true)
        const fileContents = (await fs.promises.readFile(input.schemaPath)).toString()
        const schema: JSONSchema4 = JSON.parse(fileContents)
        const definition: JSONSchema4 | undefined = schema.definitions?.[input.defName] ?? undefined;

        if (!definition) {
            throw new Error(`Schema definition ${input.defName} could not be found in the given schema!\nPath: ${input.schemaPath}`);
        }

        return this.loadedSchemas[input.schemaPath] = { schema, definition, ...input };
    }

    /**
     * Save all schemas cached within {@link loadedSchemas} back to disk. Once written, the schema will be removed
     * from the {@link loadedSchemas} cache.
     * @returns A `Promise` that resolves when all schemas have been written to disk.
     * @see {@link loadedSchemas}
     * @see {@link getSchema}
     */
    private async saveSchemas(): Promise<void> {
        for(const path in this.loadedSchemas) {
            const loadedSchema = this.loadedSchemas[path];
            await fs.promises.writeFile(path, JSON.stringify(loadedSchema.schema, null, 2))
            delete this.loadedSchemas[path];
        }
    }

    /**
     * Send an API request to the Hypixel API, process it through the preprocessor if present, and then return the
     * output. The request is also added to {@link allRequests}.
     * @param url URL to send the request to.
     * @param schemaData Data about the schema we're expecting the response to follow. This is not used to actually
     * parse the data through the schema, but just to feed it through the request postprocessor. The schema parsing is
     * handled by {@link processAllHypixelData}.
     * @param callback Optional callback to await after the API response has been received and post-processed.
     * @returns A `Promise` that resolves with the full JSON-parsed API response, as it was before post-processing.
     * @throws
     * - `Error` if the HTTP request fails
     * - `Error` if the Hypixel API response has `success` equal to `false`
     */
    private hypixelRequest(url: string, schemaData: SchemaData, callback?: ApiDataCallback): Promise<Record<string, any>> {
        // Store promise in ownPromise here so we can later automatically add it to {@link allRequests}
        const ownPromise = (async () => {
            logger(this.getPercentPrefix() + chalk.dim("Queueing request to ", url))
            await new Promise(resolve => setTimeout(resolve, this.requestDelay * this.allRequests.length))

            const res = await fetch(url, {
                headers: {"API-Key": process.env.HYPIXEL_GEN_API_KEY}
            });
            logger(this.getPercentPrefix() + chalk.dim("Received response from", url));
            // API response is required to be a JSON object
            const json = await res.json() as Record<string, any>;
            if(typeof json !== "object" || Array.isArray(json) || json === null) {
                throw new Error("Malformed response received from Hypixel API: " + json)
            }

            if (!json.success) {
                // Unlike the rest of the API, a player without a SkyBlock bingo card will mark the request as failed
                // instead of just setting the requested value to null.
                if(json.cause === "No bingo data could be found") {
                    this.totalUrlsCompleted++;
                    return json;
                }
                throw new HypixelApiError(json.cause, url)
            }

            // Post processors can perform mutations on the response, and they can add URLs based on the response
            let output: Record<string, any> | Record<string, any>[] = json;
            if(schemaData.postProcess) {
                output = schemaData.postProcess(json, ([newUrl, newSchema]) => {
                    this.hypixelRequest(newUrl, newSchema, callback)
                })
            }
            if(callback) {
                await callback(url, schemaData, output);
            }
            this.totalUrlsCompleted++;
            logger(this.getPercentPrefix() + chalk.dim("Completed", url))
            return json
        })()
        this.allRequests.push(ownPromise);

        return ownPromise;
    }

    /**
     * Get data from all Hypixel API endpoints used by the generator. This method is responsible for sending the
     * requests to all initial URLs, and then waiting until all URLs have been processed, before finally resolving.
     * @param callback A function that is called for every API response, once it is received.
     * @returns A `Promise` that resolves after all requests have been completed, i.e. {@link allRequests} has a length
     * equal to the {@link getCompletedRequests} return value.
     */
    private async processAllHypixelData(callback: ApiDataCallback): Promise<void> {
        // Jumpstart the generation process by sending requests to all of the initial URLs. Additional URLs may have
        // requests sent to them by each schema's post-processor.
        for(const [url, schemaData] of initialGenerationUrlList) {
            this.hypixelRequest(url, schemaData, callback)
        }

        // Wait for all requests to all URLs to complete, then call callback with null. Since some requests may add
        // additional URLs after completing, we need to repeatedly check until we detect that no additional requests
        // have been added.
        await (async () => {
            while(this.allRequests.length > this.getCompletedRequests()) {
                await Promise.all(this.allRequests);
            }
        })()
    }

    /**
     * Run the generator, testing all of our schemas against the Hypixel API responses and looking for changes. Any
     * changes that are found will be written back to the schema.
     * @throws
     * - `Error` if the schema file does not exist
     * - `Error` if any schema file is not a valid JSON schema
     * - `Error` if any schema definition does not exist in the associated schema file in the SchemaData
     * - `Error` if any HTTP request fails
     * - `Error` if file writing for the updated schema fails
     * - Stack overflow if the schema is very deep (this method currently features recursion)
     * @returns A `Promise` that resolves to this once all schemas have been tested and updated, if necessary.
     */
    public async run(): Promise<this> {
        // Callback is called for every Hypixel API URL we query
        await this.processAllHypixelData(async (url, schema, data) => {
            // For singular data entries into a length-one array
            data = Array.isArray(data) ? data : [data];

            const loadedSchema = await this.getSchema(schema);
            const definitionSchema = loadedSchema.definition;

            // Offload schema updating to a worker thread. This includes compiling the schema. Likely a long delay
            //  between when exec() is called here and when the worker is actually started, as all workers before it run
            //  first.
            const newDefinitionSchema: JSONSchema4 = await this.pool.exec("updateSchema", [definitionSchema, data as Record<string, any>[]])

            // Sort the schema definition alphanumerically. The schema was served from cache and any updates
            // will be saved to disk by saveSchemas()
            loadedSchema.schema.definitions![schema.defName] = sortObject(newDefinitionSchema);
        })

        await this.saveSchemas();
        await this.pool.terminate()
        return this;
    }
}
