import {textBox, logger, writeSchemaTypedefs, copyExtraFiles, createIndexFiles} from "./util.js";
import dotenv from "dotenv";
import chalk from "chalk";
import {HypixelGenerator} from "./classes/HypixelGenerator";
import {loadAllSchemas} from "./schemas";
dotenv.config();

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            HYPIXEL_GEN_API_KEY?: string;
            HYPIXEL_GEN_WRITE_ERRORS?: string;
            HYPIXEL_GEN_MAX_WORKERS?: string;
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
        case "generate-loop":
            generate().catch(e => {
                console.error("GENERATOR ERROR: " + (e instanceof Error ? e.stack : e))
            });
            setInterval(() => {
                generate().catch(e => {
                    console.error("GENERATOR ERROR: " + (e instanceof Error ? e.stack : e))
                });
            }, 315_000);
            break;
        default:
            console.error("Usage: index.ts [build|generate|generate-loop]")
            process.exit(1);
    }
}

async function build(): Promise<void> {
    const startTime = Date.now();
    const allSchemas = await loadAllSchemas();
    for(const schema of allSchemas) {
        logger(chalk.cyan(`Writing type definitions for ${chalk.cyanBright(schema.path)}...`))
        await writeSchemaTypedefs(schema)
    }

    await copyExtraFiles();
    await createIndexFiles();

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    logger([
        '\n',
        ...textBox([
            `Build complete - Took ${Math.floor(timeTaken / 60000)}m ${Math.floor(timeTaken / 1000) % 60}s`,
            `Built a total of ${allSchemas.length} type definition files`
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
