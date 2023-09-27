import {Plugin} from "../plugin/Plugin.ts";
import {Executor} from "../Executor.ts";

export abstract class Route implements Executor {

    constructor(public readonly path: string) {}

    public addPlugin(plugin: Plugin): void {
        this.handle = plugin.install(this.handle)
    }

    public abstract handle(req: Request): Response | Promise<Response>;
}
