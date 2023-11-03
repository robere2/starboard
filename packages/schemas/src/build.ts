import fs from "fs";
import Schemas from "./schemas.js"
import {copyExtraFiles, createIndexFiles, writeSchemaTypedefs} from "./tools.js";

for(const schemaKey in Schemas) {
    console.log(`Writing type definitions for ${schemaKey}...`)
    const input = Schemas[schemaKey as keyof typeof Schemas];
    const fullSchema = JSON.parse((await fs.promises.readFile(input.schemaPath)).toString())
    if(input.dtsOutDir) {
        await writeSchemaTypedefs(fullSchema, input.defName, input.dtsOutDir)
    }
}

await copyExtraFiles();
await createIndexFiles();
