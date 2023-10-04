import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export type HypixelGuildAchievementTier = { tier: number, amount: number };

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
