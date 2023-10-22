import {Executor} from "./Executor";

export abstract class Endpoint implements Executor {

    public abstract handle(req: Request): Promise<Response>;
}
