import {HypixelAPI, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelGuildAchievementTier extends HypixelEntity {
    public tier: number;
    public amount: number;

    constructor(root: HypixelAPI, parent: HypixelResources, input: HypixelAPIValue<HypixelGuildAchievementTier>) {
        super(root, parent);
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

export class HypixelTieredGuildAchievement extends HypixelEntity {
    public name: string;
    public description: string;
    public tiers: HypixelGuildAchievementTier[];

    constructor(root: HypixelAPI, parent: HypixelResources, input: HypixelAPIValue<HypixelTieredGuildAchievement>) {
        super(root, parent);
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
            this.tiers.push(new HypixelGuildAchievementTier(root, parent, tier))
        }
    }
}
