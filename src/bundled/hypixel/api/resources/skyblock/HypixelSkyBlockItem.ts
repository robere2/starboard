import {HypixelAPIResponse, HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";
import {HypixelResource} from "../HypixelResource.ts";
import {HypixelResources} from "../HypixelResources.ts";
import {MojangProfileTextures} from "../../../../MojangProfile.ts";

export class HypixelSkyBlockItemSalvage extends HypixelResource {
    type: string;
    essence_type?: string;
    amount?: number;

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockItemSalvage>) {
        super(parent, input);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.type == null) {
            throw new HypixelParseError("Salvage type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelSkyBlockItemRequirement extends HypixelResource {
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

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockItemRequirement>) {
        super(parent, input);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.type == null) {
            throw new HypixelParseError("Requirement type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelSkyBlockItemUpgradeCost extends HypixelResource {
    type: string;
    item_id?: string;
    essence_type?: string;
    amount?: number;

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockItemUpgradeCost>) {
        super(parent, input);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.type == null) {
            throw new HypixelParseError("Upgrade cost cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelSkyBlockItemGemstoneSlot extends HypixelResource {
    slot_type: string;
    costs: HypixelSkyBlockItemGemstoneSlotCost[];
    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockItemGemstoneSlot>) {
        super(parent, input);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.slot_type == null) {
            throw new HypixelParseError("Gemstone slot type cannot be null", input)
        }
        this.slot_type = input.slot_type;

        this.costs = [];
        for(const cost of input.costs ?? []) {
            if (!cost) {
                continue;
            }
            this.costs.push(new HypixelSkyBlockItemGemstoneSlotCost(parent, cost));
        }
    }
}

export class HypixelSkyBlockItemGemstoneSlotCost extends HypixelResource {
    type: string;
    coins?: number;
    item_id?: string;
    amount?: number;

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockItemGemstoneSlotCost>) {
        super(parent, input);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.type == null) {
            throw new HypixelParseError("Gemstone slot cost cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelSkyBlockItemDungeonConversionCost extends HypixelResource {
    essence_type: string;
    amount: number;


    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockItemDungeonConversionCost>) {
        super(parent, input);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.essence_type == null) {
            throw new HypixelParseError("Dungeon conversion cost essence type cannot be null", input)
        }
        this.essence_type = input.essence_type;
        if(input.amount == null) {
            throw new HypixelParseError("Dungeon conversion cost amount cannot be null", input)
        }
        this.amount = input.amount;
    }
}

export class HypixelSkyBlockItemCatacombsRequirement extends HypixelResource {
    type: string;
    dungeon_type?: string;
    level?: number;

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockItemCatacombsRequirement>) {
        super(parent, input);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.type == null) {
            throw new HypixelParseError("Catacombs requirement type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelSkyBlockItemPrestige extends HypixelResource {
    item_id: string;
    costs: HypixelSkyBlockItemUpgradeCost[];

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockItemPrestige>) {
        super(parent, input);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.item_id == null) {
            throw new HypixelParseError("Prestige item ID cannot be null", input)
        }
        this.item_id = input.item_id;

        this.costs = [];
        for(const cost of input.costs ?? []) {
            if (!cost) {
                continue;
            }
            this.costs.push(new HypixelSkyBlockItemUpgradeCost(parent, cost));
        }
    }
}

export class HypixelSkyBlockItem extends HypixelResource {
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

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockItem>) {
        super(parent, input);
        Object.assign(this, input); // Copy undocumented and non-required properties
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.id == null) {
            throw new HypixelParseError("Item id cannot be null", input)
        }
        this.id = input.id;
        if(input.name == null) {
            throw new HypixelParseError("Item name cannot be null", input)
        }
        this.name = input.name;
        if(input.material == null) {
            throw new HypixelParseError("Item material cannot be null", input)
        }
        this.material = input.material;

        if(input.dungeon_item_conversion_cost) {
            this.dungeon_item_conversion_cost = new HypixelSkyBlockItemDungeonConversionCost(parent, input.dungeon_item_conversion_cost);
        }

        if(input.prestige) {
            this.prestige = new HypixelSkyBlockItemPrestige(parent, input.prestige);
        }

        this.salvages = [];
        for(const salvage of input.salvages ?? []) {
            if(!salvage) {
                continue;
            }
            this.salvages.push(new HypixelSkyBlockItemSalvage(parent, salvage));
        }

        this.requirements = [];
        for(const requirement of input.requirements ?? []) {
            if(!requirement) {
                continue;
            }
            this.requirements.push(new HypixelSkyBlockItemRequirement(parent, requirement));
        }

        this.upgrade_costs = [];
        for(const upgradeCostSet of input.upgrade_costs ?? []) {
            const newUpgradeCostSet: HypixelSkyBlockItemUpgradeCost[] = [];
            for(const upgradeCost of upgradeCostSet ?? []) {
                if(!upgradeCost) {
                    continue;
                }
                newUpgradeCostSet.push(new HypixelSkyBlockItemUpgradeCost(parent, upgradeCost))
            }
            this.upgrade_costs.push(newUpgradeCostSet);
        }

        this.gemstone_slots = [];
        for(const gemstoneSlot of input.gemstone_slots ?? []) {
            if(!gemstoneSlot) {
                continue;
            }
            this.gemstone_slots.push(new HypixelSkyBlockItemGemstoneSlot(parent, gemstoneSlot));
        }

        this.catacombs_requirements = [];
        for(const catacombsRequirement of input.catacombs_requirements ?? []) {
            if(!catacombsRequirement) {
                continue;
            }
            this.catacombs_requirements.push(new HypixelSkyBlockItemCatacombsRequirement(parent, catacombsRequirement));
        }
    }

    public decodeSkin(): HypixelAPIValue<MojangProfileTextures> | null {
        if(this.skin == null) {
            return null;
        }
        return JSON.parse(atob(this.skin));
    }
}

export type HypixelSkyBlockItemsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    version: string;
    items: HypixelSkyBlockItem[]
}>
