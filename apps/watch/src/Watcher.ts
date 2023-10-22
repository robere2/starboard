import {Package, Packages} from "@manypkg/get-packages";
import {FSWatcher, watch} from "chokidar";
import {ChildProcess, spawn} from "child_process";
import {join} from "path";
import pidtree from "pidtree";
import findProcess from "find-process";
import chalk, {ChalkInstance} from "chalk";
import {PackageDependency} from "./PackageDependency";
import {Logger, LogLevel} from "./Logger";

type DeepNonNullable<T> = {
    [P in keyof T]-?: Exclude<DeepNonNullable<T[P]>, null>
}

const colors: ChalkInstance[] = [
    chalk.magentaBright,
    chalk.cyanBright,
    chalk.greenBright,
    chalk.blueBright,
    chalk.yellowBright,
    chalk.redBright,
    chalk.magenta,
    chalk.blue,
    chalk.red,
    chalk.yellow,
    chalk.green,
    chalk.cyan,
]
let lastUsedColorIdx = -1;
function getNextColor(): ChalkInstance {
    return colors[++lastUsedColorIdx % colors.length];
}

export type WatcherOptions = {
    immediate?: boolean;
    files?: string[];
    depFiles?: string[];
}

function isErrnoException(o: unknown): o is { code: string } {
    return typeof o === 'object' && o !== null && 'code' in o;
}

export class Watcher {
    public readonly pkg: PackageDependency;
    public readonly script: string;
    private readonly logger?: Logger;
    private readonly root: Packages;

    public debounce: number = 1000;
    private lastReload: number = Date.now();
    private nextReloadTimer: ReturnType<typeof setTimeout> | null = null;

    private readonly watcher: FSWatcher;
    private process: ChildProcess | null = null;
    private restarting: boolean = false;
    private readonly color = getNextColor();

    constructor(pkg: Package, script: string, root: Packages, logger?: Logger) {
        this.pkg = new PackageDependency(pkg, root);
        this.script = script;
        this.root = root;
        this.logger = logger;

        // Convert watched files to be relative to the package root, or use package root as default.
        const watchedFiles = this.getOptions().files.map(f => join(pkg.dir, f));

        for(const dep of this.pkg.dependencies) {
            watchedFiles.push(...this.getOptions(dep).depFiles.map(f => join(dep.dir, f)));
        }

        this.log(LogLevel.DEBUG, `Watching files: ${watchedFiles.join(", ")}`)
        this.log(LogLevel.DEBUG, `Watching files: ${watchedFiles.join(", ")}`)
        this.watcher = watch(watchedFiles, {
            usePolling: true
        });
        this.watcher.on("change", async (path: string) => {
            this.log(LogLevel.VERBOSE, `File change detected: ${path}`)
            await this.restartScript();
        });

        if(this.getOptions().immediate) {
            this.startScript();
        }
        this.log(LogLevel.VERBOSE, "Watcher initialized");
    }

    private log(level: LogLevel, message: string): void {
        message = this.color(this.pkg.packageJson.name) + " > " + message;
        this.logger?.log(level, message);
    }

    public startScript(): void {
        if(this.process) {
            throw new Error("Script is already running");
        }
        this.log(LogLevel.VERBOSE, "Starting script...");
        this.process = spawn(`npm run ${this.script}`, {
            shell: true,
            cwd: this.pkg.dir
        })

        this.process.stdout?.setEncoding('utf8')
        this.process.stdout?.on('data', (data: Buffer) => {
           process.stdout.write(this.color(this.pkg.packageJson.name) + " > " + data);
        })
        this.process.stderr?.setEncoding('utf8')
        this.process.stderr?.on('data', (data: Buffer) => {
            process.stderr.write(this.color(this.pkg.packageJson.name) + " > " + data);
        })

        this.process.on('close', (code) => {
            if(!this.restarting) {
                this.log(LogLevel.INFO, chalk.yellow(`Script exited with code ${chalk.yellowBright(code)}. Waiting for changes...`))
            } else {
                this.log(LogLevel.DEBUG, `Script ${this.process?.pid} exited with code ${chalk.yellowBright(code)}. Restarting...`)
            }
            this.process = null;
        });
        this.log(LogLevel.VERBOSE, "Script started");
    }

