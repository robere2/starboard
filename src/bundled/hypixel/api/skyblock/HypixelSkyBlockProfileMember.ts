import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelSkyBlockRiftStatistics} from "./HypixelSkyBlockRiftStatistics.ts";

export type HypixelSkyBlockPet = {
    uuid?: string;
    uiqueId?: string;
    type?: string;
    exp?: number;
    active?: boolean;
    tier?: string;
    heldItem?: string | null;
    candyUsed?: number;
    skin?: string | null;
    extra?: Record<string, any>;
    [undocumentedProperties: string]: any;
}

export type HypixelSkyBlockSlayerBoss = {
    claimed_levels?: {
        [key: `level_${number}` | `level_${number}_special`]: boolean
        [undocumentedProperties: string]: any;
    },
    xp?: number;
    [key: `boss_kills_tier_${number}`]: number;
    [key: `boss_attempts_tier_${number}`]: number;
    [undocumentedProperties: string]: any;
}

export type HypixelSkyBlockQuest = {
    status?: "COMPLETE" | "ACTIVE" | string;
    activated_at?: number;
    activated_at_sb?: number;
    completed_at?: number;
    completed_at_sb?: number;
    [undocumentedProperties: string]: any;
}

export type HypixelSkyBlockDungeonStatistic<T> = {
    [key: `${number}`]: T | undefined | null;
    [undocumentedProperties: string]: any;
}

export type HypixelSkyBlockDungeonStatistics = {
    experience?: number;
    highest_tier_completed?: number;
    times_played?: HypixelSkyBlockDungeonStatistic<number>;
    tier_completions?: HypixelSkyBlockDungeonStatistic<number>;
    fastest_time?: HypixelSkyBlockDungeonStatistic<number>;
    best_runs?: HypixelSkyBlockDungeonStatistic<{
        timestamp?: number;
        score_exploration?: number;
        score_speed?: number;
        score_skill?: number;
        score_bonus?: number;
        dungeon_class?: string;
        teammates?: string[];
        elapsed_time?: number;
        damage_dealt?: number;
        deaths?: number;
        mobs_killed?: number;
        secrets_found?: number;
        damage_mitigated?: number;
        ally_healing?: number;
        [undocumentedProperties: string]: any;
    }[]>;
    best_score?: HypixelSkyBlockDungeonStatistic<number>;
    mobs_killed?: HypixelSkyBlockDungeonStatistic<number>;
    most_mobs_killed?: HypixelSkyBlockDungeonStatistic<number>;
    most_damage_berserk?: HypixelSkyBlockDungeonStatistic<number>;
    most_healing?: HypixelSkyBlockDungeonStatistic<number>;
    watcher_kills?: HypixelSkyBlockDungeonStatistic<number>;
    fastest_time_s?: HypixelSkyBlockDungeonStatistic<number>;
    most_damage_archer?: HypixelSkyBlockDungeonStatistic<number>;
    most_damage_healer?: HypixelSkyBlockDungeonStatistic<number>;
    most_damage_mage?: HypixelSkyBlockDungeonStatistic<number>;
    most_damage_tank?: HypixelSkyBlockDungeonStatistic<number>;
    fastest_time_s_plus?: HypixelSkyBlockDungeonStatistic<number>;
    milestone_completions?: HypixelSkyBlockDungeonStatistic<number>;
    [undocumentedProperties: string]: any;
}

export type HypixelSkyBlockDungeonRun = {
    run_id?: string;
    completion_ts?: number;
    dungeon_tier?: number;
    participants?: {
        player_uuid?: string;
        display_name?: string;
        class_milestone?: number;
        [undocumentedProperties: string]: any;
    }[];
    [undocumentedProperties: string]: any;
}

export type HypixelSkyBlockDungeonChest = {
    run_id?: string;
    chest_id?: string;
    treasure_type?: string;
    rewards?: {
        rewards?: string[];
        rolled_rng_meter_randomly?: boolean;
        [undocumentedProperties: string]: any;
    };
    quality?: number;
    shiny_eligible?: boolean;
    paid?: boolean;
    rerolls?: number;
    [undocumentedProperties: string]: any;
}

