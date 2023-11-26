import {dirname, join} from "path";
import {fileURLToPath} from "url";
import workerpool from "workerpool";
import chalk from "chalk";
import {LoadedSchemaData, SchemaData} from "./SchemaData";
import fs from "fs";
import {JSONSchema4} from "json-schema";
import {initialGenerationUrlList} from "./schemas";
import {logger, mergeSchemas, sortObject} from "./util";
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
    private readonly requestDelay = 250;
    /**
     * Map of URLs to Promises that will resolve with the body of an HTTP request sent out by this generator via
     * {@link hypixelRequest} to the matching URL. We use this to keep track of how many requests are still pending by
     * comparing the number of keys to the value stored in {@link totalUrlsCompleted}.
     */
    private allRequests: Map<string, Promise<any>> = new Map();

    /**
     * Get the total number of Hypixel API HTTP requests sent by the generator via {@link run}.
     * @returns The total number of requests sent, including unsuccessful ones.
     */
    public getCompletedRequests(): number {
        return this.totalUrlsCompleted;
    }

    public getTotalRequests(): number {
        return this.allRequests.size;
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
        const percentCompleted = this.totalUrlsCompleted / this.getTotalRequests();
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
        const schemaKey = `${input.schemaPath}#${input.defName}`;
        if(this.loadedSchemas[schemaKey]) {
            return this.loadedSchemas[schemaKey]
        }
        logger(this.getPercentPrefix() + chalk.dim("Reading file " + input.schemaPath), true)
        const fileContents = (await fs.promises.readFile(input.schemaPath)).toString()
        const schema: JSONSchema4 = JSON.parse(fileContents)
        const definition: JSONSchema4 | undefined = schema.definitions?.[input.defName] ?? undefined;

        if (!definition) {
            throw new Error(`Schema definition ${input.defName} could not be found in the given schema!\nPath: ${input.schemaPath}`);
        }

        return this.loadedSchemas[schemaKey] = { schema, definition, ...input };
    }

    /**
     * Save all schemas cached within {@link loadedSchemas} back to disk. Once written, the schema will be removed
     * from the {@link loadedSchemas} cache.
     * @returns A `Promise` that resolves when all schemas have been written to disk.
     * @see {@link loadedSchemas}
     * @see {@link getSchema}
     */
    private async saveSchemas(): Promise<void> {
        // Merge all schemas that share a common .json file. We do this because the current implementation has a
        // separate LoadedSchemaData instance for each definition modified by the generator, and we don't want one to
        // overwrite the other(s). Changing this would require being able to traverse $refs.
        const mergedSchemas: Record<string, JSONSchema4> = {};
        for(const schemaKey in this.loadedSchemas) {
            const path = schemaKey.split('#')[0]
            const loadedSchema = this.loadedSchemas[schemaKey];
            mergedSchemas[path] = mergeSchemas(mergedSchemas[path] ?? {}, loadedSchema.schema)
            delete this.loadedSchemas[schemaKey];
        }

        for(const path in mergedSchemas) {
            await fs.promises.writeFile(path, JSON.stringify(mergedSchemas[path], null, 2))
        }

        // We have to do this loop after we've written all files to disk, as we don't want any other async methods
        // attempting to re-access the schema before it's been written to disk.
        for(const schemaKey in this.loadedSchemas) {
            delete this.loadedSchemas[schemaKey];
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
    private async hypixelRequest(url: string, schemaData: SchemaData, callback?: ApiDataCallback): Promise<Record<string, any>> {
        logger(this.getPercentPrefix() + chalk.dim("Queueing request to ", url))
        await new Promise(resolve => setTimeout(resolve, this.requestDelay *  this.getTotalRequests()))

        const res = await fetch(url, {
            headers: {"API-Key": process.env.HYPIXEL_GEN_API_KEY!}
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
                this.allRequests.set(newUrl, this.hypixelRequest(newUrl, newSchema, callback))
            })
            // Some things, like current elections or requests for invalid players, aren't always defined. I have
            // not thought of a great solution other than to skip the value and assume that our schema properly has
            // that value marked as optional.
            if(!output) {
                logger(
                    this.getPercentPrefix() +
                    chalk.yellow(`Received "${String(output)}" from post-processor for ${schemaData.defName}. Skipping.`)
                )
                this.totalUrlsCompleted++;
                return json;
            }
        }
        if(callback) {
            await callback(url, schemaData, output);
        }
        this.totalUrlsCompleted++;
        logger(this.getPercentPrefix() + chalk.dim("Completed", url))
        return json
    }

    /**
     * Get data from all Hypixel API endpoints used by the generator. This method is responsible for sending the
     * requests to all initial URLs, and then waiting until all URLs have been processed, before finally resolving.
     * @param callback A function that is called for every API response, once it is received.
     * @returns A `Promise` that resolves after all requests have been completed, i.e. {@link allRequests} has a length
     * equal to the {@link getCompletedRequests} return value.
     */
    private async processAllHypixelData(callback: ApiDataCallback): Promise<void> {
        const loggerInterval = setInterval(() => {
            logger(this.getPercentPrefix() + chalk.dim(`${this.getTotalRequests() - this.getCompletedRequests()} outstanding requests to be received and/or processed.`))
        }, 5000)
        // Jumpstart the generation process by sending requests to all of the initial URLs. Additional URLs may have
        // requests sent to them by each schema's post-processor.
        for(const [url, schemaData] of initialGenerationUrlList) {
            this.allRequests.set(url, this.hypixelRequest(url, schemaData, callback))
        }

        // Wait for all requests to all URLs to complete. Maps iterate by insertion order, so any requests added later
        // won't be missed.
        for(const [url, request] of this.allRequests.entries()) {
            await request.catch((e) => {
                if(e instanceof Error) {
                    console.error(chalk.red(
                        `An error occurred while processing ${url}\n` +
                        `${e.name}: ${e.message}\n` +
                        `${e.stack}`
                    ))
                } else {
                    console.error(chalk.red(`An error occurred while processing ${url}\n${e}`))
                }
                process.exit(1);
            })
        }
        clearInterval(loggerInterval)
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
        let i = 1;
        // Callback is called for every Hypixel API URL we query
        await this.processAllHypixelData(async (url, schema, data) => {
            const reqId = i++;
            logger(this.getPercentPrefix() + chalk.dim(`Received response for request ${reqId}`), true)
            // For singular data entries into a length-one array
            data = Array.isArray(data) ? data : [data];

            const loadedSchema = await this.getSchema(schema);
            const definitionSchema = loadedSchema.definition;
            logger(this.getPercentPrefix() + chalk.dim(`Loaded schema for request ${reqId}`), true)

            // Offload schema updating to a worker thread. This includes compiling the schema. Likely a long delay
            //  between when exec() is called here and when the worker is actually started, as all workers before it run
            //  first.
            const newDefinitionSchema: JSONSchema4 = await this.pool.exec("updateSchema", [definitionSchema, data as Record<string, any>[]])
            logger(this.getPercentPrefix() + chalk.dim(`Updated schema for request ${reqId}`), true)

            // Sort the schema definition alphanumerically. The schema was served from cache and any updates
            // will be saved to disk by saveSchemas(). We also merge the new schema with the loaded schema, since
            // this schema could have also been modified by other calls to this callback, and we don't want to overwrite
            // those.
            loadedSchema.schema.definitions![schema.defName] = sortObject(
                mergeSchemas(newDefinitionSchema, loadedSchema.schema.definitions![schema.defName])
            );
            logger(this.getPercentPrefix() + chalk.dim(`Sorted schema for request ${reqId}`), true)
        })

        await this.saveSchemas();
        await this.pool.terminate()
        return this;
    }
}
