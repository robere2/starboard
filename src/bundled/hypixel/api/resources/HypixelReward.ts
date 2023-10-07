import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelResourceEntity} from "./HypixelResourceEntity.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelReward extends HypixelResourceEntity {
    public type: string;
    public amount?: number;
    public package?: string;

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelReward>) {
        super(parent);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.type == null) {
            throw new HypixelParseError("Reward type cannot be null", input)
        }
        this.type = input.type;
    }
}
