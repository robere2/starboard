import {Executor} from "../Executor.ts";
import {Endpoint} from "../endpoint/Endpoint.ts";


export abstract class Plugin {
    public abstract install(fn: Executor['handle'], endpointPath: string, endpoint: Endpoint): Executor['handle']
}
