import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export class HypixelReward {
    public type: string;
    public amount?: number;
    public package?: string;
    [undocumentedProperties: string]: any

    constructor(input: HypixelAPIValue<HypixelReward>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.type == null) {
            throw new HypixelParseError("Reward type cannot be null", input)
        }
        this.type = input.type;
    }
}
