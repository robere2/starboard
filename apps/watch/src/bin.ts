#! /usr/bin/env node

import {getPackages, Package, Packages} from "@manypkg/get-packages";
import {Watcher, ConsoleLogger, LogLevel} from "./";
import chalk from "chalk";
import {join} from "path";
import {pathToFileURL} from "url";

function packagesWithScript(scriptName: string, allPackages: Package[]): Package[] {
    const packages: Package[] = [];
    for(const pkg of allPackages) {
        const scripts = getPackageScripts(pkg);
        if(scripts[scriptName]) {
            packages.push(pkg);
        }
    }
    return packages;
}

function getPackageScripts(pkg: Package): Record<string, string> {
    const jsonAsAny = pkg.packageJson as any;
    return jsonAsAny?.scripts ?? {};
}

// ---------------------------------------------------------------------- //

const logger = new ConsoleLogger();
logger.level = logger.levelFromString(
    (await import(
        pathToFileURL(join(process.cwd(), "package.json")).toString(),
        { assert: { type: "json" } }
    ))
    .watcherOptions?.logLevel
) ?? LogLevel.INFO

if(process.argv.length !== 3) {
    logger.info("Usage: mcsb-watch <script name>");
    process.exit(1);
}

const scriptName = process.argv[2];
let allPackages: Packages;
try {
    allPackages = await getPackages(process.cwd());
} catch(e) {
    logger.error("Unable to find workspaces in this folder.");
    process.exit(1);
}
const packages = packagesWithScript(scriptName, allPackages.packages);

if(packages.length === 0) {
    logger.error(`No packages contain script ${scriptName}`);
    process.exit(1);
}

logger.info(`Watching for changes in ${chalk.greenBright(packages.length)} packages... ${chalk.grey(`(${packages.map(p => p.packageJson.name).join(', ')})`)}`);

const watchers: Watcher[] = [];
for(const pkg of packages) {
    watchers.push(new Watcher(pkg, scriptName, allPackages, logger));
}

let terminating = false;
process.on("SIGINT", async () => {
    if(terminating) {
        logger.info("Force quitting...");
        process.exit(1);
    }
    terminating = true;
    logger.info("Shutting down...");
    for(const watcher of watchers) {
        await watcher.stop();
    }
    process.exit(0);
});

