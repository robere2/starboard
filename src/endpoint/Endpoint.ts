import {Plugin} from "../plugin/Plugin.ts";
import {Executor} from "../Executor.ts";

export abstract class Endpoint implements Executor {

    public abstract handle(req: Request): Response | Promise<Response>;
}
