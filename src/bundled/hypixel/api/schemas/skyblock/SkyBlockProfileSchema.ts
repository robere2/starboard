import type {HypixelAPI} from "../../HypixelAPI.ts";
import z from "zod";
import {BaseSchema} from "../../BaseAPI.ts";
import {UUID_REGEX} from "../../../../../util.ts";
import {ZodUnixDate} from "../ZodUnixDate.ts";
import {MinecraftInventoryDataSchema} from "../MinecraftInventoryDataSchema.ts";
import {ZodEnumHypixelSkyBlockDungeonClasses} from "../enums.ts";
import {HypixelPlayer} from "../PlayerSchema.ts";
import {HypixelEntity} from "../../HypixelEntity.ts";

export type SkyBlockProfileSchema = ReturnType<typeof generateSkyBlockProfileSchema>;
export type SkyBlockProfilesSchema = ReturnType<typeof generateSkyBlockProfilesSchema>;
export type HypixelSkyBlockProfile = z.infer<ReturnType<typeof skyBlockProfile>>;

function skyBlockProfile(api: HypixelAPI) {

    const numberStringType = (z.custom<`${number}`>((val) => {
        return typeof val === "string" ? /\d+/.test(val) : false;
    }));

    const dungeonTypes = z.custom<`catacombs` | `master_catacombs`>((val) => {
        return typeof val === "string" ? /(?:master_)?catacombs/.test(val) : false;
    })

    return z.object({
        profile_id: z.string().regex(UUID_REGEX),
        community_upgrades: z.object({
            currently_upgrading: z.object({
                upgrade: z.string(),
                new_tier: z.number().nonnegative().nullish(),
                started_ms: ZodUnixDate.readonly(),
                who_started: z.string().regex(UUID_REGEX) // TODO getter
            }).readonly().nullish().transform((upgrade) => {
                return Object.assign(new HypixelEntity(api), {
                    ...upgrade,

                    /**
                     *
                     */
                    async getStarter(this: HypixelEntity & typeof upgrade): Promise<HypixelPlayer | null> {
                        return await api.getPlayer(this.who_started);
                    },
                })
            }),
            upgrade_states: z.array(
                z.object({
                    upgrade: z.string(),
                    tier: z.number().nonnegative().nullish(),
                    started_ms: ZodUnixDate.readonly(),
                    started_by: z.string().regex(UUID_REGEX),
                    claimed_ms: ZodUnixDate.readonly(),
                    claimed_by: z.string().regex(UUID_REGEX),
                    fasttracked: z.boolean().nullish()
                }).readonly().transform((upgrade) => {
                    return Object.assign(new HypixelEntity(api), {
                        ...upgrade,

                        /**
                         *
                         */
                        async getStarter(this: HypixelEntity & typeof upgrade): Promise<HypixelPlayer | null> {
                            return await api.getPlayer(this.started_by);
                        },

                        /**
                         *
                         */
                        async getClaimer(this: HypixelEntity & typeof upgrade): Promise<HypixelPlayer | null> {
                            return await api.getPlayer(this.claimed_by);
                        }
                    })
                })
            ).default([]).readonly()
        }).nullish(),
        members: z.record(z.string().regex(UUID_REGEX), z.object({
            pets: z.array(
                z.object({
                    uuid: z.string().regex(UUID_REGEX).nullish(),
                    uniqueId: z.string().nullish(),
                    type: z.string().nullish(),
                    exp: z.number().nonnegative().nullish(),
                    active: z.boolean().nullish(),
                    tier: z.string().nullish(),
                    heldItem: z.string().nullish(),
                    candyUsed: z.number().nonnegative().nullish(),
                    skin: z.string().nullish(),
                    extra: z.record(z.string(), z.unknown()).default({}).readonly()
                }).readonly()
            ).default([]).readonly(),
            fairy_exchanges: z.number().nullish(),
            rift: z.object({
                village_plaza: z.object({
                    murder: z.object({
                        step_index: z.number().nullish(),
                        room_clues: z.array(z.string()).default([]).readonly()
                    }).readonly().nullish(),
                    barry_center: z.object({
                        first_talk_to_barry: z.boolean().nullish(),
                        convinced: z.array(z.string()).default([]).readonly(),
                        received_reward: z.boolean().nullish()
                    }).readonly().nullish(),
                    cowboy: z.object({
                        stage: z.number().nullish(),
                        hay_eaten: z.number().nullish(),
                        rabbit_name: z.string().nullish()
                    }).readonly().nullish(),
                    barter_bank: z.object({
                        // Currently unknown
                    }).readonly().nullish(),
                    lonely: z.object({
                        seconds_sitting: z.number().nonnegative().nullish()
                    }).readonly().nullish(),
                    seraphine: z.object({
                        step_index: z.number().nullish()
                    }).readonly().nullish(),
                    got_scammed: z.boolean().nullish()
                }).readonly().nullish(),
                wither_cage: z.object({
                    killed_eyes: z.array(z.string()).default([]).readonly()
                }).nullish().readonly(),
                black_lagoon: z.object({
                    talked_to_edwin: z.boolean().nullish(),
                    received_science_paper: z.boolean().nullish(),
                    delivered_science_paper: z.boolean().nullish(),
                    completed_step: z.number().nullish(),
                }).nullish().readonly(),
                dead_cats: z.object({
                    talked_to_jacquelle: z.boolean().nullish(),
                    picked_up_detector: z.boolean().nullish(),
                    found_cats: z.array(z.string()).default([]).readonly(),
                    unlocked_pet: z.boolean().nullish(),
                    montezuma: z.object({
                        uuid: z.string().regex(UUID_REGEX).nullish(),
                        type: z.string().nullish(),
                        exp: z.number().nullish(),
                        active: z.boolean().nullish(),
                        tier: z.string().nullish(),
                        heldItem: z.unknown().nullish(),
                        candyUsed: z.number().nullish(),
                        skin: z.unknown().nullish()
                    }).nullish().readonly()
                }).nullish().readonly(),
                wizard_tower: z.object({
                    wizard_quest_step: z.number().nullish(),
                    crumbs_laid_out: z.number().nullish()
                }).nullish().readonly(),
                west_village: z.object({
                    crazy_kloon: z.object({
                        selected_colors: z.record(z.string(), z.string().nullish()).default({}).readonly(),
                        talked: z.boolean().nullish(),
                        hacked_terminals: z.array(z.string()).default([]).readonly(),
                        quest_complete: z.boolean().nullish()
                    }).nullish().readonly(),
                    mirrorverse: z.object({
                        visited_rooms: z.array(z.string()).default([]).readonly(),
                        upside_down_hard: z.boolean().nullish(),
                        claimed_chest_items: z.array(z.string()).default([]).readonly(),
                        claimed_reward: z.boolean().nullish()
                    }).nullish().readonly(),
                    kat_house: z.object({

                        bin_collected_mosquito: z.number().nullish(),
                        bin_collected_silverfish: z.number().nullish(),
                        bin_collected_spider: z.number().nullish(),
                    }).nullish().readonly(),
                    glyphs: z.object({
                        claimed_wand: z.boolean().nullish(),
                        current_glyph_delivered: z.boolean().nullish(),
                        current_glyph_completed: z.boolean().nullish(),
                        current_glyph: z.number().nullish(),
                        completed: z.boolean().nullish(),
                        claimed_bracelet: z.boolean().nullish(),
                    }).nullish().readonly(),
                    enigma: z.object({
                        bought_cloak: z.boolean().nullish(),
                        found_souls: z.array(z.string()).default([]).readonly(),
                        claimed_bonus_index: z.number().nullish()
                    }).nullish().readonly(),
                    wyld_woods: z.object({
                        talked_threebrothers: z.array(z.string()).default([]).readonly(),
                        bughunter_step: z.number().nullish(),
                        sirius_started_q_a: z.boolean().nullish(),
                        sirius_q_a_chain_done: z.boolean().nullish(),
                        sirius_completed_q_a: z.boolean().nullish(),
                        sirius_claimed_doubloon: z.boolean().nullish(),
                    }).nullish().readonly(),
                    gallery: z.object({
                        elise_step: z.number().nullish(),
                        secured_trophies: z.array(
                            z.object({
                                type: z.string().nullish(),
                                timestamp: ZodUnixDate.nullish().readonly(),
                                visits: z.number().nullish()
                            }).readonly().nullish()
                        ).default([]).readonly(),
                        sent_trophy_dialogues: z.array(z.string()).default([]).readonly()
                    }).nullish().readonly(),
                    castle: z.object({
                        unlocked_pathway_skip: z.boolean().nullish(),
                        fairy_step: z.number().nullish()
                    }).nullish().readonly(),
                    access: z.object({
                        last_free: ZodUnixDate.nullish().readonly(),
                        consumed_prism: z.boolean().nullish()
                    }).nullish().readonly(),
                    slayer_quest: z.object({
                        type: z.string().nullish(),
                        tier: z.number().nullish(),
                        start_timestamp: ZodUnixDate.readonly().nullish(),
                        completion_state: z.number().nullish(),
                        used_armor: z.boolean().nullish(),
                        solo: z.boolean().nullish()
                    }).nullish().readonly(),
                    dreadfarm: z.object({
                        shania_stage: z.number().nullish()
                    }).nullish().readonly(),
                    lifetime_purchased_boundaries: z.array(z.string()).default([]).readonly(),
                    inventory: z.object({
                        ender_chest_contents: MinecraftInventoryDataSchema.nullish().readonly(),
                        ender_chest_page_icons: z.array(MinecraftInventoryDataSchema.readonly()).default([]).readonly(),
                        inv_contents: MinecraftInventoryDataSchema.nullish().readonly(),
                        inv_armor: MinecraftInventoryDataSchema.nullish().readonly(),
                        equippment_contents: MinecraftInventoryDataSchema.nullish().readonly(),
                    }).nullish().readonly()
                }).nullish().readonly()
            }).readonly().nullish(),
            temp_stat_buffs: z.array(z.unknown()).default([]).readonly(),
            fishing_treasure_caught: z.number().nonnegative().nullish(),
            slayer_bosses: z.record(z.string(),
                z.object({
                    claimed_levels: z.record(z.custom<`level_${number}` | `level_${number}_special`>((val) => {
                        return typeof val === "string" ? /level_\d+(?:_special)?/.test(val) : false;
                    }), z.boolean().nullish()).default({}).readonly(),
                    xp: z.number().nonnegative().nullish()
                }).catchall(z.number().nonnegative().nullish()).readonly() // https://github.com/colinhacks/zod/issues/2200
            ).default({}).readonly(),
            stats: z.record(z.string(), z.number().nullish()).default({}).readonly(),
            death_count: z.number().nonnegative().nullish(),
            first_join_hub: z.number().nonnegative().nullish(), // TODO convert to Date
            fairy_souls_collected: z.number().nonnegative().nullish(),
            bestiary: z.object({
                migrated_stats: z.boolean().nullish(),
                migration: z.boolean().nullish(),
                kills: z.record(z.string(),  z.number().nonnegative().nullish()).default({}).readonly(),
                deaths: z.record(z.string(),  z.number().nonnegative().nullish()).default({}).readonly(),
                milestone: z.object({
                    last_claimed_milestone: z.number().nullish()
                }).nullish().readonly()
            }).nullish().readonly(),
            motes_purse: z.number().nullish(),
            perks: z.record(z.string(), z.number().nullish()).default({}).readonly(),
            visited_zones: z.array(z.string()).default([]).readonly(),
            quests: z.record(z.string(),
                z.object({
                    status: z.union([z.literal('COMPLETE'), z.literal('ACTIVE'), z.string()]).nullish(),
                    activated_at: ZodUnixDate.nullish().readonly(),
                    activated_at_sb: z.number().nonnegative().nullish(),
                    completed_at: ZodUnixDate.nullish().readonly(),
                    completed_at_sb: z.number().nonnegative().nullish()
                }).nullish().readonly()
            ).default({}).readonly(),
            coin_purse: z.number().nullish(),
            accessory_bag_storage: z.object({
                tuning: z.object({
                    highest_unlocked_slot: z.number().nullish()
                }).catchall(z.object({ // https://github.com/colinhacks/zod/issues/2200
                    health: z.number().nullish(),
                    defense: z.number().nullish(),
                    walk_speed: z.number().nullish(),
                    strength: z.number().nullish(),
                    critical_damage: z.number().nullish(),
                    critical_chance: z.number().nullish(),
                    attack_speed: z.number().nullish(),
                    intelligence: z.number().nullish(),
                })).readonly().nullish(),
                unlocked_powers: z.array(z.string()).default([]).readonly(),
                selected_power: z.string().nullish(),
                bag_upgrades_purchased: z.number().nonnegative().nullish(),
                highest_magical_power: z.number().nullish()
            }).nullish().readonly(),
            teleporter_pill_consumed: z.boolean().nullish(),
            leveling: z.object({
                experience: z.number().nonnegative().nullish(),
                completions: z.record(z.string(), z.number().nullish()).default({}).readonly(),
                completed_tasks: z.array(z.string()).default([]).readonly(),
                last_viewed_tasks: z.array(z.string()).default([]).readonly(),
                highest_pet_score: z.number().nullish(),
                mining_fiesta_ores_mined: z.number().nullish(),
                fishing_festival_sharks_killed: z.number().nullish(),
                migrated: z.boolean().nullish(),
                migrated_completions_2: z.boolean().nullish(),
                category_expanded: z.boolean().nullish(),
                claimed_talisman: z.boolean().nullish(),
                bop_bonus: z.string().nullish(),
                selected_symbol: z.string().nullish(),
                emblem_unlocks: z.array(z.string()).default([]).readonly(),
            }).nullish().readonly(),
            achievement_spawned_island_types: z.array(z.string()).default([]).readonly(),
            trapper_quest: z.object({
                last_task_time: z.number().nullish(),
                pelt_count: z.number().nullish()
            }).nullish().readonly(),
            forge: z.object({
                forge_processes:  z.record(z.custom<`forge_${number}`>((val) => {
                    return typeof val === "string" ? /forge_\d+/.test(val) : false;
                }), z.unknown()).default({}).readonly(),
            }).nullish().readonly(),
            fairy_souls: z.number().nonnegative().nullish(),
            last_death: z.number().nonnegative().nullish(), // TODO convert to Date
            first_join: ZodUnixDate.nullish().readonly(),
            deletion_notice: z.object({
                timestamp: ZodUnixDate.nullish().readonly(),
            }).nullish().readonly(),
            dungeons: z.object({
                dungeon_types: z.record(dungeonTypes,
                    z.object({
                        experience: z.number().nonnegative().nullish(),
                        highest_tier_completed: z.number().nonnegative().nullish(),
                        times_played: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        tier_completions: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        fastest_time: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        best_runs: z.record(numberStringType,
                            z.array(
                                z.object({
                                    timestamp: z.number().nullish(),
                                    score_exploration: z.number().nullish(),
                                    score_speed: z.number().nullish(),
                                    score_skill: z.number().nullish(),
                                    score_bonus: z.number().nullish(),
                                    dungeon_class: z.string().nullish(),
                                    teammates: z.array(z.string().regex(UUID_REGEX)).default([]).readonly(),
                                    elapsed_time: z.number().nullish(),
                                    damage_dealt: z.number().nullish(),
                                    deaths: z.number().nullish(),
                                    mobs_killed: z.number().nullish(),
                                    secrets_found: z.number().nullish(),
                                    damage_mitigated: z.number().nullish(),
                                    ally_healing: z.number().nullish(),
                                }).readonly()
                            ).default([]).readonly()
                        ).default({}).readonly(),
                        best_score: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        mobs_killed: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        most_mobs_killed: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        most_healing: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        watcher_kills: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        fastest_time_s: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        most_damage_archer: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        most_damage_healer: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        most_damage_mage: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        most_damage_tank: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        most_damage_berserk: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        fastest_time_s_plus: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                        milestone_completions: z.record(numberStringType, z.number().nullish()).default({}).readonly(),
                    }).nullish().readonly()
                ).default({}).readonly(),
                player_classes: z.record(ZodEnumHypixelSkyBlockDungeonClasses,
                    z.object({
                        experience: z.number().nonnegative().nullish()
                    }).nullish().readonly()
                ).nullish().readonly(),
                dungeon_journal: z.object({
                    unlocked_journals: z.array(z.string()).default([]).readonly(),
                }).nullish().readonly(),
                dungeons_blah_blah: z.array(z.string()).default([]).readonly(),
                selected_dungeon_class: ZodEnumHypixelSkyBlockDungeonClasses.nullish(),
                daily_runs: z.object({
                    current_daily_stamp: z.number().nullish(),
                    completed_runs_count: z.number().nullish()
                }).nullish().readonly(),
                treasures: z.object({
                    runs: z.array(
                        z.object({
                            run_id: z.string().regex(UUID_REGEX),
                            completion_ts: ZodUnixDate.readonly(),
                            dungeon_type: dungeonTypes,
                            dungeon_tier: z.number(),
                            participants: z.array(
                                z.object({
                                    player_uuid: z.string().regex(UUID_REGEX),
                                    display_name: z.string(),
                                    class_milestone: z.number().nonnegative()
                                }).readonly().transform((participant) => {
                                    return Object.assign(new HypixelEntity(api), {
                                        ...participant,

                                        /**
                                         *
                                         */
                                        async getPlayer(this: HypixelEntity & typeof participant): Promise<HypixelPlayer | null> {
                                            return api.getPlayer(participant.player_uuid)
                                        }
                                    })
                                })
                            ).default([]).readonly(),
                        }).readonly()
                    ).default([]).readonly(),
                    chests: z.array(
                        z.object({
                            run_id: z.string().regex(UUID_REGEX),
                            chest_id: z.string().regex(UUID_REGEX),
                            treasure_type: z.string(),
                            rewards: z.object({
                                rewards: z.array(z.string()).default([]).readonly(),
                                rolled_rng_meter_randomly: z.boolean().nullish()
                            }).readonly(),
                            quality: z.number(),
                            shiny_eligible: z.boolean().nullish(),
                            paid: z.boolean().nullish(),
                            rerolls: z.number().nullish()
                        }).readonly()
                    ).default([]).readonly(),
                }).nullish().readonly()
            }).nullish().readonly(),
            active_effects: z.array(
                z.object({
                    effect: z.string().nullish(),
                    level: z.number().nonnegative().nullish(),
                    modifiers: z.array(
                        z.object({
                            key: z.string().nullish(),
                            amp: z.number().nonnegative().nullish()
                        }).readonly()
                    ).default([]).readonly(),
                    ticks_remaining: z.number().nullish(),
                    infinite: z.boolean().nullish()
                }).readonly()
            ).default([]).readonly(),
            player_id: z.string().regex(UUID_REGEX),
            nether_island_player_data: z.object({
                kuudra_completed_tiers: z.record(z.string(), z.number().nullish()).default({}).readonly(),
                dojo: z.record(z.string(), z.number().nullish()).default({}).readonly(),
                abiphone: z.object({
                    contact_data: z.record(z.string(),
                        z.object({
                            talked_to: z.boolean().nullish(),
                            completed_quest: z.boolean().nullish(),
                            last_call: ZodUnixDate.nullish().readonly(),
                            dnd_enabled: z.boolean().nullish(),
                            specific: z.record(z.string(), z.unknown()).default({}).readonly()
                        }).nullish().readonly()
                    ).default({}).readonly(),
                    games: z.object({
                        snake_best_score: z.number().nonnegative().nullish(),
                        tic_tac_toe_draws: z.number().nonnegative().nullish()
                    }).nullish().readonly(),
                    active_contacts: z.array(z.string()).default([]).readonly(),
                    operator_chip: z.object({
                        repaired_index: z.number().nullish()
                    }).readonly().nullish(),
                    trio_contact_addons: z.number().nullish()
                }).nullish().readonly(),
                matriarch: z.object({
                    pearls_collected: z.number().nullish(),
                    last_attempt: ZodUnixDate.nullish().readonly(),
                    recent_refreshes: z.array(z.number()).default([]).readonly(),
                }).nullish().readonly(),
                selected_faction: z.string().nullish(),
                barbarians_reputation: z.number().nullish(),
                mages_reputation: z.number().nullish(),
                last_minibosses_killed: z.array(z.string()).default([]).readonly(),
                kuudra_party_finder: z.object({
                    search_settings: z.object({
                        tier: z.string().nullish(),
                        combat_level: z.string().nullish()
                    }).nullish().readonly(),
                    group_builder: z.object({
                        tier: z.string().nullish(),
                        note: z.string().nullish(),
                        combat_level_required: z.number().nullish()
                    }).nullish().readonly()
                }).nullish().readonly()
            }).nullish().readonly(),
            jacob2: z.object({
                medals_inv: z.object({
                    gold: z.number().nonnegative().nullish(),
                    silver: z.number().nonnegative().nullish(),
                    bronze: z.number().nonnegative().nullish()
                }).nullish().readonly(),
                perks: z.object({
                    double_drops: z.number().nullish(),
                    farming_level_cap: z.number().nullish()
                }).nullish().readonly(),
                contests: z.record(z.custom<`${number}:${number}_${number}:${string}`>((val) => {
                        return typeof val === "string" ? /\d+:\d+_\d+:.+/.test(val) : false;
                    }),
                    z.object({
                        collected: z.number().nullish(),
                        claimed_rewards: z.boolean().nullish(),
                        claimed_position: z.number().nullish(),
                        claimed_participants: z.number().nullish(),
                        claimed_medal: z.string().nullish()
                    }).nullish().readonly()
                ).default({}).readonly(),
                talked: z.boolean().nullish(),
                unique_golds2: z.array(z.string()).default([]).readonly()
            }).nullish().readonly(),
            harp_quest: z.object({
                selected_song: z.string().nullish(),
                selected_song_epoch: ZodUnixDate.nullish().readonly(),
                claimed_talisman: z.boolean().nullish()
            }).catchall(z.number().nonnegative().nullish()).nullish().readonly(),
            experimentation: z.object({
                claims_resets: z.number().nullish(),
                claims_resets_timestamp: ZodUnixDate.nullish().readonly(),
                serums_drank: z.number().nullish(),
                simon: z.object({
                    last_attempt: ZodUnixDate.nullish().readonly(),
                    last_claimed: ZodUnixDate.nullish().readonly(),
                    bonus_clicks: z.number().nullish()
                }).catchall(z.number()).nullish().readonly(),
                pairings: z.object({
                    last_attempt: ZodUnixDate.nullish().readonly(),
                    last_claimed: ZodUnixDate.nullish().readonly(),
                    bonus_clicks: z.number().nullish()
                }).catchall(z.number()).nullish().readonly(),
                numbers: z.object({
                    last_attempt: ZodUnixDate.nullish().readonly(),
                    last_claimed: ZodUnixDate.nullish().readonly(),
                    bonus_clicks: z.number().nullish()
                }).catchall(z.number()).nullish().readonly()
            }).nullish().readonly(),
            personal_bank_upgrade: z.number().nullish(),
            tutorial: z.array(z.string()).default([]).readonly(),
            soulflow: z.number().nullish(),
            autopet: z.object({
                rules_limit: z.number().nullish(),
                rules: z.array(
                    z.object({
                        uuid: z.string().regex(UUID_REGEX).nullish(),
                        id: z.string().nullish(),
                        name: z.string().nullish(),
                        uniqueId: z.string().nullish(),
                        exceptions: z.array(
                            z.object({
                                id: z.string().nullish(),
                                data: z.record(z.string(), z.string()).default({}).readonly()
                            }).readonly()
                        ).default([]).readonly(),
                        disabled: z.boolean().nullish(),
                        data: z.record(z.string(), z.string()).default({}).readonly()
                    })
                ).default([]).readonly(),
                migrated: z.boolean().nullish(),
                migrated_2: z.boolean().nullish()
            }).nullish().readonly(),
            inv_armor: MinecraftInventoryDataSchema.nullish().readonly(),
            crafted_generators: z.array(z.string()).default([]).readonly(),
            visited_modes: z.array(z.string()).default([]).readonly(),
            disabled_potion_effects: z.array(z.string()).default([]).readonly(),
            mining_core: z.object({
                nodes: z.record(z.string(), z.union([z.number(), z.boolean()])).default({}).readonly(),
                received_free_tier: z.boolean().nullish(),
                tokens: z.number().nullish(),
                powder_mithril: z.number().nullish(),
                powder_mithril_total: z.number().nullish(),
                experience: z.number().nullish(),
                tokens_spent: z.number().nullish(),
                powder_spent_mithril: z.number().nullish(),
                selected_pickaxe_ability: z.string().nullish(),
                daily_ores_mined_day_mithril_ore: z.number().nullish(),
                daily_ores_mined_mithril_ore: z.number().nullish(),
                retroactive_tier2_token: z.boolean().nullish(),
                last_reset: z.number().nullish(),
                dailY_ores_mined_day: z.number().nullish(),
                daily_ores_mined: z.number().nullish(),
                crystals: z.record(z.custom<`${string}_crystal`>((val) => {
                    return typeof val === "string" ? /.*_crystal/.test(val) : false;
                }),
                    z.object({
                        state: z.string().nullish(),
                        total_placed: z.number().nullish(),
                        total_found: z.number().nullish()
                    }).nullish().readonly()
                ).default({}).readonly(),
            }).nullish().readonly(),
            trophy_fish: z.object({
                rewards: z.array(z.number()).default([]).readonly(),
                total_caught: z.number().nonnegative().nullish(),
            }).catchall(z.number()).nullish().readonly(), // https://github.com/colinhacks/zod/issues/2200
            reaper_peppers_eaten: z.number().nullish(),
            objectives: z.record(z.string(), z.object({
                status: z.string().nullish(),
                progress: z.number().nullish(),
                completed_at: ZodUnixDate.nullish().readonly()
            }).readonly()).default({}).readonly(),
            favorite_arrow: z.string().nullish(),
            paused_effects: z.array(z.unknown()).default([]).readonly(),
            essence_diamond: z.number().nullish(),
            essence_dragon: z.number().nullish(),
            essence_gold: z.number().nullish(),
            essence_undead: z.number().nullish(),
            essence_ice: z.number().nullish(),
            essence_crimson: z.number().nullish(),
            essence_wither: z.number().nullish(),
            essence_spider: z.number().nullish(),
            wardrobe_equipped_slot: z.number().nullish(),
            equippment_contents: MinecraftInventoryDataSchema.nullish().readonly(),
            fishing_bag: MinecraftInventoryDataSchema.nullish().readonly(),
            quiver: MinecraftInventoryDataSchema.nullish().readonly(),
            ender_chest_contents: MinecraftInventoryDataSchema.nullish().readonly(),
            wardrobe_contents: MinecraftInventoryDataSchema.nullish().readonly(),
            potion_bag: MinecraftInventoryDataSchema.nullish().readonly(),
            inv_contents: MinecraftInventoryDataSchema.nullish().readonly(),
            talisman_bag: MinecraftInventoryDataSchema.nullish().readonly(),
            candy_inventory_contents: MinecraftInventoryDataSchema.nullish().readonly(),
            experience_skill_runecrafting: z.number().nullish(),
            experience_skill_combat: z.number().nullish(),
            experience_skill_mining: z.number().nullish(),
            experience_skill_taming: z.number().nullish(),
            experience_skill_alchemy: z.number().nullish(),
            experience_skill_farming: z.number().nullish(),
            experience_skill_enchanting: z.number().nullish(),
            experience_skill_fishing: z.number().nullish(),
            experience_skill_foraging: z.number().nullish(),
            experience_skill_social2: z.number().nullish(),
            experience_skill_carpentry: z.number().nullish(),
            unlocked_coll_tiers: z.array(z.string()).default([]).readonly(),
            collection: z.record(z.string(), z.number()).default({}).readonly(),
            backpack_contents: z.record(z.custom<`${number}`>((val) => {
                return typeof val === "string" ? /\d+/.test(val) : false;
            }), MinecraftInventoryDataSchema.readonly()).default({}).readonly(),
            backpack_icons: z.record(z.custom<`${number}`>((val) => {
                return typeof val === "string" ? /\d+/.test(val) : false;
            }), MinecraftInventoryDataSchema.readonly()).default({}).readonly(),
            sacks_counts: z.record(z.string(), z.number()).default({}).readonly(),
        })).default({}),
        banking: z.object({
            balance: z.number().nullish(),
            transactions: z.array(
                z.object({
                    amount: z.number(),
                    timestamp: ZodUnixDate,
                    action: z.string(),
                    initiator_name: z.string()
                })
            ).default([])
        }).nullish()
    })
}

export function generateSkyBlockProfileSchema(api: HypixelAPI) {
    return BaseSchema.extend({
        profile: skyBlockProfile(api).nullish()
    })
}

export function generateSkyBlockProfilesSchema(api: HypixelAPI) {
    return BaseSchema.extend({
        profiles: z.array(skyBlockProfile(api)).default([])
    })
}
