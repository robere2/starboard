import {updateAndBuildHypixelSchemas} from "./tools.js";
import dotenv from "dotenv";
dotenv.config();

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            HYPIXEL_GEN_API_KEY: string;
        }
    }
}

if(!process.env.HYPIXEL_GEN_API_KEY) {
    throw new Error('Required environment variable "HYPIXEL_GEN_API_KEY" is missing or malformed. Visit https://developer.hypixel.net/dashboard to get one.')
}

await updateAndBuildHypixelSchemas();
