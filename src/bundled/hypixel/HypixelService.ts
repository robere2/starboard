import {Service} from "../../Service.ts";
import {HypixelPlayerEndpoint} from "./endpoints/HypixelPlayerEndpoint.ts";
import {HypixelAPI, HypixelAPIOptions} from "./api/HypixelAPI.ts";

export class HypixelService extends Service {

    private readonly api: HypixelAPI;
    constructor(path: string, private readonly apiOptions: HypixelAPIOptions) {
        super(path);
        this.api = new HypixelAPI(this.apiOptions);
        this.addEndpoint('player', new HypixelPlayerEndpoint(this.api));
    }
}
