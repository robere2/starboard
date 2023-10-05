import {HypixelAPIResponse, HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";

export class HypixelSkyBlockItemSalvage {
    type: string;
    essence_type?: string;
    amount?: number;
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelSkyBlockItemSalvage>) {
        Object.assign(this, input) // Copy undocumented and non-required properties
        if(!input.type) {
            throw new HypixelParseError("Salvage type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelSkyBlockItemRequirement {
    type: string;
    skill?: string;
    level?: number;
    reward?: string;
    faction?: string;
    reputation?: number;
    slayer_boss_type?: string;
    dungeon_type?: string;
    tier?: number;
    collection?: string;
    mode?: string
    minimum_age_unit?: string;
    minimum_age?: number;
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelSkyBlockItemRequirement>) {
        Object.assign(this, input) // Copy undocumented and non-required properties
        if(!input.type) {
            throw new HypixelParseError("Requirement type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelSkyBlockItemUpgradeCost {
    type: string;
    item_id?: string;
    essence_type?: string;
    amount?: number;
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelSkyBlockItemUpgradeCost>) {
        Object.assign(this, input) // Copy undocumented and non-required properties
        if(!input.type) {
            throw new HypixelParseError("Upgrade cost cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelSkyBlockItemGemstoneSlot {
    slot_type: string;
    costs: HypixelSkyBlockItemGemstoneSlotCost[];
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelSkyBlockItemGemstoneSlot>) {
        Object.assign(this, input) // Copy undocumented and non-required properties
        if(!input.slot_type) {
            throw new HypixelParseError("Gemstone slot type cannot be null", input)
        }
        this.slot_type = input.slot_type;

        this.costs = [];
        for(const cost of input.costs ?? []) {
            if (!cost) {
                continue;
            }
            this.costs.push(new HypixelSkyBlockItemGemstoneSlotCost(cost));
        }
    }
}

export class HypixelSkyBlockItemGemstoneSlotCost {
    type: string;
    coins?: number;
    item_id?: string;
    amount?: number;
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelSkyBlockItemGemstoneSlotCost>) {
        Object.assign(this, input) // Copy undocumented and non-required properties
        if(!input.type) {
            throw new HypixelParseError("Gemstone slot cost cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelSkyBlockItemDungeonConversionCost {
    essence_type: string;
    amount: number;
    [undocumentedProperties: string]: any;


    constructor(input: HypixelAPIValue<HypixelSkyBlockItemDungeonConversionCost>) {
        Object.assign(this, input) // Copy undocumented and non-required properties
        if(!input.essence_type) {
            throw new HypixelParseError("Dungeon conversion cost essence type cannot be null", input)
        }
        this.essence_type = input.essence_type;
        if(!input.amount) {
            throw new HypixelParseError("Dungeon conversion cost amount cannot be null", input)
        }
        this.amount = input.amount;
    }
}

export class HypixelSkyBlockItemCatacombsRequirement {
    type: string;
    dungeon_type?: string;
    level?: number;
    [undocumentedProperties: string]: any;

    constructor(input: HypixelAPIValue<HypixelSkyBlockItemCatacombsRequirement>) {
        Object.assign(this, input) // Copy undocumented and non-required properties
        if(!input.type) {
            throw new HypixelParseError("Catacombs requirement type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelSkyBlockItemPrestige {
    item_id: string;
    costs: HypixelSkyBlockItemUpgradeCost[];
    [undocumentedProperties: string]: any

    constructor(input: HypixelAPIValue<HypixelSkyBlockItemPrestige>) {
        Object.assign(this, input) // Copy undocumented and non-required properties
        if(!input.item_id) {
            throw new HypixelParseError("Prestige item ID cannot be null", input)
        }
        this.item_id = input.item_id;

        this.costs = [];
        for(const cost of input.costs ?? []) {
            if (!cost) {
                continue;
            }
            this.costs.push(new HypixelSkyBlockItemUpgradeCost(cost));
        }
    }
}

export class HypixelSkyBlockItem {
    public id: string;
    public name: string;
    public material: string;
    public skin?: string;
    public category?: string;
    public tier?: string;
    public soulbound?: string;
    public generator?: string;
    public furniture?: string;
    public color?: string;
    public sword_type?: string;
    public origin?: string;
    public crystal?: string;
    public private_island?: string;

    public durability?: number;
    public npc_sell_price?: number;
    public generator_tier?: number
    public gear_score?: number;
    public ability_damage_scaling?: number;
    public motes_sell_price?: number;

    public rarity_salvageable?: boolean;
    public glowing?: boolean;
    public unstackable?: boolean;
    public museum?: boolean;
    public dungeon_item?: boolean;
    public cannot_reforge?: boolean;
    public lose_motes_value_on_transfer?: boolean
    public salvageable_from_recipe?: boolean;
    public rift_transferrable?: boolean;
    public can_have_attributes?: boolean;
    public hide_from_viewrecipe_command?: boolean;

    public item_specific?: Record<string, any>;
    public enchantments?: Record<string, number>
    public stats?: Record<string, any>;
    public tiered_stats?: Record<string, number[]>;

    public salvages?: HypixelSkyBlockItemSalvage[];
    public requirements?: HypixelSkyBlockItemRequirement[];
    public upgrade_costs?: HypixelSkyBlockItemUpgradeCost[][];
    public gemstone_slots?: HypixelSkyBlockItemGemstoneSlot[];
    public dungeon_item_conversion_cost?: HypixelSkyBlockItemDungeonConversionCost;
    public catacombs_requirements?: HypixelSkyBlockItemCatacombsRequirement[];
    // public salvage?: unknown; // This seems to maybe be a remnant from prev. version? Only exists on one value
    public prestige?: HypixelSkyBlockItemPrestige;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelSkyBlockItem>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input.id) {
            throw new HypixelParseError("Item id cannot be null", input)
        }
        this.id = input.id;
        if(!input.name) {
            throw new HypixelParseError("Item name cannot be null", input)
        }
        this.name = input.name;
        if(!input.material) {
            throw new HypixelParseError("Item material cannot be null", input)
        }
        this.material = input.material;

        if(input.dungeon_item_conversion_cost) {
            this.dungeon_item_conversion_cost = new HypixelSkyBlockItemDungeonConversionCost(input.dungeon_item_conversion_cost);
        }

        if(input.prestige) {
            this.prestige = new HypixelSkyBlockItemPrestige(input.prestige);
        }

        this.salvages = [];
        for(const salvage of input.salvages ?? []) {
            if(!salvage) {
                continue;
            }
            this.salvages.push(new HypixelSkyBlockItemSalvage(salvage));
        }

        this.requirements = [];
        for(const requirement of input.requirements ?? []) {
            if(!requirement) {
                continue;
            }
            this.requirements.push(new HypixelSkyBlockItemRequirement(requirement));
        }

        this.upgrade_costs = [];
        for(const upgradeCostSet of input.upgrade_costs ?? []) {
            const newUpgradeCostSet: HypixelSkyBlockItemUpgradeCost[] = [];
            for(const upgradeCost of upgradeCostSet ?? []) {
                if(!upgradeCost) {
                    continue;
                }
                newUpgradeCostSet.push(new HypixelSkyBlockItemUpgradeCost(upgradeCost))
            }
            this.upgrade_costs.push(newUpgradeCostSet);
        }

        this.gemstone_slots = [];
        for(const gemstoneSlot of input.gemstone_slots ?? []) {
            if(!gemstoneSlot) {
                continue;
            }
            this.gemstone_slots.push(new HypixelSkyBlockItemGemstoneSlot(gemstoneSlot));
        }

        this.catacombs_requirements = [];
        for(const catacombsRequirement of input.catacombs_requirements ?? []) {
            if(!catacombsRequirement) {
                continue;
            }
            this.catacombs_requirements.push(new HypixelSkyBlockItemCatacombsRequirement(catacombsRequirement));
        }
    }
}

export type HypixelSkyBlockItemsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    version: string;
    items: HypixelSkyBlockItem[]
}>
