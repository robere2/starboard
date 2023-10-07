import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelResourceEntity} from "./HypixelResourceEntity.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelRarity extends HypixelResourceEntity {
    name: string;
    color: string;

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelRarity>) {
        super(parent);
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