    public async  restartScript(): Promise<void> {
        if(this.debounce > 0) {
            if(this.nextReloadTimer) {
                this.log(LogLevel.VERBOSE, "Restart already queued");
                return;
            } else if(this.lastReload + this.debounce > Date.now()) {
                this.log(LogLevel.VERBOSE, "Waiting debounce period for next reload");
                this.nextReloadTimer = setTimeout(async () => {
                    this.log(LogLevel.VERBOSE, "Debounce complete, restarting script");
                    this.nextReloadTimer = null;
                    await this.restartScript();
                }, this.lastReload + this.debounce - Date.now());
                return;
            }
        }

        this.lastReload = Date.now();
        this.log(LogLevel.INFO, chalk.green("Restarting due to changes..."));
        this.restarting = true;
        await this.stopScript();
        this.startScript();
        this.restarting = false;
        this.log(LogLevel.VERBOSE, "Script restarted");
    }

    public async  stopScript(): Promise<void> {
        if(this.process) {
            this.log(LogLevel.VERBOSE, "Stopping script...");
            await this.killProcess(this.process);
            this.process = null;
            this.log(LogLevel.VERBOSE, "Script stopped");
        }
    }

    public async stop(): Promise<void> {
        this.log(LogLevel.VERBOSE, "Stopping watcher...");
        await this.watcher.close();
        await this.stopScript();
        this.log(LogLevel.VERBOSE, "Watcher stopped");
    }

    private async killProcess(processToKill: ChildProcess): Promise<void> {
        const parentPid = processToKill.pid;
        if(!parentPid) {
            this.log(LogLevel.DEBUG, "Process doesn't have an ID?")
            return;
        }
        const children = await pidtree(parentPid);
        const pids = new Set([parentPid, ...children]);
        this.log(LogLevel.VERBOSE, `Attempting to kill ${pids.size} processes`)

        // Send termination signal to process & all children
        for (const pid of pids) {
            try {
                this.log(LogLevel.DEBUG, `Sending SIGTERM signal to PID ${pid}`)
                process.kill(pid, 'SIGTERM');
            } catch (error: unknown) {
                if(isErrnoException(error)) {
                    this.handleErrorCode(error);
                } else {
                    throw error;
                }
            }
        }

        this.log(LogLevel.VERBOSE, `Waiting for ${pids.size} processes to shut down...`)
        // Wait for process(es) to end. Every 100ms, try to find the process. If it doesn't exist then remove it from the
        //   list. Stop looking after 10 seconds or when the list is empty, whichever is first.
        const start = Date.now();
        while(Date.now() < start + 10000) {
            for(const pid of pids) {
                const process = await findProcess("pid", pid);
                if(process.length === 0) {
                    this.log(LogLevel.VERBOSE, `Process ${pid} shut down`)
                    pids.delete(pid);
                }
            }
            if(pids.size === 0) {
                this.log(LogLevel.DEBUG, "All processes successfully shut down");
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Go through any remaining processes after the 10s delay and send a signal 9
        for(const pid of pids) {
            try {
                this.log(LogLevel.DEBUG, `Sending SIGKILL signal to PID ${pid}`)
                process.kill(pid, 'SIGKILL');
            } catch (error: unknown) {
                if(isErrnoException(error)) {
                    this.handleErrorCode(error);
                } else {
                    throw error;
                }
            }
        }
    }

    private handleErrorCode(e: { code: string }): void {
        if(e.code === 'ESRCH') {
            this.log(LogLevel.DEBUG, "Process does not exist");
        } else {
            throw e;
        }
    }

    private getOptions(pkg: Package = this.pkg): DeepNonNullable<WatcherOptions> {
        const configOptions = (this.root.rootPackage?.packageJson as {watcherOptions?: WatcherOptions} | undefined)?.watcherOptions ?? {};
        return {
            files: ['.'],
            depFiles: ['dist'],
            immediate: false,
            ...configOptions,
            ...(pkg.packageJson as {watcherOptions?: WatcherOptions}).watcherOptions
        }
    }
}
