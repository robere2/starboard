import {Service} from "../../Service.ts";
import {HypixelPlayerEndpoint} from "./endpoints/HypixelPlayerEndpoint.ts";
import {HypixelAPI, HypixelAPIOptions} from "./api";

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
