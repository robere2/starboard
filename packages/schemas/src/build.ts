import fs from "fs";
import Schemas from "./schemas.js"
import {copyExtraFiles, createIndexFiles, writeSchemaTypedefs} from "./tools.js";

for(const schemaKey in Schemas) {
    const input = Schemas[schemaKey as keyof typeof Schemas];
    const fullSchema = JSON.parse((await fs.promises.readFile(input.schemaPath)).toString())
    await writeSchemaTypedefs(fullSchema, input.defName, input.dtsOutDir)
}

await copyExtraFiles();
await createIndexFiles();
