import workerpool from "workerpool";
import {JSONSchema4} from "json-schema";
import chalk from "chalk";
import toJsonSchema from "gen-json-schema";
import {logger, mergeSchemas, visit} from "./util";
import fs from "fs";
import {SchemaContainer} from "./classes/SchemaContainer";

/**
 * Updates the given JSON schema to match the given data.
 *
 * This is intended for merging API responses from a loosely defined API/database, where an absent value is equivalent
 * to its default value. The consequence of this is that we might not know all the possible key/value pairs. This
 * method will merge schemas matching each data entry into the base given schema. Missing fields will not be removed
 * or touched. If there is a conflict, they will be merged into an `anyOf` array at the highest-possible specificity.
 *
 * @param {JSONSchema4} schema - The original JSON schema to be updated.
 * @param {Record<string, any>[]} data - An array of data used to generate a new JSON schema.
 * @return {JSONSchema4} - The updated JSON schema.
 * @throws Error if there are any JSON schema errors that the algorithm was not able to resolve, or that were
 * inadvertently introduced by the algorithm.
 */
function updateSchema(schema: JSONSchema4, data: Record<string, any>[]): JSONSchema4 {

    const container = new SchemaContainer({
        allErrors: true,
        inlineRefs: false
    }, schema);

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
        container.schema = mergeSchemas(container.schema, dataSchema);

        logger(chalk.dim("WORKER > Re-validating final schema to check for unexpected errors"), true)
        container.validate(datum);
        logger(chalk.dim("WORKER > Final validation complete"), true)
        if(container.validate.errors?.length ?? 0 >= 1) {
            logger(chalk.dim("WORKER > Unexpected errors within final validation"), true)
            const schemaDumpFile = "schema-" + Date.now() + ".dmp";
            fs.writeFileSync(schemaDumpFile, JSON.stringify({
                schema: container.schema,
                data: datum
            }).replaceAll(/\r\n/g, '\n')) // Force LF line endings
            throw new Error("Unexpected errors were introduced after the addition of new schema properties. " +
                `Schema and data has been dumped to ${schemaDumpFile}.\n` +
                `Errors: ${container.ajv.errorsText(container.validate.errors)}`)
        }
    }
    return container.schema;
}

workerpool.worker({
    updateSchema
})
