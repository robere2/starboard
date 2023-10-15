import {Executor} from "./Executor.ts";

export abstract class Endpoint implements Executor {

    public abstract handle(req: Request): Promise<Response>;
}
