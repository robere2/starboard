import fs from "fs";
import Schemas from "./schemas.js"
import {copyExtraFiles, createIndexFiles, log, writeSchemaTypedefs} from "./tools.js";
import chalk from "chalk";

for(const schemaKey in Schemas) {
    log(chalk.cyan(`Writing type definitions for ${chalk.cyanBright(schemaKey)}...`))
    const input = Schemas[schemaKey as keyof typeof Schemas];
    const fullSchema = JSON.parse((await fs.promises.readFile(input.schemaPath)).toString())
    if(input.dtsOutDir) {
        await writeSchemaTypedefs(fullSchema, input.defName, input.dtsOutDir)
    }
}

await copyExtraFiles();
await createIndexFiles();
