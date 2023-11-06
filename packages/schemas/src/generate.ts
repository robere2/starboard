import {textBox, logger} from "./common.js";
import dotenv from "dotenv";
import chalk from "chalk";
import {HypixelGenerator} from "./HypixelGenerator";
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

// We want to track the number of requests we send out and at what frequency, so we can display them in the
// logs later.
const startTime = Date.now();

const generator = await new HypixelGenerator().run()

const endTime = Date.now();
const timeTaken = endTime - startTime;

logger([
    '\n',
        ...textBox([
        `Generation complete - Took ${Math.floor(timeTaken / 60000)}m ${Math.floor(timeTaken / 1000) % 60}s`,
        `Sent a total of ${generator.getCompletedRequests()} requests to the Hypixel API.`
    ], chalk.green, chalk.green)
]);
