import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export class HypixelRarity {
    name: string;
    color: string;
    [undocumentedProperties: string]: any

    constructor(input: HypixelAPIValue<HypixelRarity>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.name == null) {
            throw new HypixelParseError("Rarity name cannot be null", input)
        }
        this.name = input.name;
        if(input.color == null) {
            throw new HypixelParseError("Rarity color cannot be null", input)
        }
        this.color = input.color;
    }
}
