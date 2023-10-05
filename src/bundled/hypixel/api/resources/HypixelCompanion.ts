import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export class HypixelCompanionRarity {
    name: string;
    color: string;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelCompanionRarity>) {
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

export class HypixelCompanion {
    public key: string;
    public name: string;
    public rarity?: string;
    public package?: string;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelCompanion>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.key == null) {
            throw new HypixelParseError("Companion key cannot be null", input)
        }
        if(input.name == null) {
            throw new HypixelParseError("Companion name cannot be null", input)
        }
        this.key = input.key;
        this.name = input.name;
        this.rarity = input.rarity;
        this.package = input.package;
    }
}

export type HypixelCompanionsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    types: HypixelCompanion[];
    rarities: HypixelCompanionRarity[];
}>
