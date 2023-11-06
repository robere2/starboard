import {textBox, logger, writeSchemaTypedefs, copyExtraFiles, createIndexFiles} from "./util.js";
import dotenv from "dotenv";
import chalk from "chalk";
import {HypixelGenerator} from "./HypixelGenerator";
import {allSchemas} from "./schemas";
import fs from "fs";
dotenv.config();

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            HYPIXEL_GEN_API_KEY?: string;
        }
    }
}

async function run(): Promise<void> {
    const command = process.argv[process.argv.length - 1];

    switch(command) {
        case "build":
            await build()
            break;
        case "generate":
            await generate();
            break;
        default:
            console.error("Usage: index.ts [build|generate]")
            process.exit(1);
    }
}

async function build(): Promise<void> {
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
}

async function generate(): Promise<void> {
    if(!process.env.HYPIXEL_GEN_API_KEY) {
        throw new Error('Required environment variable "HYPIXEL_GEN_API_KEY" is missing or malformed. Visit https://developer.hypixel.net/dashboard to get one.')
    }

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
}

await run();
