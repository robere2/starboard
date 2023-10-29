import { compileFromFile } from 'json-schema-to-typescript'
import * as fs from "fs";
import {dirname, join} from "path"
import {fileURLToPath} from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

// compile from file
compileFromFile(join(__dirname, '../schemas/hypixel/Player.json'))
    .then(ts => fs.writeFileSync('Player.d.ts', ts))
