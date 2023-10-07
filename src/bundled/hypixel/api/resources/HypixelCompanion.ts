import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelRarity} from "./HypixelRarity.ts";
import {HypixelResourceEntity} from "./HypixelResourceEntity.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelCompanion extends HypixelResourceEntity {
    public key: string;
    public name: string;
    public rarity?: string;
    public package?: string;

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelCompanion>) {
        super(parent);
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

    public getRarity(): HypixelRarity {
        const matchingRarity = this.getResources().companionRarities.find(rarity => rarity.name === this.rarity);
        if(!matchingRarity) {
            throw new HypixelParseError(`Could not find rarity ${this.rarity}`, this);
        }
        return matchingRarity;
    }
}

export type HypixelCompanionsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    types: HypixelCompanion[];
    rarities: HypixelRarity[];
}>
