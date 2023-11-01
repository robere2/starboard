import {dirname, join} from "path"
import {fileURLToPath} from "url"
import dotenv from "dotenv";
import {processHypixelSchemaChanges} from "./tools";
dotenv.config();

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            HYPIXEL_API_KEY: string;
        }
    }
}

const __dirname = dirname(fileURLToPath(import.meta.url))

if(!process.env.HYPIXEL_API_KEY) {
    throw new Error('Required environment variable "HYPIXEL_API_KEY" is missing or malformed. Visit https://developer.hypixel.net/dashboard to get one.')
}

await processHypixelSchemaChanges({
    defName: "HypixelPlayer",
    schemaPath: join(__dirname, '..', 'schemas', 'hypixel', 'player.json'),
    dtsOutDir: join(__dirname, '..', '..', 'types'),
    dataPreprocess: (input) => input.player,
    testUrls: ["https://api.hypixel.net/player?uuid=b876ec32e396476ba1158438d83c67d4"]
})
