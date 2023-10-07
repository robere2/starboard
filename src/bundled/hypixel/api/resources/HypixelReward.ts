import {HypixelAPI, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelReward extends HypixelEntity {
    public type: string;
    public amount?: number;
    public package?: string;

    constructor(root: HypixelAPI, parent: HypixelResources, input: HypixelAPIValue<HypixelReward>) {
        super(root, parent);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.type == null) {
            throw new HypixelParseError("Reward type cannot be null", input)
        }
        this.type = input.type;
    }
}
