import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelRarity} from "./HypixelRarity.ts";

export class HypixelPet {
    public key: string;
    public name: string;
    public rarity?: string;
    public package?: string;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelPet>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.key == null) {
            throw new HypixelParseError("Pet key cannot be null", input)
        }
        if(input.name == null) {
            throw new HypixelParseError("Pet name cannot be null", input)
        }
        this.key = input.key;
        this.name = input.name;
        this.rarity = input.rarity;
        this.package = input.package;
    }
}

export type HypixelPetsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    types: HypixelPet[];
    rarities: HypixelRarity[];
}>
