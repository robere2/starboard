import fs from "fs";
import {copyExtraFiles, createIndexFiles, logger, textBox, writeSchemaTypedefs} from "./tools.js";
import chalk from "chalk";
import {allSchemas} from "./schemas";

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
