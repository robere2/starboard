import {Service} from "../service/Service.ts";
import {HypixelEndpoint} from "./HypixelEndpoint.ts";

export class HypixelService extends Service {

    constructor(path: string, private readonly apiKey: string) {
        super(path);
        this.addEndpoint('player', new HypixelEndpoint('player', apiKey));
        this.addEndpoint('status', new HypixelEndpoint('status', apiKey));
    }
}
