import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelResource} from "./HypixelResource.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelReward extends HypixelResource {
    public type: string;
    public amount?: number;
    public package?: string;

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelReward>) {
        super(parent, input);
        if(input.type == null) {
            throw new HypixelParseError("Reward type cannot be null", input)
        }
        this.type = input.type;
    }
}
