import {Executor} from "./Executor";
import {Endpoint} from "./Endpoint";


export abstract class Plugin {
    public abstract install(fn: Executor['handle'], endpointPath: string, endpoint: Endpoint): Executor['handle']
}
