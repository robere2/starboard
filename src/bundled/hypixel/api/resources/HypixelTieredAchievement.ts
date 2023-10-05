import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export class HypixelAchievementTier {
    public tier: number;
    public points: number;
    public amount: number;
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelAchievementTier>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.tier == null) {
            throw new HypixelParseError("Achievement tier number cannot be null", input)
        }
        this.tier = input.tier;
        if(input.points == null) {
            throw new HypixelParseError("Achievement tier points cannot be null", input)
        }
        this.points = input.points;
        if(input.amount == null) {
            throw new HypixelParseError("Achievement tier amount cannot be null", input)
        }
        this.amount = input.amount;
    }
}

export class HypixelTieredAchievement {
    public name: string;
    public description: string;
    public tiers: HypixelAchievementTier[];
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelTieredAchievement>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.name == null) {
            throw new HypixelParseError("Name cannot be null", input)
        }
        this.name = input.name;
        if(input.description == null) {
            throw new HypixelParseError("Description cannot be null", input)
        }
        this.description = input.description;

        this.tiers = [];
        for(const tier of input.tiers ?? []) {
            if(!tier) {
                continue;
            }
            this.tiers.push(new HypixelAchievementTier(tier))
        }
    }
}
