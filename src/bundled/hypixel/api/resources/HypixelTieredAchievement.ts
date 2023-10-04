import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export type HypixelAchievementTier = { tier: number, points: number, amount: number };

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
        if(input.tiers == null) {
            throw new HypixelParseError("Tiers cannot be null", input)
        }
        // This code requires tiers to have all properties and just skips any which are malformed.
        this.tiers = input.tiers.reduce<HypixelAchievementTier[]>((acc, tier) => {
            if(tier && tier.tier != null && tier.amount != null && tier.points != null) {
                acc.push(tier as HypixelAchievementTier);
            }
            return acc;
        }, [])
    }
}
