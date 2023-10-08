import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";
import {HypixelEntity} from "../../HypixelEntity.ts";
import {HypixelResources} from "../HypixelResources.ts";
import {HypixelSkyBlockSkill} from "./HypixelSkyBlockSkill.ts";

export class HypixelSkyBlockCollectionItem extends HypixelEntity {
    name: string;
    maxTiers: number;
    tiers: HypixelSkyBlockCollectionTier[];

    constructor(root: HypixelAPI, parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockCollectionItem>) {
        super(root, parent);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.name == null) {
            throw new HypixelParseError("Collection item name cannot be null", input)
        }
        this.name = input.name;
        if(input.maxTiers == null) {
            throw new HypixelParseError("Collection item max tiers cannot be null", input)
        }
        this.maxTiers = input.maxTiers;
        if(input.tiers?.length !== this.maxTiers) {
            throw new HypixelParseError("Collection item tiers must be the same length as max tiers", input)
        }

        this.tiers = [];
        for(const tier of input.tiers ?? []) {
            if(!tier) {
                continue;
            }
            this.tiers.push(new HypixelSkyBlockCollectionTier(root, parent, tier));
        }
    }
}

export class HypixelSkyBlockCollectionTier extends HypixelEntity {
    tier: number;
    amountRequired: number;
    unlocks: string[];

    constructor(root: HypixelAPI, parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockCollectionTier>) {
        super(root, parent);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.tier == null) {
            throw new HypixelParseError("Collection tier number cannot be null", input)
        }
        this.tier = input.tier;
        if(input.amountRequired == null) {
            throw new HypixelParseError("Collection tier amountRequired cannot be null", input)
        }
        this.amountRequired = input.amountRequired;

        this.unlocks = [];
        for(const unlock of input.unlocks ?? []) {
            if(unlock != null) {
                this.unlocks.push(unlock)
            }
        }
    }
}

export class HypixelSkyBlockCollection extends HypixelEntity {
    public name: string;
    public items: Record<string, HypixelSkyBlockCollectionItem>;

    public constructor(root: HypixelAPI, parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockCollection>) {
        super(root, parent);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.name == null) {
            throw new HypixelParseError("Collection name cannot be null", input)
        }
        this.name = input.name;

        this.items = {};
        if(input.items) {
            for (const item in input.items) {
                if (input.items[item] == null) {
                    continue;
                }
                this.items[item] = new HypixelSkyBlockCollectionItem(root, parent, input.items[item] as HypixelSkyBlockCollectionItem);
            }
        }
    }

    public getSkill(): HypixelSkyBlockSkill {
        return this.getResources().skyBlockSkills[this.name.toUpperCase()]
    }
}

export type HypixelSkyBlockCollectionsResponse = HypixelAPIResponse<{
    lastUpdated: number;
    version: string;
    collections: Record<string, HypixelSkyBlockCollection>;
}>
