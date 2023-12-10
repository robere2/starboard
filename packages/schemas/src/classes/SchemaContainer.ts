import Ajv, {Options, ValidateFunction} from "ajv";
import {JSONSchema4} from "json-schema";
import toJsonSchema from "gen-json-schema";
import {logger, mergeSchemas, visit} from "../util";
import chalk from "chalk";
import fs from "fs";

export type AddUrlCallback = (url: string, schema: SchemaContainer) => void;
type TransformCallback = (input: Record<string, any>, addUrl: AddUrlCallback) => Record<string, any> | Record<string, any>[] | void


/**
 * Compiling Ajv schemas into validation functions is expensive. This class helps to avoid unnecessary schema
 * compilations by caching validation functions and only recompiling when the schema has changed.
 */
export abstract class SchemaContainer<T = unknown> {

    public ajv: Ajv;

    private cachedValidate?: ValidateFunction<T>;
    private transformers: TransformCallback[] = [];
    private dataUrls: string[] = [];

    protected constructor(options: Options) {
        this.ajv = new Ajv(options);
    }

    public abstract set schema(val: JSONSchema4);
    public abstract get schema();

    public get validate(): ValidateFunction<T> {
        if(!this.cachedValidate) {
            this.cachedValidate = this.ajv.compile<T>(this.schema)
        }
        return this.cachedValidate;
    }

    /**
     * Updates the JSON schema to match the given data.
     *
     * This is intended for merging API responses from a loosely defined API/database, where an absent value is equivalent
     * to its default value. The consequence of this is that we might not know all the possible key/value pairs. This
     * method will merge schemas matching each data entry into the base given schema. Missing fields will not be removed
     * or touched. If there is a conflict, they will be merged into an `anyOf` array at the highest-possible specificity.
     *
     * @param {Record<string, any>[]} data - An array of data used to generate a new JSON schema.
     * @throws Error if there are any JSON schema errors that the algorithm was not able to resolve, or that were
     * inadvertently introduced by the algorithm.
     */
    public update(data: Record<string, any>[]): this {
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
            this.schema = mergeSchemas(this.schema, dataSchema);

            logger(chalk.dim("WORKER > Re-validating final schema to check for unexpected errors"), true)
            this.validate(datum);
            logger(chalk.dim("WORKER > Final validation complete"), true)
            if(this.validate.errors?.length ?? 0 >= 1) {
                logger(chalk.dim("WORKER > Unexpected errors within final validation"), true)
                const schemaDumpFile = "schema-" + Date.now() + ".dmp";
                fs.writeFileSync(schemaDumpFile, JSON.stringify({
                    schema: this.schema,
                    data: datum
                }).replaceAll(/\r\n/g, '\n')) // Force LF line endings
                throw new Error("Unexpected errors were introduced after the addition of new schema properties. " +
                    `Schema and data has been dumped to ${schemaDumpFile}.\n` +
                    `Errors: ${this.ajv.errorsText(this.validate.errors)}`)
            }
        }
        return this;
    }

    public transform(callback: TransformCallback) {
        this.transformers.push(callback);
    }

    public addUrl(...urls: string[]): void {
        this.dataUrls.push(...urls);
    }

    public getUrls(): string[] {
        return [...this.dataUrls];
    }

    public applyTransformers(response: Record<string, any>, addUrl: AddUrlCallback): Record<string, any> | Record<string, any>[] {
        let current: Record<string, any> | Record<string, any>[] = response;
        for(const transformer of this.transformers) {
            const next = transformer(current, addUrl);
            if(next !== undefined) {
                current = next;
            }
        }
        return current;
    }

    protected resetCache(): void {
        this.cachedValidate = undefined;
    }
}