export type HypixelSkyBlockActiveEffect = {
    effect?: string;
    level?: number;
    modifiers?: {
        key?: string;
        amp?: number;
        [undocumentedProperties: string]: any;
    }[];
    ticks_remaining?: number;
    infinite?: boolean;
}

export type HypixelSkyBlockAutoPetRule = {
    uuid?: string;
    id?: string;
    name?: string;
    uniqueId?: string;
    exceptions?: {
        id?: string;
        data?: Record<string, string>;
        [undocumentedProperties: string]: any;
    }[];
    disabled?: boolean;
    data?: Record<string, string>;
    [undocumentedProperties: string]: any;
}

export type HypixelSkyBlockInventoryData = {
    type?: number;
    data?: string;
}

export class HypixelSkyBlockProfileMember extends HypixelEntity {
    public readonly pets?: HypixelSkyBlockPet[];
    public readonly fairy_exchanges?: number;
    public readonly rift?: HypixelSkyBlockRiftStatistics;
    public readonly temp_stat_buffs?: unknown[];
    public readonly fishing_treasure_caught?: number;
    public readonly slayer_bosses?: Record<string, HypixelSkyBlockSlayerBoss>;
    public readonly stats?: Record<string, number | undefined | null>;
    public readonly death_count?: number;
    public readonly first_join_hub?: number;
    public readonly fairy_souls_collected?: number;
    public readonly bestiary?: {
        migrated_stats?: boolean;
        migration?: boolean;
        kills?: Record<string, number | undefined | null>;
        deaths?: Record<string, number | undefined | null>;
        milestone?: {
            last_claimed_milestone?: number;
            [undocumentedProperties: string]: any;
        };
        [undocumentedProperties: string]: any;
    }
    public readonly motes_purse?: number;
    public readonly perks?: Record<string, number | null | undefined>;
    public readonly visited_zones?: string[];
    public readonly quests?: Record<string, HypixelSkyBlockQuest | null>;
    public readonly coin_purse?: number;
    public readonly accessory_bag_storage?: {
        tuning?: {
            [key: `slot_${number}`]: {
                health?: number;
                defense?: number;
                walk_speed?: number;
                strength?: number;
                critical_damage?: number;
                critical_chance?: number;
                attack_speed?: number;
                intelligence?: number;
                [undocumentedProperties: string]: any;
            },
            highest_unlocked_slot?: number;
            [undocumentedProperties: string]: any;
        };
        unlocked_powers?: string[];
        selected_power?: string;
        bag_upgrades_purchased?: number;
        highest_magical_power?: number;
        [undocumentedProperties: string]: any;
    };
    public readonly teleporter_pill_consumed?: boolean;
    public readonly leveling?: {
        experience?: number;
        completions?: Record<string, number | null | undefined>;
        completed_tasks?: string[];
        last_viewed_tasks?: string[];
        highest_pet_score?: number;
        mining_fiesta_ores_mined?: number;
        fishing_festival_sharks_killed?: number;
        migrated?: boolean;
        migrated_completions_2?: boolean;
        category_expanded?: boolean;
        claimed_talisman?: boolean;
        bop_bonus?: string;
        selected_symbol?: string;
        emblem_unlocks?: string[];
        [undocumentedProperties: string]: any;
    };
    achievement_spawned_island_types?: string[];
    trapper_quest?: {
        last_task_time?: number;
        pelt_count?: number;
        [undocumentedProperties: string]: any;
    };
    forge?: {
        forge_processes?: {
            [key: `forge_${number}`]: unknown;
            [undocumentedProperties: string]: any;
        };
        [undocumentedProperties: string]: any;
    };
    fairy_souls?: number;
    last_death?: number;
    first_join?: number;
    dungeons?: {
        dungeon_types?: {
            catacombs?: HypixelSkyBlockDungeonStatistics;
            master_catacombs?: HypixelSkyBlockDungeonStatistics;
            [undocumentedProperties: string]: any;
        };
        player_classes?: {
            healer?: {
                experience?: number;
                [undocumentedProperties: string]: any;
            };
            archer?: {
                experience?: number;
                [undocumentedProperties: string]: any;
            };
            mage?: {
                experience?: number;
                [undocumentedProperties: string]: any;
            };
            tank?: {
                experience?: number;
                [undocumentedProperties: string]: any;
            };
            berserk?: {
                experience?: number;
                [undocumentedProperties: string]: any;
            };
            [undocumentedProperties: string]: any;
        };
        dungeon_journal?: {
            unlocked_journals?: string[];
            [undocumentedProperties: string]: any;
        };
        dungeons_blah_blah?: string[];
        selected_dungeon_class?: string;
        daily_runs?: {
            current_day_stamp?: number;
            completed_runs_count?: number;
            [undocumentedProperties: string]: any;
        };
        treasures?: {
            runs?: HypixelSkyBlockDungeonRun[];
            chests?: HypixelSkyBlockDungeonChest[];
        };
        [undocumentedProperties: string]: any;
    };
    active_effects?: HypixelSkyBlockActiveEffect[];
    player_id?: string;
    nether_island_player_data?: {
        kuudra_completed_tiers?: Record<string, number>;
        dojo?: Record<string, number>;
        abiphone?: {
            contact_data?: Record<string, {
                talked_to?: boolean;
                completed_quest?: boolean;
                last_call?: number;
                dnd_enabled?: boolean;
                specific?: Record<string, unknown>;
                [undocumentedProperties: string]: any;
            }>;
            games?: {
                snake_best_score?: number;
                tic_tac_toe_draws?: number;
                [undocumentedProperties: string]: any;
            };
            active_contacts?: string[];
            operator_chip?: {
                repaired_index?: number;
                [undocumentedProperties: string]: any;
            };
            trio_contact_addons?: number;
            [undocumentedProperties: string]: any;
        };
        matriarch?: {
            pearls_collected?: number;
            last_attempt?: number;
            recent_refreshes?: number[];
            [undocumentedProperties: string]: any;
        };
        selected_faction?: string;
        barbarians_reputation?: number;
        mages_reputation?: number;
        last_minibosses_killed?: string[];
        kuudra_party_finder?: {
            search_settings?: {
                tier?: string;
                combat_level?: string;
                [undocumentedProperties: string]: any;
            };
            group_builder?: {
                tier?: string;
                note?: string;
                combat_level_required?: number;
            }
            [undocumentedProperties: string]: any;
        }
        [undocumentedProperties: string]: any;
    };
    jacob2?: {
        medals_inv?: {
            gold?: number;
            silver?: number;
            bronze?: number;
            [undocumentedProperties: string]: any;
        };
        perks?: {
            double_drops?: number;
            farming_level_cap?: number;
            [undocumentedProperties: string]: any;
        };
        contests?: {
            [key: `${number}:${number}_${number}:${string}`]: {
                collected?: number;
                claimed_rewards?: boolean;
                claimed_position?: number;
                claimed_participants?: number;
                claimed_medal?: string;
                [undocumentedProperties: string]: any;
            };
            [undocumentedProperties: string]: any;
        };
        talked?: boolean;
        unique_golds2?: string[];
        [undocumentedProperties: string]: any;
    };
    harp_quest?: {
        selected_song?: string;
        selected_song_epoch?: number;
        claimed_talisman?: boolean;
        [key: `song_${string}_completions`]: number;
        [key: `song_${string}_best_completion`]: number;
        [undocumentedProperties: string]: any;
    };
    experimentation?: {
        claims_resets?: number;
        claims_resets_timestamp?: number;
        serums_drank?: number;
        simon?: {
            last_attempt?: number;
            attempts_5?: number;
            bonus_clicks?: number;
            last_claimed?: number;
            claims_5?: number;
            best_score_5?: number;
            [undocumentedProperties: string]: any;
        };
        pairings?: {
            last_attempt?: number;
            attempts_5?: number;
            bonus_clicks?: number;
            last_claimed?: number;
            claims_5?: number;
            best_score_5?: number;
            [undocumentedProperties: string]: any;
        };
        numbers?: {
            last_attempt?: number;
            attempts_5?: number;
            bonus_clicks?: number;
            last_claimed?: number;
            claims_5?: number;
            best_score_5?: number;
            [undocumentedProperties: string]: any;
        };
        [undocumentedProperties: string]: any;
    };
    personal_bank_upgrade?: number;
    tutorial?: string[];
    soulflow?: number;
    autopet?: {
        rules_limit?: number;
        rules?: HypixelSkyBlockAutoPetRule[];
        migrated?: boolean;
        migrated_2?: boolean;
        [undocumentedProperties: string]: any;
    };
    inv_armor?: HypixelSkyBlockInventoryData;
    carfted_generators?: string[];
    visited_modes?: string[];
    disabled_potion_effects?: string[];
    mining_core?: {
        nodes?: Record<string, number>;
        received_free_tier?: boolean;
        tokens?: number;
        powder_mithril?: number;
        powder_mithril_total?: number;
        experience?: number;
        tokens_spent?: number;
        powder_spent_mithril?: number;
        selected_pickaxe_ability?: string;
        daily_ores_mined_day_mithril_ore?: number;
        daily_ores_mined_mithril_ore?: number;
        retroactive_tier2_token?: boolean;
        last_reset?: number;
        dailY_ores_mined_day?: number;
        daily_ores_mined?: number;
        crystals?: {
            [key: `${string}_crystal`]: {
                state?: string;
                total_placed?: number;
                total_found?: number;
                [undocumentedProperties: string]: any;
            };
        };
        greater_mines_last_access?: number;
        biomes?: Record<string, any>;
        powder_gemstone?: number;
        powder_gemstone_total?: number;
        daily_ores_mined_day_gemstone?: number;
        daily_ores_mined_gemstone?: number;
        powder_spent_gemstone?: number;
        [undocumentedProperties: string]: any;
    };
    trophy_fish?: {
        rewards?: number[];
        total_caught?: number;
        [remainingFish: string]: any;
    };
    reaper_peppers_eaten?: number;
    objectives?: Record<string, {
        status?: string;
        progress?: number;
        completed_at?: number;
        [undocumentedProperties: string]: any;
    }>;
    favorite_arrow?: string;
    paused_effects?: unknown[];
    essence_diamond?: number;
    essence_dragon?: number;
    essence_gold?: number;
    essence_undead?: number;
    essence_ice?: number;
    essence_crimson?: number;
    essence_wither?: number;
    essence_spider?: number;
    wardrobe_equipped_slot?: number;
    equippment_contents?: HypixelSkyBlockInventoryData;
    fishing_bag?: HypixelSkyBlockInventoryData;
    quiver?: HypixelSkyBlockInventoryData;
    ender_chest_contents?: HypixelSkyBlockInventoryData;
    wardrobe_contents?: HypixelSkyBlockInventoryData;
    potion_bag?: HypixelSkyBlockInventoryData;
    inv_contents?: HypixelSkyBlockInventoryData;
    talisman_bag?: HypixelSkyBlockInventoryData;
    candy_inventory_contents?: HypixelSkyBlockInventoryData;
    experience_skill_runecrafting?: number;
    experience_skill_combat?: number;
    experience_skill_mining?: number;
    experience_skill_taming?: number;
    experience_skill_alchemy?: number;
    experience_skill_farming?: number;
    experience_skill_enchanting?: number;
    experience_skill_fishing?: number;
    experience_skill_foraging?: number;
    experience_skill_social2?: number;
    experience_skill_carpentry?: number;
    unlocked_coll_tiers?: string[];
    collection?: Record<string, number>;
    backpack_contents?:{
        [key: `${number}`]: HypixelSkyBlockInventoryData;
        [undocumentedProperties: string]: any;
    };
    backpack_icons?:{
        [key: `${number}`]: HypixelSkyBlockInventoryData;
        [undocumentedProperties: string]: any;
    };
    sacks_counts?: Record<string, number>;

    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockProfileMember>) {
        super(root, resources);
        Object.assign(this, input);
    }
}
