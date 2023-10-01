import {Endpoint} from "../../Endpoint.ts";
import {HypixelAPI} from "./api/HypixelAPI.ts";

export abstract class HypixelEndpoint extends Endpoint {
    protected readonly api: HypixelAPI;
    constructor(api: HypixelAPI) {
        super();
        this.api = api;
    }
}
