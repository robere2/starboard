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
        if(input.tiers == null) {
            throw new HypixelParseError("Tiers cannot be null", input)
        }
        // This code requires tiers to have all properties and just skips any which are malformed.
        this.tiers = input.tiers.reduce<HypixelGuildAchievementTier[]>((acc, tier) => {
            if(tier && tier.tier != null && tier.amount != null) {
                acc.push(tier as HypixelGuildAchievementTier);
            }
            return acc;
        }, [])
    }
}
