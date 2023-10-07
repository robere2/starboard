import {HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelResourceEntity} from "./HypixelResourceEntity.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelAchievementTier extends HypixelResourceEntity {
    public tier: number;
    public points: number;
    public amount: number;

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelAchievementTier>) {
        super(parent);
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

export class HypixelTieredAchievement extends HypixelResourceEntity {
    public name: string;
    public description: string;
    public tiers: HypixelAchievementTier[];

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelTieredAchievement>) {
        super(parent);
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
            this.tiers.push(new HypixelAchievementTier(parent, tier))
        }
    }
}
