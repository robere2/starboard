import {Endpoint} from "../../Endpoint";
import {HypixelAPI} from "@mcsb/api";

export abstract class HypixelEndpoint extends Endpoint {
    protected readonly api: HypixelAPI;
    constructor(api: HypixelAPI) {
        super();
        this.api = api;
    }
}
