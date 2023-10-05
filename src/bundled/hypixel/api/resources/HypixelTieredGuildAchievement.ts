import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export class HypixelGuildAchievementTier {
    public tier: number;
    public amount: number;
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelGuildAchievementTier>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.tier == null) {
            throw new HypixelParseError("Guild achievement tier number cannot be null", input)
        }
        this.tier = input.tier;
        if(input.amount == null) {
            throw new HypixelParseError("Guild achievement tier amount cannot be null", input)
        }
        this.amount = input.amount;
    }
}

export class HypixelTieredGuildAchievement {
    public name: string;
    public description: string;
    public tiers: HypixelGuildAchievementTier[];
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelTieredGuildAchievement>) {
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
            if (!tier) {
                continue;
            }
            this.tiers.push(new HypixelGuildAchievementTier(tier))
        }
    }
}
