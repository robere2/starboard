import fs from "fs";
import {logger, textBox} from "./common.js";
import chalk from "chalk";
import {allSchemas} from "./schemas";
import {compile} from "json-schema-to-typescript";
import {join} from "path";

const startTime = Date.now();

let fileCount = 0; // Not all schemas output types - particularly when two schemas share the same .json file
for(const schemaData of allSchemas) {
    const fullSchema = JSON.parse((await fs.promises.readFile(schemaData.schemaPath)).toString())
    if(schemaData.dtsOutDir) {
        logger(chalk.cyan(`Writing type definitions for ${chalk.cyanBright(schemaData.defName)}...`))
        await writeSchemaTypedefs(fullSchema, schemaData.defName, schemaData.dtsOutDir)
        fileCount++;
    }
}

await copyExtraFiles();
await createIndexFiles();

const endTime = Date.now();
const timeTaken = endTime - startTime;

logger([
    '\n',
    ...textBox([
        `Build complete - Took ${Math.floor(timeTaken / 60000)}m ${Math.floor(timeTaken / 1000) % 60}s`,
        `Built a total of ${fileCount} type definition files`
    ], chalk.green, chalk.green)
]);

// ----------------------------------------------------

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
