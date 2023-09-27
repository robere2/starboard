import {Executor} from "../Executor.ts";


export abstract class Plugin {
    public abstract install(fn: Executor['handle']): Executor['handle']
}
