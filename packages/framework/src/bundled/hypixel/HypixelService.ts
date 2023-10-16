import {Service} from "../../Service";
import {HypixelPlayerEndpoint} from "./endpoints/HypixelPlayerEndpoint";
import {HypixelAPI, HypixelAPIOptions} from "@mcsb/api";

export class HypixelService extends Service {

    private api: HypixelAPI | null = null;
    constructor(path: string, private readonly apiOptions: HypixelAPIOptions) {
        super(path);
        HypixelAPI.create(this.apiOptions).then((api) => {
            this.api = api;
            this.addEndpoint('player', new HypixelPlayerEndpoint(this.api));
        })
    }
}
