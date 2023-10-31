import {compile} from 'json-schema-to-typescript'
import * as fs from "fs";
import {dirname, join} from "path"
import {fileURLToPath} from "url"
import Ajv from "ajv";
import { diff } from "json-diff";
import toJsonSchema from "gen-json-schema";

const __dirname = dirname(fileURLToPath(import.meta.url))

const data =  {
    "_id": "51e5ae2b0cf2a5a89b742a92",
    "achievements": {
        "arena_bossed": 77,
        "arena_climb_the_ranks": 1005,
        "arena_gladiator": 77,
        "arena_gotta_wear_em_all": 4,
        "blitz_coins": 224706,
        "blitz_kills": 6016,
        "blitz_wins": 374,
        "general_coins": 264009,
        "general_wins": 1327,
        "paintball_coins": 77352,
        "paintball_kills": 2399,
        "paintball_wins": 55,
        "quake_killing_sprees": 96,
        "quake_kills": 4265,
        "quake_wins": 37,
        "tntgames_bow_spleef_wins": 2,
        "tntgames_tnt_run_wins": 11,
        "tntgames_wizards_wins": 32,
        "vampirez_coins": 39273,
        "vampirez_kill_survivors": 76,
        "vampirez_kill_vampires": 334,
        "vampirez_survivor_wins": 7,
        "walls3_coins": 42872,
        "walls3_kills": 1235,
        "walls3_wins": 74,
        "walls_coins": 5570,
        "walls_kills": 44,
        "walls_wins": 28,
        "warlords_paladin_level": 0,
        "warlords_shaman_level": 0,
        "warlords_warrior_level": 0,
        "warlords_mage_level": 51,
        "warlords_kills": 414,
        "warlords_assist": 455,
        "warlords_repair_weapons": 237,
        "warlords_coins": 4264,
        "uhc_champion": 19,
        "uhc_hunter": 144,
        "skywars_kills_team": 1541,
        "skywars_kills_solo": 768,
        "skywars_wins_team": 333,
        "skywars_kits_team": 30,
        "skywars_kits_solo": 30,
        "skywars_wins_solo": 96,
        "skywars_cages": 25,
        "uhc_moving_up": 334,
        "uhc_bounty": 59810,
        "warlords_ctf_wins": 27,
        "warlords_dom_wins": 13,
        "truecombat_kit_hoarder_team": 1,
        "truecombat_kit_hoarder_solo": 1,
        "walls3_guardian": 39,
        "truecombat_team_killer": 9,
        "truecombat_team_winner": 1,
        "truecombat_solo_killer": 13,
        "truecombat_solo_winner": 1,
        "supersmash_smash_champion": 19,
        "supersmash_smash_winner": 32,
        "supersmash_hero_slayer": 206,
        "supersmash_handyman": 1,
        "copsandcrims_serial_killer": 418,
        "copsandcrims_hero_terrorist": 49,
        "copsandcrims_cac_banker": 600,
        "copsandcrims_bomb_specialist": 34,
        "skywars_kills_mega": 29,
        "skywars_wins_mega": 6,
        "skywars_kits_mega": 1,
        "speeduhc_hunter": 3,
        "general_challenger": 687,
        "general_quest_master": 381,
        "speeduhc_uhc_master": 1,
        "skyclash_cards_unlocked": 30,
        "skyclash_packs_opened": 24,
        "skyclash_kills": 65,
        "skyclash_wins": 8,
        "arcade_miniwalls_winner": 12,
        "arcade_farmhunt_dominator": 10,
        "arcade_team_work": 54,
        "arcade_arcade_winner": 83,
        "arcade_zombie_killer": 1202,
        "arcade_bounty_hunter": 3,
        "tntgames_tnt_triathlon": 65,
        "quake_coins": 13453,
        "gingerbread_banker": 540702,
        "gingerbread_racer": 23,
        "vampirez_zombie_killer": 51,
        "bedwars_loot_box": 204,
        "bedwars_beds": 1208,
        "bedwars_wins": 502,
        "bedwars_level": 88,
        "blitz_wins_teams": 2,
        "blitz_war_veteran": 0,
        "blitz_looter": 53,
        "tntgames_tnt_wizards_kills": 214,
        "tntgames_tnt_tag_wins": 3,
        "tntgames_pvp_run_killer": 1,
        "tntgames_pvp_run_wins": 0,
        "tntgames_tnt_banker": 1561,
        "arcade_arcade_banker": 7969,
        "walls3_rusher": 2000,
        "truecombat_king": 2,
        "murdermystery_wins_as_survivor": 161,
        "murdermystery_kills_as_murderer": 249,
        "murdermystery_wins_as_murderer": 12,
        "halloween2017_pumpkin_smasher": 3947,
        "halloween2017_pumpkinator": 1067,
        "christmas2017_advent": 24,
        "christmas2017_no_christmas": 345,
        "christmas2017_santa_says_rounds": 164,
        "buildbattle_build_battle_winner": 17,
        "buildbattle_build_battle_points": 315,
        "buildbattle_build_battle_voter": 325,
        "buildbattle_build_battle_score": 685,
        "buildbattle_guess_the_build_guesses": 107,
        "buildbattle_guess_the_build_winner": 2,
        "speeduhc_salty": 5300,
        "speeduhc_collector": 9,
        "duels_duels_winner": 1,
        "duels_duels_win_streak": 1,
        "walls3_jack_of_all_trades": 5,
        "bedwars_bedwars_killer": 1724,
        "christmas2017_advent_2018": 2,
        "uhc_consumer": 129,
        "skywars_wins_lab": 7,
        "blitz_kit_collector": 27,
        "gingerbread_winner": 8,
        "paintball_hat_collector": 5,
        "paintball_kill_streaks": 118,
        "arena_magical_box": 6,
        "gingerbread_mystery": 297,
        "skyblock_excavator": 25,
        "skyblock_harvester": 20,
        "skyblock_combat": 17,
        "skyblock_gatherer": 20,
        "skyblock_angler": 10,
        "skyblock_treasury": 60,
        "skyblock_concoctor": 6,
        "skyblock_augmentation": 16,
        "skyblock_minion_lover": 199,
        "christmas2017_advent_2019": 3,
        "christmas2017_advent_2020": 5,
        "copsandcrims_headshot_kills": 242,
        "skywars_you_re_a_star": 10,
        "speeduhc_promotion": 13,
        "warlords_ctf_objective": 3,
        "bedwars_collectors_edition": 35,
        "summer_shopaholic": 131,
        "skyblock_hard_working_miner": 4,
        "christmas2017_advent_2021": 4,
        "general_master_lure": 22,
        "general_trashiest_diver": 4,
        "general_luckiest_of_the_sea": 2,
        "easter_egg_finder": 26,
        "easter_throw_eggs": 1,
        "arcade_dw_slayer": 16,
        "arcade_galaxy_wars_kills": 11,
        "arcade_throw_out_kills": 83,
        "pit_gold": 253,
        "pit_kills": 7,
        "murdermystery_brainiac": 48,
        "murdermystery_countermeasures": 24,
        "murdermystery_hitman": 34,
        "murdermystery_survival_skills": 2,
        "arcade_pixel_party_color_coordinated": 80,
        "arcade_pixel_party_powered_up": 1,
        "skyblock_sb_levels": 34,
        "skyblock_people_pleaser": 15
    },
    "achievementsOneTime": [
        "general_first_join",
        "general_vip",
        "general_vip_plus",
        "general_youtuber",
        "general_first_chat",
        "general_first_party",
        "general_first_friend",
        "general_friends_25",
        "general_use_portal",
        "quake_looking_fancy",
        "quake_buffing_up",
        "general_first_game",
        "general_use_pet",
        "general_join_vip_lobby",
        "general_buy_golem",
        "tntgames_bow_spleef_first_double_jump",
        "walls_revenge",
        "paintball_unlock_killstreaks",
        "vampirez_vampire_shop",
        "vampirez_purchase_sword",
        "vampirez_purchase_food",
        "vampirez_purchase_armor",
        "vampirez_gold",
        "vampirez_purchase_gold",
        "quake_first_kill",
        "quake_bogof",
        "quake_going_up_in_life",
        "quake_good_guy_gamer",
        "quake_doubling_up",
        "blitz_first_game",
        "blitz_craft_bread",
        "blitz_get_diamond_sword",
        "quake_what_have_i_done",
        "paintball_activate_leeroy_jenkins",
        "blitz_first_blood",
        "blitz_kill_without_kit",
        "blitz_spawn_horse",
        "tntgames_bow_spleef_first_win",
        "walls_first_kit",
        "walls_no_team_deaths",
        "blitz_enchant_sword",
        "blitz_fish_kill",
        "blitz_seven_kits",
        "blitz_use_wolf_tamer",
        "blitz_full_inventory",
        "blitz_find_blitz",
        "blitz_youtuber",
        "walls_get_diamond_sword",
        "blitz_find_head",
        "walls3_find_chest",
        "tntgames_wizards_first_win",
        "paintball_no_killstreaks",
        "quake_in_my_way",
        "blitz_no_looting",
        "blitz_apocalypse",
        "blitz_win_before_deathmatch",
        "walls3_first_skill_upgrade",
        "walls3_first_gathering_skill_upgrade",
        "blitz_enchanted_armor",
        "walls_craft_flint",
        "paintball_combo",
        "quake_humiliation",
        "tntgames_tnt_run_first_win",
        "walls3_attack_wither",
        "walls3_mine_diamond",
        "quake_my_way",
        "paintball_first_kill",
        "walls3_win_before_deathmatch",
        "walls3_win_with_living_wither",
        "walls3_kill_with_groopo",
        "quake_billy_talent",
        "paintball_unlock_hat",
        "paintball_last_kill",
        "paintball_activate_killstreaks",
        "tntgames_tnt_run_purchase_potion",
        "walls_craft_boat",
        "walls_catch_fish",
        "quake_baking_a_dozen",
        "quake_simple_things",
        "blitz_level_seven",
        "quake_one_shot",
        "tntgames_tnt_run_no_sprinting",
        "vampirez_blood",
        "vampirez_vampire_fang_kill",
        "quake_heart_stopper",
        "arena_offensive",
        "arena_utility",
        "arena_support",
        "arena_magical",
        "arena_runic",
        "arena_totem_destroyer",
        "vampirez_kill_zombies",
        "vampirez_purchase_blood",
        "vampirez_first_wave_kill",
        "vampirez_sole_survivor",
        "blitz_pigrider",
        "paintball_admin_hat",
        "vampirez_vampire_kills_one_round",
        "paintball_activate_plus_ten",
        "walls_ride_horse",
        "arena_pairs",
        "general_a_long_journey_begins",
        "arcade_farm_hunt_disguise",
        "arcade_ptb_ride_bat",
        "arcade_hoehoehoe_score",
        "arcade_party_games_stars",
        "arcade_trampolinio_red_wool",
        "arcade_pig_fishing_super_bacon",
        "arcade_throw_out_powerup_kill",
        "arcade_bounty_hunter_target_killer",
        "walls_first_perk",
        "arcade_dragon_killer",
        "quake_my_precious",
        "general_creeperbook",
        "warlords_giddy_up",
        "warlords_first_of_many",
        "warlords_medium_rare",
        "warlords_makin_some_room",
        "skywars_enderdragon",
        "skywars_gotcha",
        "skywars_touch_of_death",
        "skywars_well_well",
        "skywars_now_im_enchanted",
        "skywars_shiny_stuff",
        "skywars_mob_spawner",
        "skywars_gapple",
        "skywars_baller",
        "skywars_fortunate",
        "skywars_max_perk",
        "uhc_seafood",
        "uhc_adrenaline",
        "uhc_drink_with_caution",
        "uhc_crafting_revolution",
        "uhc_ride_a_horse",
        "uhc_bye_cruel_world",
        "uhc_ultimate_recipe",
        "skywars_fast_and_furious",
        "skywars_nick_cage",
        "housing_join_guild",
        "housing_join_friend",
        "housing_join_staff",
        "housing_join_random",
        "housing_join_youtube",
        "housing_new_look",
        "housing_give_cookie",
        "walls3_save_your_stuff",
        "housing_recieve_cookie",
        "quake_team_player",
        "housing_become_resident",
        "truecombat_dominating",
        "truecombat_strategist",
        "skywars_gone_fishing",
        "truecombat_destiny_calls",
        "truecombat_redstone_dealer",
        "truecombat_cross_fingers",
        "truecombat_deadly_donation",
        "truecombat_golden_bounty",
        "truecombat_legendary",
        "housing_make_resident",
        "supersmash_botmon_challenge",
        "supersmash_second_round",
        "supersmash_supremacy",
        "supersmash_get_over_here",
        "supersmash_need_all",
        "supersmash_domination",
        "supersmash_too_easy",
        "walls3_advanced_strategies",
        "copsandcrims_like_my_gun",
        "copsandcrims_homing_bullets",
        "walls_vampirism",
        "warlords_chain_kill",
        "skywars_legendary",
        "general_gifting",
        "uhc_ultimate_crafting",
        "speeduhc_potion_brewer",
        "speeduhc_melon_smasher",
        "skyclash_my_playstyle",
        "skyclash_addicted",
        "skyclash_stay",
        "skyclash_powerspike",
        "skyclash_im_a_wizard",
        "skywars_lucky_souls",
        "arcade_world_economics",
        "uhc_kit_mastery",
        "gingerbread_new_style",
        "gingerbread_get_hit_by_me",
        "gingerbread_taste_my_banana",
        "gingerbread_getting_good",
        "copsandcrims_warfare_stylist",
        "bedwars_first_blood",
        "bedwars_team_player",
        "bedwars_first",
        "bedwars_geared_up",
        "bedwars_super_looter",
        "bedwars_emerald_hoarder",
        "bedwars_strategist",
        "bedwars_merciless",
        "bedwars_dont_need_bed",
        "blitz_blitz_maniac",
        "bedwars_already_over",
        "bedwars_ultimate_defense",
        "bedwars_bed_trap",
        "bedwars_diamond_hoarder",
        "bedwars_destroy_beds",
        "bedwars_fireballs",
        "bedwars_alchemist",
        "bedwars_builder",
        "bedwars_shear_luck",
        "tntgames_tnt_parkour",
        "bedwars_pickaxe_challenge",
        "bedwars_survivor",
        "skywars_fists_of_fury",
        "skywars_open_chest",
        "bedwars_iron_punch",
        "bedwars_golem",
        "bedwars_sniper",
        "bedwars_slayer",
        "murdermystery_play_game_in_lobby",
        "murdermystery_shoot_thrown_knife",
        "murdermystery_pickup_gold",
        "murdermystery_be_the_hero",
        "murdermystery_first_shot_hit",
        "murdermystery_kill_murderer_after_kill",
        "murdermystery_thirty_gold_picked_up",
        "murdermystery_secret_chamber",
        "uhc_shiny_rock",
        "murdermystery_hit_by_sword_while_invinc",
        "murdermystery_survive_storm_on_top",
        "murdermystery_clear_cacti",
        "murdermystery_play_both_games",
        "murdermystery_win_survivor_due_to_time",
        "murdermystery_all_directions",
        "murdermystery_five_curses",
        "murdermystery_ride_monorail",
        "murdermystery_soldiers_eliminated",
        "murdermystery_blessing_and_curse",
        "murdermystery_kali_favor",
        "halloween2017_second_ghost",
        "halloween2017_hi_there",
        "halloween2017_good_try",
        "halloween2017_pumpkin_dancer",
        "halloween2017_tbr_observatory_spin",
        "halloween2017_all_ghosts",
        "halloween2017_pumpkin_death",
        "halloween2017_tbr_kraken_assault",
        "halloween2017_tbr_midtown_trip",
        "halloween2017_tbr_midtown_trip_1_20",
        "halloween2017_tbr_observatory_spin_1_10",
        "halloween2017_tbr_kraken_assault_1_25",
        "halloween2017_spooky_chest",
        "general_achievement_npc",
        "tntgames_tnt_run_short",
        "christmas2017_hunt_begins",
        "christmas2017_bouncy_castle",
        "christmas2017_merry_christmas",
        "christmas2017_real_santa",
        "christmas2017_eat_this",
        "christmas2017_sharing_is_caring",
        "christmas2017_santa_helper",
        "buildbattle_teamwork",
        "christmas2017_steal_fairly",
        "christmas2017_greed_incarnate",
        "christmas2017_uh_uh",
        "christmas2017_sugar_rush",
        "christmas2017_nom_nom",
        "christmas2017_not_my_mom",
        "christmas2017_dem_cows",
        "christmas2017_respect_your_elder",
        "christmas2017_blacksmith",
        "murdermystery_three_knife_throw_kills",
        "christmas2017_legendary",
        "murdermystery_killstreak",
        "murdermystery_no_gold_pickup",
        "murdermystery_win_as_murderer_short_time",
        "murdermystery_three_arrows",
        "murdermystery_sword_kill_long_range",
        "murdermystery_murderer_first_kill",
        "murdermystery_kill_on_horse",
        "murdermystery_win_while_invincible",
        "murdermystery_block_with_barrier",
        "murdermystery_kill_in_rapid_transport",
        "murdermystery_win_murderer_fell_in_trap",
        "murdermystery_kill_murderer_as_last_alive",
        "murdermystery_kill_murderer_while_blinded",
        "murdermystery_drink_many_potions",
        "buildbattle_ooo_shiny",
        "buildbattle_professional_builder",
        "buildbattle_no_mistakes",
        "buildbattle_artist",
        "buildbattle_braniac",
        "buildbattle_every_second_counts",
        "buildbattle_fancy",
        "buildbattle_guessing_streak",
        "buildbattle_obvious",
        "christmas2017_christmas_quest",
        "buildbattle_fast_typer",
        "buildbattle_superior_vote",
        "buildbattle_stenographer",
        "buildbattle_mobster",
        "buildbattle_over_99",
        "buildbattle_that_wood_be_perfect",
        "murdermystery_return_from_dead_win",
        "blitz_rambo",
        "speeduhc_kit_unlock",
        "murdermystery_special_two_in_a_row",
        "murdermystery_bow_killstreak",
        "murdermystery_murderer_bow_kills",
        "murdermystery_bow_kill_on_detective",
        "murdermystery_kill_detective_fast",
        "walls3_max_herobrine_skills",
        "walls3_max_skills",
        "uhc_prestigious",
        "duels_competitor",
        "walls3_happy",
        "tntgames_tnt_tag_first_win",
        "bedwars_its_dark_down_there",
        "skywars_map_select",
        "housing_grand_opening",
        "halloween2017_second_ghost_2018",
        "halloween2017_all_ghosts_2018",
        "easter_first_egg_2019",
        "easter_easter_egg",
        "easter_all_eggs_2019",
        "easter_happy_easter_2019",
        "vampirez_upgraded",
        "gingerbread_honking_amazing",
        "skyblock_lost_soul",
        "skyblock_quest_complete",
        "skyblock_soul_hunter",
        "skyblock_production_expanded",
        "skyblock_accessories_galore",
        "skyblock_explorer",
        "skyblock_your_adventure_begins",
        "skyblock_a_challenging_climb",
        "skyblock_a_good_spider_is_a_dead_spider",
        "skyblock_master_enchanter",
        "skyblock_into_the_deep",
        "skyblock_your_big_break",
        "skyblock_heart_of_the_end",
        "tntgames_tnt_run_flying",
        "bedwars_savvy_shopper",
        "christmas2017_hunt_begins_2019",
        "easter_first_egg_2020",
        "christmas2017_hunt_begins_2020",
        "christmas2017_to_war",
        "christmas2017_groopo_returns",
        "christmas2017_real_santa_2020",
        "general_treasure_hunt_2021",
        "general_hot_potato",
        "skyblock_time_to_go_on_vacation",
        "skyblock_resourceful",
        "skyblock_deep_storage",
        "skyblock_mass_production",
        "skyblock_businessman",
        "christmas2017_todays_the_day",
        "general_grapple_pro",
        "easter_first_egg_2022",
        "general_lobby_explorer",
        "easter_hop_to_it",
        "general_treasure_hunt_2022",
        "general_labyrinthine_collector",
        "general_keep_quiet",
        "general_fishing_hobbyist",
        "general_doing_my_part",
        "easter_spring_fishing",
        "general_code_breaker",
        "bedwars_buggy_beds",
        "easter_happy_easter_2023",
        "skyblock_cleanup_crew",
        "skyblock_quite_the_crowd",
        "skyblock_compost_collector",
        "skyblock_fancy_farming",
        "skyblock_wow_useful"
    ],
    "auto_spawn_pet": true,
    "channel": "ALL",
    "chat": true,
    "disguise": "IRON_GOLEM",
    "displayname": "bugfroggy",
    "eulaCoins": true,
    "fireworkStorage": [
        {
            "flight_duration": 2,
            "shape": "BALL_LARGE",
            "trail": true,
            "twinkle": true,
            "colors": "127,63,178:51,76,178:76,127,153:102,153,216",
            "fade_colors": "229,229,51:216,127,51:153,51,51:102,127,51",
            "selected": false
        },
        {
            "flight_duration": 1.5,
            "shape": "STAR",
            "trail": true,
            "twinkle": false,
            "colors": "216,127,51:229,229,51",
            "fade_colors": "25,25,25:76,76,76:153,153,153:255,255,255",
            "selected": true
        },
        {
            "flight_duration": 1.5,
            "shape": "STAR",
            "trail": true,
            "twinkle": false,
            "colors": "76,127,153:76,76,76:25,25,25:255,255,255",
            "fade_colors": "229,229,51:25,25,25:76,76,76:255,255,255",
            "selected": false
        }
    ],
    "firstLogin": 1374006827000,
    "friendBlocksUuid": [
        "837bc698397b4fc186b0b5217161ab38",
        "0b0c7ea8243f4a55bf6614000b69e3bb",
        "85cd628cb44c428fac30093202576e69"
    ],
    "friendRequests": [],
    "gadget": "TRAMPOLINE",
    "guildNotifications": false,
    "karma": 15379120,
    "lastLogin": 1697237575659,
    "legacyGolem": true,
    "mostRecentMinecraftVersion": 5,
    "mostRecentlyThanked": "liav1liav",
    "mostRecentlyThankedUuid": "7b36bd2f39ab4c23a0f6101e5e51c490",
    "mostRecentlyTipped": "liav1liav",
    "mostRecentlyTippedUuid": "ec09e6a4ccd9433ab34db794ab44d30b",
    "networkExp": 22232897,
    "notifications": true,
    "packageRank": "MVP_PLUS",
    "parkourCompletions": {
        "BlitzLobby": [
            {
                "timeStart": 1430186594712,
                "timeTook": 21450
            }
        ],
        "MainLobby": [
            {
                "timeStart": 1421562805447,
                "timeTook": 144560
            }
        ],
        "TNT": [
            {
                "timeStart": 1476739411363,
                "timeTook": 13254
            }
        ],
        "TheWallsLobby": [
            {
                "timeStart": 1429426175025,
                "timeTook": 80864
            }
        ],
        "main": [
            {
                "timeStart": 1406502388417,
                "timeTook": 83957
            }
        ],
        "overhaul": [
            {
                "timeStart": 1418085744829,
                "timeTook": 123131
            }
        ],
        "vampirez": [
            {
                "timeStart": 1422582621619,
                "timeTook": 173553
            }
        ],
        "Arena": [
            {
                "timeStart": 1429408172875,
                "timeTook": 144108
            }
        ],
        "uhc": [
            {
                "timeStart": 1429424480513,
                "timeTook": 561890
            }
        ],
        "CopsnCrims": [
            {
                "timeStart": 1429425625701,
                "timeTook": 37853
            }
        ],
        "Skywars": [
            {
                "timeStart": 1434481970605,
                "timeTook": 3006
            }
        ],
        "NewMainLobby": [
            {
                "timeStart": 1500700336615,
                "timeTook": 47762
            }
        ],
        "QuakeCraft": [
            {
                "timeStart": 1443570761431,
                "timeTook": 78961
            }
        ],
        "MegaWalls": [
            {
                "timeStart": 1519534264824,
                "timeTook": 83729
            }
        ],
        "ArcadeGames": [
            {
                "timeStart": 1443571202168,
                "timeTook": 229146
            }
        ],
        "Paintball": [
            {
                "timeStart": 1443571505676,
                "timeTook": 84888
            }
        ],
        "Warlords": [
            {
                "timeStart": 1443571755333,
                "timeTook": 64610
            }
        ],
        "Turbo": [
            {
                "timeStart": 1443572623507,
                "timeTook": 256911
            }
        ],
        "SpeedUHC": [
            {
                "timeStart": 1466741781024,
                "timeTook": 15098
            }
        ],
        "TruePVPParkour": [
            {
                "timeStart": 1480811813365,
                "timeTook": 51505
            }
        ],
        "Prototype": [
            {
                "timeStart": 1486286143028,
                "timeTook": 28650
            }
        ],
        "Bedwars": [
            {
                "timeStart": 1502946222223,
                "timeTook": 51663
            }
        ],
        "SkywarsAug2017": [
            {
                "timeStart": 1504599914548,
                "timeTook": 52157
            }
        ],
        "MurderMystery": [
            {
                "timeStart": 1512199079381,
                "timeTook": 112515
            }
        ],
        "SkywarsChristmas2017": [
            {
                "timeStart": 1513187451357,
                "timeTook": 42657
            }
        ],
        "BuildBattle": [
            {
                "timeStart": 1513404788192,
                "timeTook": 58510
            }
        ],
        "Duels": [
            {
                "timeStart": 1520029289723,
                "timeTook": 66528
            }
        ],
        "mainLobby2022": [
            {
                "timeStart": 1650303713629,
                "timeTook": 84218
            }
        ]
    },
    "playername": "bugfroggy",
    "quests": {
        "blitzerk": {
            "active": {
                "started": 1461439774386,
                "objectives": {
                    "killblitz10": 9
                }
            }
        },
        "explosive_games": {
            "active": {
                "started": 1461439784886,
                "objectives": {
                    "tntrun": 1
                }
            }
        },
        "gladiator": {
            "active": {
                "objectives": {
                    "4v4": 1
                },
                "started": 1417553772265
            }
        },
        "halloween2014": {},
        "megawaller": {
            "completions": [
                {
                    "time": 1454104760287
                }
            ],
            "active": {
                "started": 1461439787689,
                "objectives": {}
            }
        },
        "nugget_warriors": {
            "active": {
                "started": 1461439780236,
                "objectives": {}
            }
        },
        "paintball_expert": {
            "active": {
                "started": 1461439796742,
                "objectives": {
                    "kill": 422,
                    "play": 17
                }
            }
        },
        "serial_killer": {
            "active": {
                "objectives": {
                    "blitz": 35,
                    "megawalls": 52,
                    "paintball": 31,
                    "quake": 85,
                    "tnt": 16
                },
                "started": 1417553769264
            }
        },
        "space_mission": {
            "active": {
                "started": 1461439793442,
                "objectives": {}
            }
        },
        "tnt_addict": {
            "active": {
                "started": 1432688955093,
                "objectives": {
                    "win": 1
                }
            }
        },
        "waller": {
            "active": {
                "started": 1432688937764,
                "objectives": {
                    "win": 1
                }
            }
        },
        "warlords_ctf": {
            "active": {
                "started": 1483477875285,
                "objectives": {}
            }
        },
        "warlords_dedication": {
            "active": {
                "objectives": {
                    "warlords_weekly_dedi": 23
                },
                "started": 1425664026681
            }
        },
        "warlords_domination": {
            "active": {
                "started": 1483477875280,
                "objectives": {}
            }
        },
        "warlords_win": {
            "active": {
                "started": 1483477875280,
                "objectives": {}
            }
        },
        "warriors_journey": {
            "active": {
                "started": 1461439771336,
                "objectives": {
                    "blitzkill": 5
                }
            }
        },
        "welcome_to_hell": {
            "active": {
                "objectives": {
                    "blitz": 15,
                    "megawalls": 8
                },
                "started": 1417553784516
            }
        },
        "gingerbread_mastery": {
            "active": {
                "started": 1432252679385,
                "objectives": {
                    "gingerbread_races_completed": 20
                }
            }
        },
        "gingerbread_racer": {
            "active": {
                "started": 1483478987814,
                "objectives": {}
            }
        },
        "gingerbread_maps": {
            "active": {
                "started": 1433979658067,
                "objectives": {
                    "gingerbread_map_raceway": true,
                    "gingerbread_map_retro": true
                }
            }
        },
        "gingerbread_bling_bling": {
            "active": {
                "started": 1483478987814,
                "objectives": {}
            }
        },
        "uhc_weekly": {
            "completions": [
                {
                    "time": 1470786243016
                }
            ],
            "active": {
                "started": 1471050356521,
                "objectives": {
                    "uhc_kills": 3
                }
            }
        },
        "uhc_daily": {
            "completions": [
                {
                    "time": 1460868738883
                },
                {
                    "time": 1461466795169
                }
            ],
            "active": {
                "started": 1466741431304,
                "objectives": {
                    "uhc_games": 1
                }
            }
        },
        "skywars_solo_win": {
            "completions": [
                {
                    "time": 1454097625353
                },
                {
                    "time": 1471916520452
                },
                {
                    "time": 1490555407389
                },
                {
                    "time": 1519250072776
                }
            ],
            "active": {
                "started": 1519451123515,
                "objectives": {}
            }
        },
        "skywars_solo_kills": {
            "completions": [
                {
                    "time": 1454097625354
                },
                {
                    "time": 1471916520440
                },
                {
                    "time": 1512279605329
                }
            ],
            "active": {
                "started": 1512367337751,
                "objectives": {
                    "skywars_solo_kills": 6
                }
            }
        },
        "skywars_team_win": {
            "completions": [
                {
                    "time": 1460788168584
                },
                {
                    "time": 1500759249100
                }
            ],
            "active": {
                "started": 1500869897802,
                "objectives": {}
            }
        },
        "skywars_team_kills": {
            "completions": [
                {
                    "time": 1461467523961
                }
            ],
            "active": {
                "started": 1465611224870,
                "objectives": {
                    "skywars_team_kills": 3
                }
            }
        },
        "skywars_weekly_kills": {
            "completions": [
                {
                    "time": 1504599545695
                }
            ],
            "active": {
                "started": 1504847481645,
                "objectives": {
                    "skywars_weekly_kills": 18
                }
            }
        },
        "blitz_weekly_master": {
            "active": {
                "started": 1437938657966,
                "objectives": {
                    "blitz_games_played": 60,
                    "killblitz10": 50,
                    "winblitz": 4
                }
            }
        },
        "blitz_kills": {
            "completions": [
                {
                    "time": 1454112337406
                },
                {
                    "time": 1458703405958
                },
                {
                    "time": 1514076636782
                }
            ],
            "active": {
                "started": 1514092016411,
                "objectives": {}
            }
        },
        "blitz_win": {
            "completions": [
                {
                    "time": 1458703479317
                }
            ],
            "active": {
                "started": 1459393567189,
                "objectives": {}
            }
        },
        "blitz_game_of_the_day": {
            "completions": [
                {
                    "time": 1458693660721
                },
                {
                    "time": 1471058906117
                },
                {
                    "time": 1488000684008
                },
                {
                    "time": 1496609440620
                },
                {
                    "time": 1500232456783
                },
                {
                    "time": 1501693586348
                },
                {
                    "time": 1504207302937
                },
                {
                    "time": 1504398670744
                },
                {
                    "time": 1506565026782
                },
                {
                    "time": 1507258020681
                },
                {
                    "time": 1510187506168
                },
                {
                    "time": 1514076768109
                },
                {
                    "time": 1514111050835
                }
            ],
            "active": {
                "started": 1516659277990,
                "objectives": {}
            }
        },
        "mega_walls_weekly": {
            "completions": [
                {
                    "time": 1529111813200
                }
            ],
            "active": {
                "started": 1529950307471,
                "objectives": {
                    "mega_walls_kill_weekly": 3,
                    "mega_walls_play_weekly": 2
                }
            }
        },
        "mega_walls_kill": {
            "completions": [
                {
                    "time": 1528267335287
                },
                {
                    "time": 1529114329837
                },
                {
                    "time": 1529299492022
                }
            ],
            "active": {
                "started": 1529950307471,
                "objectives": {
                    "mega_walls_kill_daily": 3
                }
            }
        },
        "mega_walls_win": {
            "completions": [
                {
                    "time": 1528264159829
                },
                {
                    "time": 1528527431032
                },
                {
                    "time": 1529302813527
                }
            ],
            "active": {
                "started": 1529950307471,
                "objectives": {}
            }
        },
        "mega_walls_play": {
            "completions": [
                {
                    "time": 1456277595243
                },
                {
                    "time": 1458764226274
                },
                {
                    "time": 1470936186173
                },
                {
                    "time": 1504496898577
                },
                {
                    "time": 1528262935067
                },
                {
                    "time": 1528518331488
                },
                {
                    "time": 1528691351706
                },
                {
                    "time": 1528863795766
                },
                {
                    "time": 1529018931465
                },
                {
                    "time": 1529044302918
                },
                {
                    "time": 1529275933315
                },
                {
                    "time": 1529300639116
                },
                {
                    "time": 1529996173556
                },
                {
                    "time": 1530397418183
                }
            ],
            "active": {
                "started": 1530908770071,
                "objectives": {}
            }
        },
        "quake_weekly_play": {
            "active": {
                "started": 1443816404953,
                "objectives": {
                    "quake_weekly_play": 5,
                    "quake_weekly_streak": 3
                }
            }
        },
        "quake_daily_kill": {
            "completions": [
                {
                    "time": 1486231673392
                }
            ],
            "active": {
                "started": 1493226715285,
                "objectives": {}
            }
        },
        "quake_daily_play": {
            "completions": [
                {
                    "time": 1454111318142
                }
            ],
            "active": {
                "started": 1465846856382,
                "objectives": {}
            }
        },
        "crazy_walls_weekly": {
            "active": {
                "started": 1447085901233,
                "objectives": {
                    "crazy_walls_weekly_play": 16,
                    "crazy_walls_weekly_kill": 22
                }
            }
        },
        "crazy_walls_daily_win": {
            "active": {
                "started": 1480811764459,
                "objectives": {}
            }
        },
        "crazy_walls_daily_kill": {
            "active": {
                "started": 1480811764459,
                "objectives": {}
            }
        },
        "crazy_walls_daily_play": {
            "active": {
                "started": 1461439795092,
                "objectives": {}
            }
        },
        "tnt_daily_play": {
            "completions": [
                {
                    "time": 1462224951355
                }
            ],
            "active": {
                "started": 1469639433007,
                "objectives": {
                    "tnt_daily_play": 2
                }
            }
        },
        "tnt_daily_win": {
            "active": {
                "started": 1451793548306,
                "objectives": {}
            }
        },
        "tnt_weekly_play": {
            "active": {
                "started": 1451793549157,
                "objectives": {
                    "tnt_weekly_play": 5
                }
            }
        },
        "supersmash_solo_win": {
            "completions": [
                {
                    "time": 1453522400264
                },
                {
                    "time": 1453868990485
                },
                {
                    "time": 1454467411222
                }
            ],
            "active": {
                "started": 1467401665121,
                "objectives": {}
            }
        },
        "supersmash_solo_kills": {
            "completions": [
                {
                    "time": 1453525633313
                },
                {
                    "time": 1454466924489
                }
            ],
            "active": {
                "started": 1467401665121,
                "objectives": {}
            }
        },
        "supersmash_team_win": {
            "active": {
                "started": 1453868706343,
                "objectives": {}
            }
        },
        "supersmash_team_kills": {
            "active": {
                "started": 1453868707068,
                "objectives": {
                    "supersmash_team_kills": 6
                }
            }
        },
        "supersmash_weekly_kills": {
            "completions": [
                {
                    "time": 1453868389414
                }
            ],
            "active": {
                "started": 1467401665121,
                "objectives": {
                    "supersmash_weekly_kills": 6
                }
            }
        },
        "cvc_win_daily_normal": {
            "active": {
                "started": 1454628128699,
                "objectives": {}
            }
        },
        "cvc_kill_daily_normal": {
            "active": {
                "started": 1454628129649,
                "objectives": {}
            }
        },
        "cvc_kill": {
            "completions": [
                {
                    "time": 1507612594778
                }
            ],
            "active": {
                "started": 1512192811838,
                "objectives": {}
            }
        },
        "cvc_win_daily_deathmatch": {
            "completions": [
                {
                    "time": 1507612619626
                }
            ],
            "active": {
                "started": 1512192811838,
                "objectives": {}
            }
        },
        "cvc_kill_weekly": {
            "active": {
                "started": 1454628133387,
                "objectives": {
                    "cvc_play_weekly_2": 310
                }
            }
        },
        "walls_daily_kill": {
            "active": {
                "started": 1458781181765,
                "objectives": {}
            }
        },
        "walls_daily_win": {
            "active": {
                "started": 1458781183015,
                "objectives": {}
            }
        },
        "walls_weekly": {
            "active": {
                "started": 1458781183868,
                "objectives": {}
            }
        },
        "walls_daily_play": {
            "active": {
                "started": 1458781184668,
                "objectives": {}
            }
        },
        "uhc_addict": {
            "completions": [
                {
                    "time": 1466741082432
                },
                {
                    "time": 1466741196440
                }
            ],
            "active": {
                "started": 1469853756606,
                "objectives": {}
            }
        },
        "normal_brawler": {
            "completions": [
                {
                    "time": 1466740542570
                }
            ],
            "active": {
                "started": 1466740846240,
                "objectives": {}
            }
        },
        "uhc_madness": {
            "active": {
                "started": 1466739984806,
                "objectives": {
                    "kill": 3
                }
            }
        },
        "insane_brawler": {
            "active": {
                "started": 1466739984806,
                "objectives": {}
            }
        },
        "hunting_season": {
            "active": {
                "started": 1466739984806,
                "objectives": {
                    "kill": 3
                }
            }
        },
        "arcade_gamer": {
            "completions": [
                {
                    "time": 1467938451371
                },
                {
                    "time": 1470203600985
                },
                {
                    "time": 1470940568493
                },
                {
                    "time": 1512200378488
                },
                {
                    "time": 1512284360414
                },
                {
                    "time": 1650306741359
                }
            ],
            "active": {
                "objectives": {},
                "started": 1682989404791
            }
        },
        "arcade_winner": {
            "completions": [
                {
                    "time": 1470202971235
                },
                {
                    "time": 1504254160964
                },
                {
                    "time": 1512261041693
                },
                {
                    "time": 1512277410109
                },
                {
                    "time": 1512372580069
                }
            ],
            "active": {
                "started": 1512506344317,
                "objectives": {}
            }
        },
        "arcade_specialist": {
            "completions": [
                {
                    "time": 1470209499294
                },
                {
                    "time": 1512284547844
                }
            ],
            "active": {
                "started": 1513989246723,
                "objectives": {
                    "play": 1
                }
            }
        },
        "vampirez_weekly_kill": {
            "active": {
                "started": 1469596533024,
                "objectives": {}
            }
        },
        "vampirez_daily_play": {
            "completions": [
                {
                    "time": 1470955951407
                },
                {
                    "time": 1471058172420
                }
            ],
            "active": {
                "started": 1480811529892,
                "objectives": {}
            }
        },
        "vampirez_weekly_win": {
            "active": {
                "started": 1469596533024,
                "objectives": {}
            }
        },
        "vampirez_daily_win": {
            "active": {
                "started": 1469596533024,
                "objectives": {}
            }
        },
        "vampirez_daily_kill": {
            "active": {
                "started": 1469596533024,
                "objectives": {}
            }
        },
        "uhc_solo": {
            "completions": [
                {
                    "time": 1503792513429
                },
                {
                    "time": 1506206770841
                }
            ],
            "active": {
                "started": 1506326920914,
                "objectives": {
                    "uhc_games": 1
                }
            }
        },
        "uhc_team": {
            "completions": [
                {
                    "time": 1506134897824
                }
            ],
            "active": {
                "started": 1506148278423,
                "objectives": {
                    "uhc_games": 1
                }
            }
        },
        "uhc_dm": {
            "active": {
                "started": 1475795987957,
                "objectives": {}
            }
        },
        "paintball_killer": {
            "completions": [
                {
                    "time": 1476601760630
                },
                {
                    "time": 1477807288971
                }
            ],
            "active": {
                "started": 1480811507121,
                "objectives": {
                    "kill": 55
                }
            }
        },
        "paintballer": {
            "completions": [
                {
                    "time": 1476600647286
                },
                {
                    "time": 1477806452054
                },
                {
                    "time": 1507055240611
                }
            ],
            "active": {
                "started": 1507258302562,
                "objectives": {}
            }
        },
        "skyclash_kills": {
            "completions": [
                {
                    "time": 1476609776429
                },
                {
                    "time": 1477723045213
                },
                {
                    "time": 1477812246100
                }
            ],
            "active": {
                "started": 1478547232139,
                "objectives": {
                    "kill": 1
                }
            }
        },
        "skyclash_play_points": {
            "completions": [
                {
                    "time": 1476608509580
                },
                {
                    "time": 1477721183467
                },
                {
                    "time": 1477811584609
                }
            ],
            "active": {
                "started": 1478547232139,
                "objectives": {
                    "skyclash_play_points": 1
                }
            }
        },
        "skyclash_void": {
            "completions": [
                {
                    "time": 1476610338798
                },
                {
                    "time": 1477721591021
                }
            ],
            "active": {
                "started": 1477804949454,
                "objectives": {
                    "skyclash_enderchests": 3,
                    "skyclash_void_kills": 2
                }
            }
        },
        "skyclash_play_games": {
            "completions": [
                {
                    "time": 1476605523565
                },
                {
                    "time": 1476741056727
                },
                {
                    "time": 1477720621324
                },
                {
                    "time": 1477809390116
                }
            ],
            "active": {
                "started": 1478547232139,
                "objectives": {
                    "play": 1
                }
            }
        },
        "skyclash_weekly_kills": {
            "active": {
                "started": 1476603608354,
                "objectives": {
                    "kill": 65
                }
            }
        },
        "arena_weekly_play": {
            "active": {
                "started": 1480811742401,
                "objectives": {
                    "arena_weekly_play": 1
                }
            }
        },
        "arena_daily_wins": {
            "active": {
                "started": 1480811742401,
                "objectives": {}
            }
        },
        "arena_daily_play": {
            "active": {
                "started": 1480811742401,
                "objectives": {
                    "arena_daily_play": 1
                }
            }
        },
        "arena_daily_kills": {
            "active": {
                "started": 1480811742401,
                "objectives": {}
            }
        },
        "warlords_tdm": {
            "active": {
                "started": 1483477875280,
                "objectives": {}
            }
        },
        "tnt_wizards_daily": {
            "active": {
                "started": 1489971687749,
                "objectives": {}
            }
        },
        "tnt_tnttag_daily": {
            "active": {
                "started": 1489971687749,
                "objectives": {}
            }
        },
        "tnt_wizards_weekly": {
            "active": {
                "started": 1489971687749,
                "objectives": {}
            }
        },
        "tnt_bowspleef_daily": {
            "active": {
                "started": 1489971687749,
                "objectives": {
                    "tnt_bowspleef_daily": 13
                }
            }
        },
        "tnt_tnttag_weekly": {
            "active": {
                "started": 1489971687749,
                "objectives": {}
            }
        },
        "tnt_tntrun_weekly": {
            "completions": [
                {
                    "time": 1565830737540
                }
            ],
            "active": {
                "objectives": {},
                "started": 1566276398030
            }
        },
        "tnt_pvprun_daily": {
            "active": {
                "started": 1489971687750,
                "objectives": {}
            }
        },
        "tnt_pvprun_weekly": {
            "active": {
                "started": 1489971687750,
                "objectives": {}
            }
        },
        "tnt_bowspleef_weekly": {
            "active": {
                "started": 1489971687750,
                "objectives": {
                    "tnt_bowspleef_weekly": 13
                }
            }
        },
        "tnt_tntrun_daily": {
            "completions": [
                {
                    "time": 1510187702739
                },
                {
                    "time": 1565830597302
                }
            ],
            "active": {
                "objectives": {},
                "started": 1566276398030
            }
        },
        "quake_daily_win": {
            "active": {
                "started": 1493226715285,
                "objectives": {}
            }
        },
        "bedwars_daily_one_more": {
            "completions": [
                {
                    "time": 1499907078527
                },
                {
                    "time": 1499928022061
                },
                {
                    "time": 1500271153874
                },
                {
                    "time": 1500424138760
                },
                {
                    "time": 1500444737542
                },
                {
                    "time": 1500677323824
                },
                {
                    "time": 1500703861544
                },
                {
                    "time": 1500851067748
                },
                {
                    "time": 1500930494498
                },
                {
                    "time": 1501137898453
                },
                {
                    "time": 1501815077769
                },
                {
                    "time": 1501830260438
                },
                {
                    "time": 1501908877399
                },
                {
                    "time": 1501999568638
                },
                {
                    "time": 1502258052185
                },
                {
                    "time": 1502346544065
                },
                {
                    "time": 1502518752611
                },
                {
                    "time": 1502606971728
                },
                {
                    "time": 1502690636521
                },
                {
                    "time": 1502954932375
                },
                {
                    "time": 1503036105605
                },
                {
                    "time": 1503380132855
                },
                {
                    "time": 1503552239227
                },
                {
                    "time": 1504072828299
                },
                {
                    "time": 1504215258438
                },
                {
                    "time": 1504246876774
                },
                {
                    "time": 1504405398949
                },
                {
                    "time": 1504417575820
                },
                {
                    "time": 1504503634930
                },
                {
                    "time": 1504590505454
                },
                {
                    "time": 1504849749296
                },
                {
                    "time": 1505023303116
                },
                {
                    "time": 1505362392476
                },
                {
                    "time": 1505861056731
                },
                {
                    "time": 1505978783949
                },
                {
                    "time": 1506405045381
                },
                {
                    "time": 1506647566570
                },
                {
                    "time": 1506836880070
                },
                {
                    "time": 1507086898027
                },
                {
                    "time": 1507162417738
                },
                {
                    "time": 1507184567324
                },
                {
                    "time": 1507270147657
                },
                {
                    "time": 1507443121027
                },
                {
                    "time": 1507618249427
                },
                {
                    "time": 1507965417287
                },
                {
                    "time": 1508048474031
                },
                {
                    "time": 1508182646036
                },
                {
                    "time": 1508259190102
                },
                {
                    "time": 1508374835165
                },
                {
                    "time": 1508457559388
                },
                {
                    "time": 1508478643473
                },
                {
                    "time": 1508561504994
                },
                {
                    "time": 1508652368465
                },
                {
                    "time": 1508829136166
                },
                {
                    "time": 1508978407584
                },
                {
                    "time": 1509082857342
                },
                {
                    "time": 1509172708862
                },
                {
                    "time": 1509253193021
                },
                {
                    "time": 1509421728416
                },
                {
                    "time": 1509424446158
                },
                {
                    "time": 1509590183710
                },
                {
                    "time": 1509663160041
                },
                {
                    "time": 1509775424932
                },
                {
                    "time": 1509856896512
                },
                {
                    "time": 1510123736447
                },
                {
                    "time": 1510296446976
                },
                {
                    "time": 1510471869533
                },
                {
                    "time": 1510813399477
                },
                {
                    "time": 1510951667100
                },
                {
                    "time": 1510988897145
                },
                {
                    "time": 1511678907272
                },
                {
                    "time": 1511851466071
                },
                {
                    "time": 1512025041631
                },
                {
                    "time": 1512203231688
                },
                {
                    "time": 1512543257156
                },
                {
                    "time": 1512708908963
                },
                {
                    "time": 1512711892053
                },
                {
                    "time": 1512868189846
                },
                {
                    "time": 1513233567365
                },
                {
                    "time": 1513410971911
                },
                {
                    "time": 1513577574042
                },
                {
                    "time": 1513757994150
                },
                {
                    "time": 1513927238159
                },
                {
                    "time": 1514102220854
                },
                {
                    "time": 1514617709523
                },
                {
                    "time": 1514963220289
                },
                {
                    "time": 1515135600840
                },
                {
                    "time": 1515310015839
                },
                {
                    "time": 1515482382836
                },
                {
                    "time": 1515653808107
                },
                {
                    "time": 1515913895399
                },
                {
                    "time": 1516084825309
                },
                {
                    "time": 1516257539333
                },
                {
                    "time": 1516520261220
                },
                {
                    "time": 1516862545836
                },
                {
                    "time": 1517037892867
                },
                {
                    "time": 1517472380280
                },
                {
                    "time": 1517642375148
                },
                {
                    "time": 1518248287343
                },
                {
                    "time": 1519196826292
                },
                {
                    "time": 1519545764523
                },
                {
                    "time": 1519715920544
                },
                {
                    "time": 1519888441497
                },
                {
                    "time": 1625155360215
                }
            ],
            "active": {
                "objectives": {},
                "started": 1627171927305
            }
        },
        "bedwars_daily_win": {
            "completions": [
                {
                    "time": 1499926003947
                },
                {
                    "time": 1500268022828
                },
                {
                    "time": 1500443506340
                },
                {
                    "time": 1500701789174
                },
                {
                    "time": 1500930494499
                },
                {
                    "time": 1501136282629
                },
                {
                    "time": 1501810511611
                },
                {
                    "time": 1501829377553
                },
                {
                    "time": 1501906696417
                },
                {
                    "time": 1501997522971
                },
                {
                    "time": 1502250825225
                },
                {
                    "time": 1502258052185
                },
                {
                    "time": 1502345518470
                },
                {
                    "time": 1502517509070
                },
                {
                    "time": 1502605971153
                },
                {
                    "time": 1502689782594
                },
                {
                    "time": 1502913477991
                },
                {
                    "time": 1502955688256
                },
                {
                    "time": 1503036105591
                },
                {
                    "time": 1503378627165
                },
                {
                    "time": 1503551359312
                },
                {
                    "time": 1504071993169
                },
                {
                    "time": 1504215258439
                },
                {
                    "time": 1504246032771
                },
                {
                    "time": 1504404032326
                },
                {
                    "time": 1504415653896
                },
                {
                    "time": 1504503055983
                },
                {
                    "time": 1504589732555
                },
                {
                    "time": 1504849749297
                },
                {
                    "time": 1505022605130
                },
                {
                    "time": 1505362392482
                },
                {
                    "time": 1505861056731
                },
                {
                    "time": 1505973242523
                },
                {
                    "time": 1506404190303
                },
                {
                    "time": 1506646471636
                },
                {
                    "time": 1506835737941
                },
                {
                    "time": 1507086244452
                },
                {
                    "time": 1507183905678
                },
                {
                    "time": 1507269122364
                },
                {
                    "time": 1507442381058
                },
                {
                    "time": 1507614546108
                },
                {
                    "time": 1507964009814
                },
                {
                    "time": 1508046695300
                },
                {
                    "time": 1508181606804
                },
                {
                    "time": 1508258390466
                },
                {
                    "time": 1508373787922
                },
                {
                    "time": 1508456707469
                },
                {
                    "time": 1508478643473
                },
                {
                    "time": 1508560965500
                },
                {
                    "time": 1508649752634
                },
                {
                    "time": 1508827918140
                },
                {
                    "time": 1508978407583
                },
                {
                    "time": 1509081920810
                },
                {
                    "time": 1509171754797
                },
                {
                    "time": 1509253193021
                },
                {
                    "time": 1509421263513
                },
                {
                    "time": 1509423581434
                },
                {
                    "time": 1509589149072
                },
                {
                    "time": 1509660265503
                },
                {
                    "time": 1509775424933
                },
                {
                    "time": 1509855498264
                },
                {
                    "time": 1510122761375
                },
                {
                    "time": 1510295661236
                },
                {
                    "time": 1510471039899
                },
                {
                    "time": 1510812675830
                },
                {
                    "time": 1510951129995
                },
                {
                    "time": 1510988054372
                },
                {
                    "time": 1511677523976
                },
                {
                    "time": 1511850658265
                },
                {
                    "time": 1512023859199
                },
                {
                    "time": 1512203231687
                },
                {
                    "time": 1512542263176
                },
                {
                    "time": 1512707901755
                },
                {
                    "time": 1512710652646
                },
                {
                    "time": 1512867082779
                },
                {
                    "time": 1513232654490
                },
                {
                    "time": 1513410080198
                },
                {
                    "time": 1513577038541
                },
                {
                    "time": 1513756963625
                },
                {
                    "time": 1513925518384
                },
                {
                    "time": 1514101207301
                },
                {
                    "time": 1514357830977
                },
                {
                    "time": 1514617709523
                },
                {
                    "time": 1514961907533
                },
                {
                    "time": 1515134816478
                },
                {
                    "time": 1515309291479
                },
                {
                    "time": 1515480928028
                },
                {
                    "time": 1515653808108
                },
                {
                    "time": 1515912894094
                },
                {
                    "time": 1516083810737
                },
                {
                    "time": 1516256692726
                },
                {
                    "time": 1516519742951
                },
                {
                    "time": 1516862545848
                },
                {
                    "time": 1517037132908
                },
                {
                    "time": 1517471585157
                },
                {
                    "time": 1517641470973
                },
                {
                    "time": 1518246986491
                },
                {
                    "time": 1519195355372
                },
                {
                    "time": 1519545038467
                },
                {
                    "time": 1519714606138
                },
                {
                    "time": 1519887823286
                }
            ],
            "active": {
                "started": 1520023369377,
                "objectives": {}
            }
        },
        "bedwars_weekly_bed_elims": {
            "completions": [
                {
                    "time": 1500283306999
                },
                {
                    "time": 1500930906166
                },
                {
                    "time": 1501818945062
                },
                {
                    "time": 1501916573453
                },
                {
                    "time": 1502913632479
                },
                {
                    "time": 1503433710245
                },
                {
                    "time": 1504222527709
                },
                {
                    "time": 1504419557652
                },
                {
                    "time": 1505363465502
                },
                {
                    "time": 1505863564731
                },
                {
                    "time": 1506650932786
                },
                {
                    "time": 1507087201794
                },
                {
                    "time": 1507446893036
                },
                {
                    "time": 1508030736842
                },
                {
                    "time": 1508658484488
                },
                {
                    "time": 1509251301712
                },
                {
                    "time": 1510297893039
                },
                {
                    "time": 1511853525478
                },
                {
                    "time": 1512709112556
                },
                {
                    "time": 1513410507721
                },
                {
                    "time": 1514109643896
                },
                {
                    "time": 1514971037335
                },
                {
                    "time": 1515484327737
                },
                {
                    "time": 1516089221822
                },
                {
                    "time": 1517039993007
                },
                {
                    "time": 1519203120429
                },
                {
                    "time": 1519891352320
                }
            ],
            "active": {
                "started": 1520023369377,
                "objectives": {
                    "bedwars_bed_elims": 3
                }
            }
        },
        "skywars_arcade_win": {
            "completions": [
                {
                    "time": 1501833585977
                },
                {
                    "time": 1502347811080
                },
                {
                    "time": 1504408305839
                },
                {
                    "time": 1504473391936
                },
                {
                    "time": 1504599404533
                },
                {
                    "time": 1516903255058
                }
            ],
            "active": {
                "started": 1517114433399,
                "objectives": {}
            }
        },
        "skywars_weekly_arcade_win_all": {
            "active": {
                "started": 1501373186964,
                "objectives": {
                    "skywars_weekly_lab_tnt_madness_win": 1,
                    "skywars_arcade_weekly_win": 8
                }
            }
        },
        "mm_daily_win": {
            "completions": [
                {
                    "time": 1505962623984
                },
                {
                    "time": 1505967458409
                },
                {
                    "time": 1507182613526
                },
                {
                    "time": 1507787879384
                },
                {
                    "time": 1512279763457
                },
                {
                    "time": 1512428110026
                },
                {
                    "time": 1512873661260
                },
                {
                    "time": 1512882493368
                },
                {
                    "time": 1513039632024
                },
                {
                    "time": 1513239442179
                },
                {
                    "time": 1513996472353
                },
                {
                    "time": 1514072897793
                },
                {
                    "time": 1514344292978
                },
                {
                    "time": 1514351053053
                },
                {
                    "time": 1514492448348
                },
                {
                    "time": 1514576707127
                },
                {
                    "time": 1515652692721
                },
                {
                    "time": 1517967395240
                }
            ],
            "active": {
                "started": 1518023928467,
                "objectives": {}
            }
        },
        "mm_daily_power_play": {
            "completions": [
                {
                    "time": 1505963257950
                },
                {
                    "time": 1505968554073
                },
                {
                    "time": 1507788181201
                },
                {
                    "time": 1512280144112
                },
                {
                    "time": 1512428563255
                },
                {
                    "time": 1512874466346
                },
                {
                    "time": 1512938658133
                },
                {
                    "time": 1513239442179
                },
                {
                    "time": 1513997100672
                },
                {
                    "time": 1514344292978
                },
                {
                    "time": 1514351393378
                }
            ],
            "active": {
                "started": 1514488195238,
                "objectives": {}
            }
        },
        "mm_weekly_murderer_kills": {
            "completions": [
                {
                    "time": 1505973459509
                },
                {
                    "time": 1512428537289
                },
                {
                    "time": 1512939025573
                },
                {
                    "time": 1514344206055
                }
            ],
            "active": {
                "started": 1514575591374,
                "objectives": {
                    "mm_weekly_kills_as_murderer": 9
                }
            }
        },
        "mm_weekly_wins": {
            "completions": [
                {
                    "time": 1505972399348
                },
                {
                    "time": 1507791576535
                },
                {
                    "time": 1512874038819
                },
                {
                    "time": 1513999934141
                }
            ],
            "active": {
                "started": 1514575591374,
                "objectives": {
                    "mm_weekly_win": 7
                }
            }
        },
        "mm_daily_target_kill": {
            "completions": [
                {
                    "time": 1505964675153
                },
                {
                    "time": 1507256602107
                }
            ],
            "active": {
                "started": 1507263491695,
                "objectives": {}
            }
        },
        "bedwars_weekly_pumpkinator": {
            "completions": [
                {
                    "time": 1508030748366
                },
                {
                    "time": 1508651836427
                },
                {
                    "time": 1509089122720
                }
            ],
            "active": {
                "started": 1509738791932,
                "objectives": {
                    "bedwars_special_weekly_pumpkinator": 62
                }
            }
        },
        "skywars_special_north_pole": {
            "completions": [
                {
                    "time": 1512279108032
                }
            ],
            "active": {
                "started": 1512367337751,
                "objectives": {}
            }
        },
        "bedwars_weekly_santa": {
            "completions": [
                {
                    "time": 1512203112126
                },
                {
                    "time": 1512713092972
                },
                {
                    "time": 1513410538093
                },
                {
                    "time": 1513931829365
                },
                {
                    "time": 1514618637430
                },
                {
                    "time": 1515133756130
                }
            ]
        },
        "blitz_special_daily_north_pole": {
            "completions": [
                {
                    "time": 1514110518174
                }
            ],
            "active": {
                "objectives": {},
                "started": 1608844154436
            }
        },
        "uhc_weekly_special_cookie": {
            "active": {
                "started": 1512191911575,
                "objectives": {}
            }
        },
        "mm_special_weekly_santa": {
            "completions": [
                {
                    "time": 1512875313986
                }
            ],
            "active": {
                "started": 1513366899930,
                "objectives": {
                    "mm_special_weekly_santa": 18
                }
            }
        },
        "build_battle_winner": {
            "completions": [
                {
                    "time": 1512262367517
                },
                {
                    "time": 1513467891417
                },
                {
                    "time": 1513752621937
                }
            ],
            "active": {
                "started": 1514071826271,
                "objectives": {}
            }
        },
        "build_battle_player": {
            "completions": [
                {
                    "time": 1513404610697
                },
                {
                    "time": 1513559041020
                },
                {
                    "time": 1513735920721
                },
                {
                    "time": 1513752632920
                }
            ],
            "active": {
                "started": 1514071826271,
                "objectives": {}
            }
        },
        "build_battle_weekly": {
            "completions": [
                {
                    "time": 1513736592017
                }
            ],
            "active": {
                "started": 1514071826271,
                "objectives": {}
            }
        },
        "skywars_weekly_free_loot_chest": {
            "completions": [
                {
                    "time": 1519250072776
                }
            ],
            "active": {
                "started": 1519451123515,
                "objectives": {}
            }
        },
        "skywars_weekly_hard_chest": {
            "active": {
                "started": 1516258353765,
                "objectives": {
                    "skywars_weekly_hard_loot_chest": 1
                }
            }
        },
        "skywars_daily_tokens": {
            "active": {
                "started": 1516258353765,
                "objectives": {
                    "skywars_daily_tokens_wins": 6
                }
            }
        },
        "duels_winner": {
            "completions": [
                {
                    "time": 1521004810319
                }
            ],
            "active": {
                "started": 1521164849528,
                "objectives": {}
            }
        },
        "duels_player": {
            "completions": [
                {
                    "time": 1521165089385
                }
            ],
            "active": {
                "started": 1521242306994,
                "objectives": {
                    "play": 4
                }
            }
        },
        "duels_weekly_wins": {
            "active": {
                "started": 1520023377082,
                "objectives": {
                    "win": 1
                }
            }
        },
        "duels_killer": {
            "active": {
                "started": 1520023377082,
                "objectives": {
                    "kill": 3
                }
            }
        },
        "duels_weekly_kills": {
            "active": {
                "started": 1520023377082,
                "objectives": {
                    "kill": 3
                }
            }
        },
        "prototype_pit_daily_contract": {
            "completions": [
                {
                    "time": 1521513996069
                },
                {
                    "time": 1528750801236
                },
                {
                    "time": 1528860665650
                }
            ],
            "active": {
                "started": 1528941930883,
                "objectives": {}
            }
        },
        "prototype_pit_weekly_gold": {
            "completions": [
                {
                    "time": 1528749652794
                }
            ],
            "active": {
                "started": 1530823811317,
                "objectives": {
                    "prototype_pit_weekly_gold": 261
                }
            }
        },
        "prototype_pit_daily_kills": {
            "completions": [
                {
                    "time": 1521513282460
                },
                {
                    "time": 1528749652744
                },
                {
                    "time": 1528859451655
                },
                {
                    "time": 1529015085030
                }
            ],
            "active": {
                "started": 1530823811317,
                "objectives": {
                    "kill": 7
                }
            }
        },
        "mega_walls_faithful": {
            "completions": [
                {
                    "time": 1528267486006
                },
                {
                    "time": 1528527431012
                },
                {
                    "time": 1529302813527
                }
            ],
            "active": {
                "started": 1529950307471,
                "objectives": {
                    "mega_walls_faithful_play": 2
                }
            }
        },
        "skywars_mega_doubles_wins": {
            "active": {
                "started": 1528235891159,
                "objectives": {}
            }
        },
        "bedwars_weekly_dream_win": {
            "active": {
                "started": 1528679600376,
                "objectives": {
                    "bedwars_dream_wins": 1
                }
            }
        },
        "bedwars_daily_nightmares": {
            "active": {
                "started": 1540428649447,
                "objectives": {}
            }
        },
        "skywars_halloween_harvest": {
            "active": {
                "started": 1540690398552,
                "objectives": {}
            }
        },
        "bedwars_daily_gifts": {
            "active": {
                "started": 1545355644251,
                "objectives": {}
            }
        },
        "skywars_corrupt_win": {
            "active": {
                "started": 1554661583366,
                "objectives": {}
            }
        },
        "blitz_loot_chest_weekly": {
            "active": {
                "started": 1557774822439,
                "objectives": {}
            }
        },
        "blitz_loot_chest_daily": {
            "active": {
                "started": 1557774822439,
                "objectives": {}
            }
        },
        "vampirez_weekly_human_kill": {
            "active": {
                "started": 1558843976190,
                "objectives": {}
            }
        },
        "vampirez_daily_human_kill": {
            "active": {
                "started": 1558843976190,
                "objectives": {}
            }
        },
        "solo_brawler": {
            "active": {
                "objectives": {},
                "started": 1566275479546
            }
        },
        "team_brawler": {
            "active": {
                "objectives": {},
                "started": 1566275479546
            }
        },
        "build_battle_christmas_weekly": {
            "active": {
                "objectives": {},
                "started": 1608844197488
            }
        },
        "build_battle_christmas": {
            "active": {
                "objectives": {},
                "started": 1608844197488
            }
        },
        "tnt_weekly_special": {
            "active": {
                "objectives": {},
                "started": 1608845693529
            }
        },
        "warlords_all_star": {
            "active": {
                "objectives": {},
                "started": 1608845863733
            }
        },
        "warlords_objectives": {
            "active": {
                "objectives": {},
                "started": 1608845863733
            }
        },
        "warlords_victorious": {
            "active": {
                "objectives": {},
                "started": 1608845863733
            }
        },
        "bedwars_weekly_challenges": {
            "active": {
                "objectives": {},
                "started": 1638740369116
            }
        },
        "mm_daily_infector": {
            "active": {
                "objectives": {},
                "started": 1668314835824
            }
        },
        "pit_daily_kills": {
            "active": {
                "objectives": {},
                "started": 1696443620051
            }
        },
        "pit_daily_contract": {
            "active": {
                "objectives": {},
                "started": 1696443620052
            }
        },
        "pit_weekly_gold": {
            "active": {
                "objectives": {},
                "started": 1696443620054
            }
        },
        "bedwars_daily_bed_breaker": {
            "active": {
                "objectives": {},
                "started": 1696686626246
            }
        },
        "bedwars_daily_final_killer": {
            "active": {
                "objectives": {},
                "started": 1696686626255
            }
        },
        "bedwars_weekly_challenges_win": {
            "active": {
                "objectives": {},
                "started": 1696686626264
            }
        },
        "bedwars_weekly_final_killer": {
            "active": {
                "objectives": {},
                "started": 1696686626266
            }
        },
        "wool_wars_daily_play": {
            "active": {
                "objectives": {},
                "started": 1696691637351
            }
        },
        "wool_wars_daily_wins": {
            "active": {
                "objectives": {},
                "started": 1696691637352
            }
        },
        "wool_wars_daily_kills": {
            "active": {
                "objectives": {},
                "started": 1696691637353
            }
        },
        "wool_weekly_play": {
            "active": {
                "objectives": {},
                "started": 1696691637355
            }
        },
        "wool_wars_weekly_shears": {
            "active": {
                "objectives": {},
                "started": 1696691637356
            }
        }
    },
    "rank": "NORMAL",
    "seeRequests": true,
    "spectators_invisible": false,
    "stats": {
        "Arcade": {
            "blood": true,
            "bounty_kills_oneinthequiver": 3,
            "coins": 87480,
            "deaths_oneinthequiver": 34,
            "deaths_throw_out": 29,
            "enderspleef_trail": "RAINBOW",
            "flash": true,
            "headshots_dayone": 490,
            "hints": false,
            "kills_dayone": 1202,
            "kills_dragonwars2": 16,
            "kills_oneinthequiver": 32,
            "kills_throw_out": 83,
            "max_wave": 27,
            "melee_weapon": "POLICE_BATON",
            "packages": [
                "katana_melee",
                "snowman_disguise",
                "rainbow_trail",
                "movement_trail_rainbow",
                "victory_dance_chicken_rider",
                "projectile_trail_blood",
                "police_baton_melee",
                "mob_trail"
            ],
            "poop_collected": 28,
            "stamp_level": 7,
            "throwout_disguise": "SNOWMAN",
            "time_stamp": 1529124709657,
            "wins_dayone": 1,
            "wins_ender": 1,
            "wins_farm_hunt": 10,
            "wins_oneinthequiver": 1,
            "wins_party": 17,
            "wins_throw_out": 17,
            "sw_kills": 11,
            "sw_shots_fired": 165,
            "sw_rebel_kills": 8,
            "sw_weekly_kills_a": 11,
            "sw_deaths": 17,
            "sw_monthly_kills_a": 8,
            "music": true,
            "hitw_record_q": 77,
            "hitw_record_f": 61,
            "rounds_hole_in_the_wall": 26,
            "rounds_santa_says": 61,
            "monthly_coins_b": 1479,
            "weekly_coins_a": 1224,
            "sw_empire_kills": 3,
            "sw_game_wins": 1,
            "sw_monthly_kills_b": 3,
            "rounds_simon_says": 400,
            "weekly_coins_b": 43371,
            "monthly_coins_a": 43116,
            "miniwalls_activeKit": "soldier",
            "arrows_hit_mini_walls": 13,
            "kills_mini_walls": 87,
            "wins_mini_walls": 12,
            "deaths_mini_walls": 122,
            "arrows_shot_mini_walls": 58,
            "wither_damage_mini_walls": 571,
            "final_kills_mini_walls": 29,
            "wither_kills_mini_walls": 7,
            "dec2016_achievements2": true,
            "dec2016_achievements": true,
            "wins_simon_says": 2,
            "wins_grinch_simulator_v2": 6,
            "gifts_grinch_simulator_v2": 345,
            "lastTourneyAd": 1608237727393,
            "eggs_found_easter_simulator": 26,
            "active_movement_trail": "movement_trail_rainbow",
            "active_victory_dance": "victory_dance_chicken_rider",
            "active_projectile_trail": "projectile_trail_blood",
            "bounty_head": "MOB",
            "pixel_party": {
                "games_played": 6,
                "games_played_normal": 6,
                "highest_round": 23,
                "power_ups_collected": 1,
                "power_ups_collected_normal": 1,
                "rounds_completed": 80,
                "rounds_completed_normal": 80,
                "wins": 1,
                "wins_normal": 1
            },
            "dropper": {
                "games_played": 1,
                "maps_completed": 2,
                "fails": 12
            }
        },
        "Arena": {
            "active_rune": "damage",
            "chest_opens": 5,
            "coins": 641209,
            "coins_spent": 3000,
            "damage_2v2": 468048,
            "damage_4v4": 12521,
            "damage_ffa": 4937,
            "deaths_2v2": 73,
            "deaths_ffa": 2,
            "games_2v2": 136,
            "games_4v4": 7,
            "games_ffa": 2,
            "hat": "try_hard",
            "healed_2v2": 225650,
            "healed_4v4": 7850,
            "healed_ffa": 1500,
            "keys": 0,
            "kills_2v2": 74,
            "kills_4v4": 3,
            "losses_2v2": 64,
            "losses_ffa": 2,
            "lvl_cooldown": 1,
            "lvl_damage": 1,
            "lvl_energy": 1,
            "lvl_health": 1,
            "magical_chest": 6,
            "offensive": "lightning_strike",
            "packages": [
                "compliment",
                "rune_damage",
                "orange_hoodie",
                "canada",
                "try_hard"
            ],
            "rating": 991.8911754358138,
            "support": "tree_of_life",
            "utility": "wall_of_vines",
            "win_streaks_2v2": 2,
            "win_streaks_4v4": 0,
            "win_streaks_ffa": 0,
            "wins_2v2": 72,
            "wins_4v4": 5,
            "deaths_4v4": 3,
            "losses_4v4": 2,
            "wins": 77
        },
        "Battleground": {
            "afk_warned": 6,
            "aquamancer_plays": 8,
            "assists": 455,
            "broken_inventory": 0,
            "chosen_class": "mage",
            "coins": 192656,
            "crafted": 1,
            "crafted_epic": 1,
            "cryomancer_plays": 44,
            "current_weapon": 1425866657378,
            "damage": 2809178,
            "damage_aquamancer": 148956,
            "damage_cryomancer": 1713796,
            "damage_mage": 2714171,
            "damage_prevented": 806405,
            "damage_prevented_aquamancer": 26799,
            "damage_prevented_cryomancer": 638124,
            "damage_prevented_mage": 802148,
            "damage_prevented_pyromancer": 137225,
            "damage_pyromancer": 929941,
            "damage_taken": 2491048,
            "deaths": 349,
            "flag_conquer_self": 3,
            "flag_conquer_team": 59,
            "heal": 367242,
            "heal_aquamancer": 260380,
            "heal_cryomancer": 94864,
            "heal_mage": 355244,
            "hints": false,
            "kills": 414,
            "losses": 18,
            "losses_aquamancer": 6,
            "losses_cryomancer": 10,
            "losses_mage": 18,
            "losses_pyromancer": 2,
            "mage_armor_selection": 2,
            "mage_cooldown": 6,
            "mage_critchance": 6,
            "mage_critmultiplier": 6,
            "mage_energy": 6,
            "mage_health": 7,
            "mage_plays": 83,
            "mage_skill1": 4,
            "mage_skill2": 4,
            "mage_skill3": 4,
            "mage_skill4": 4,
            "mage_skill5": 4,
            "mage_spec": "cryomancer",
            "magic_dust": 83,
            "newcontrol_disable": 1,
            "newcontrol_enable": 1,
            "packages": [
                "mage_spec_aquamancer",
                "mage_spec_cryomancer",
                "mount_corpse_mare",
                "legacyachievement2",
                "legacyachievement3",
                "legacyachievement8",
                "legacyachievement9",
                "legacyachievement10"
            ],
            "paladin_armor_selection": 2,
            "paladin_spec": "avenger",
            "penalty": 6,
            "pyromancer_plays": 32,
            "repaired": 237,
            "repaired_common": 171,
            "repaired_epic": 2,
            "repaired_rare": 64,
            "salvaged_dust_reward": 218,
            "salvaged_shards_reward": 4,
            "salvaged_weapons": 99,
            "salvaged_weapons_common": 68,
            "salvaged_weapons_rare": 30,
            "selected_mount": "corpse_mare",
            "void_shards": 8,
            "warrior_armor_selection": 2,
            "warrior_spec": "berserker",
            "weapon_inventory": [
                {
                    "spec": {
                        "spec": 1,
                        "playerClass": 0
                    },
                    "ability": 0,
                    "abilityBoost": 7,
                    "damage": 110,
                    "energy": 20,
                    "chance": 17,
                    "multiplier": 163,
                    "health": 191,
                    "cooldown": 4,
                    "movement": 0,
                    "material": "RAW_CHICKEN",
                    "id": 1425866657378,
                    "category": "EPIC",
                    "crafted": true,
                    "upgradeMax": 2,
                    "upgradeTimes": 1
                },
                {
                    "spec": {
                        "spec": 1,
                        "playerClass": 0
                    },
                    "ability": 1,
                    "abilityBoost": 4,
                    "damage": 93,
                    "energy": 11,
                    "chance": 19,
                    "multiplier": 151,
                    "health": 156,
                    "cooldown": 0,
                    "movement": 0,
                    "material": "DIAMOND_HOE",
                    "id": 1458693242819,
                    "category": "RARE",
                    "crafted": false,
                    "upgradeMax": 2,
                    "upgradeTimes": 0
                },
                {
                    "spec": {
                        "spec": 0,
                        "playerClass": 3
                    },
                    "ability": 2,
                    "abilityBoost": 4,
                    "damage": 96,
                    "energy": 6,
                    "chance": 15,
                    "multiplier": 172,
                    "health": 134,
                    "cooldown": 0,
                    "movement": 0,
                    "material": "POTATO",
                    "id": 1458693243962,
                    "category": "RARE",
                    "crafted": false,
                    "upgradeMax": 2,
                    "upgradeTimes": 0
                },
                {
                    "spec": {
                        "spec": 1,
                        "playerClass": 0
                    },
                    "ability": 1,
                    "abilityBoost": 5,
                    "damage": 93,
                    "energy": 9,
                    "chance": 12,
                    "multiplier": 154,
                    "health": 125,
                    "cooldown": 0,
                    "movement": 0,
                    "material": "COOKED_RABBIT",
                    "id": 1458693244468,
                    "category": "RARE",
                    "crafted": false,
                    "upgradeMax": 2,
                    "upgradeTimes": 0
                },
                {
                    "spec": {
                        "spec": 1,
                        "playerClass": 1
                    },
                    "ability": 2,
                    "abilityBoost": 2,
                    "damage": 90,
                    "energy": 0,
                    "chance": 7,
                    "multiplier": 142,
                    "health": 141,
                    "cooldown": 0,
                    "movement": 0,
                    "material": "STONE_AXE",
                    "id": 1458693243312,
                    "category": "COMMON",
                    "crafted": false,
                    "upgradeMax": 2,
                    "upgradeTimes": 0
                },
                {
                    "spec": {
                        "spec": 1,
                        "playerClass": 3
                    },
                    "ability": 0,
                    "abilityBoost": 3,
                    "damage": 82,
                    "energy": 0,
                    "chance": 12,
                    "multiplier": 170,
                    "health": 76,
                    "cooldown": 0,
                    "movement": 0,
                    "material": "GOLD_HOE",
                    "id": 1458693244812,
                    "category": "COMMON",
                    "crafted": false,
                    "upgradeMax": 2,
                    "upgradeTimes": 0
                }
            ],
            "win_streak": 1,
            "wins": 40,
            "wins_aquamancer": 2,
            "wins_blu": 26,
            "wins_capturetheflag": 27,
            "wins_capturetheflag_blu": 16,
            "wins_capturetheflag_red": 11,
            "wins_cryomancer": 19,
            "wins_domination": 13,
            "wins_domination_blu": 10,
            "wins_domination_red": 3,
            "wins_mage": 39,
            "wins_pyromancer": 18,
            "wins_red": 14,
            "mage_helmet_selection": 1,
            "upgrade_crafted_epic": 1,
            "upgrade_crafted": 1,
            "salvaged_weapons_epic": 1,
            "shaman_spec": "earthwarden",
            "play_streak": 3,
            "damage_prevented_earthwarden": 4257,
            "heal_shaman": 11998,
            "damage_earthwarden": 16485,
            "heal_earthwarden": 11998,
            "damage_shaman": 16485,
            "earthwarden_plays": 1,
            "wins_shaman": 1,
            "wins_earthwarden": 1,
            "shaman_plays": 1,
            "damage_prevented_shaman": 4257,
            "wins_capturetheflag_a": 1
        },
        "HungerGames": {
            "arachnologist": 4,
            "archer": 4,
            "armorer": 4,
            "astronaut": 4,
            "aura": "WATER_PARTICLE",
            "baker": 4,
            "blaze": 4,
            "blood": true,
            "chosen_taunt": "VILLAGER_MUSIC_BAND",
            "chosen_victorydance": "PLAYER_FIREWORK",
            "coins": 558426,
            "creepertamer": 4,
            "deaths": 3626,
            "fisherman": 4,
            "horsetamer": 6,
            "hunter": 5,
            "kills": 6018,
            "knight": 4,
            "meatmaster": 4,
            "necromancer": 4,
            "packages": [
                "apocalypse",
                "assassin",
                "imprison",
                "vaulthunter",
                "robinhood",
                "witherwarrior",
                "default_taunt",
                "package_taunt",
                "vampire",
                "jedi_knight",
                "gremlin",
                "roulette",
                "invoker",
                "ironman",
                "nuke",
                "ninja",
                "nocturne",
                "supplies",
                "shotgun",
                "koolmove",
                "regeneration",
                "fixachievements1",
                "fixachievements2",
                "fixachievements4",
                "fixachievements3",
                "fixachievements5",
                "new_stats_02_2019",
                "fixachievements7",
                "wobbuffet",
                "gladiator",
                "ragnarok",
                "pickpocket",
                "infection",
                "acid_rain",
                "time_warp",
                "lockdown",
                "zookeeper",
                "switcheroo"
            ],
            "pigman": 4,
            "reddragon": 4,
            "rogue": 4,
            "scout": 4,
            "slimeyslime": 4,
            "snowman": 5,
            "speleologist": 8,
            "tim": 5,
            "toxicologist": 4,
            "troll": 4,
            "wins": 376,
            "wolftamer": 6,
            "wins_teams": 2,
            "monthly_kills_b": 49,
            "weekly_kills_b": 30,
            "defaultkit": "Speleologist",
            "autoarmor": true,
            "kit_permutations_speleologist": "857612340",
            "votes_Mithril Revived": 1,
            "paladin": 4,
            "shadow knight": 5,
            "monthly_kills_a": 29,
            "weekly_kills_a": 47,
            "fancyMode": false,
            "afterkill": "regeneration",
            "hype train": 1,
            "jockey": 1,
            "votes_Pixelville": 1,
            "togglekillcounter": 1,
            "lastTourneyAd": 1552754107265,
            "wins_teams_normal": 2,
            "wins_solo_normal": 374,
            "wins_backup": 374
        },
        "MCGO": {
            "ak_47_cost_reduction": 3,
            "ak_47_damage_increase": 3,
            "ak_47_range_increase": 2,
            "ak_47_recoil_reduction": 3,
            "ak_47_reload_speed_reduction": 3,
            "body_armor_cost": 5,
            "bombs_defused": 8,
            "bombs_planted": 26,
            "coins": 150425,
            "cop_kills": 257,
            "criminal_kills": 260,
            "deaths": 83,
            "game_wins": 48,
            "games_wins_10_2014": 2,
            "games_wins_2_10_2014": 2,
            "headshot_kills": 242,
            "kills": 387,
            "killsNew": 9,
            "killsNew_11_2014": 9,
            "killsNew_2_11_2014": 9,
            "kills_10_2014": 18,
            "kills_11_2014": 9,
            "kills_2_11_2014": 9,
            "kills_3_10_2014": 18,
            "knife_attack_delay": 4,
            "knife_damage_increase": 4,
            "packages": [
                "bowie_plus",
                "tomahawk",
                "mvp_ocelot_helmet",
                "mvp_ocelot_armor",
                "rekt",
                "mvp_creeper_helmet",
                "mvp_creeper_armor",
                "taunt_mymother",
                "taunt_rekt",
                "taunt_allyougot",
                "taunt_tooeasy",
                "legacyachievementnew",
                "legacyachievementnewnewnew",
                "achievement_flag_3",
                "achievement_flag_7",
                "colt_m1911_old",
                "scar_h_plus_old",
                "sawed_off_old",
                "p90_old",
                "raging_bull_old",
                "ak_100_plus_old"
            ],
            "pistol_damage_increase": 2,
            "pistol_recoil_reduction": 1,
            "pistol_reload_speed_reduction": 1,
            "rifle_cost_reduction": 5,
            "rifle_damage_increase": 8,
            "rifle_recoil_reduction": 7,
            "rifle_reload_speed_reduction": 5,
            "round_wins": 270,
            "selectedCarbineDev": "SCAR_H_PLUS",
            "selectedCreeperChestplateDev": "MVP_CREEPER_ARMOR",
            "selectedCreeperHelmetDev": "MVP_CREEPER_HELMET",
            "selectedKnifeDev": "TOMAHAWK",
            "selectedMagnumDev": "RAGING_BULL",
            "selectedOcelotChestplateDev": "MVP_OCELOT_ARMOR",
            "selectedOcelotHelmetDev": "MVP_OCELOT_HELMET",
            "selectedPistolDev": "COLT_M1911",
            "selectedRifleDev": "AK_100_PLUS",
            "selectedShotgunDev": "SAWED_OFF",
            "selectedSmgDev": "P90",
            "shots_fired": 11030,
            "sniper_charge_bonus": 2,
            "sniper_cost_reduction": 2,
            "sniper_damage_increase": 1,
            "sniper_reload_speed_reduction": 2,
            "usp_damage_increase": 1,
            "mcgo": {
                "points": 0
            },
            "weekly_kills_b": 23,
            "monthly_kills_a": 23,
            "game_wins_sandstorm": 1,
            "kills_deathmatch": 19,
            "game_wins_deathmatch": 1,
            "deaths_deathmatch": 22,
            "cop_kills_deathmatch": 7,
            "criminal_kills_deathmatch": 12,
            "game_wins_temple": 1,
            "grenade_kills": 0,
            "grenadeKills": 0,
            "pocket_change": 0,
            "lastTourneyAd": 1614791885496
        },
        "Paintball": {
            "coins": 620421,
            "deaths": 1379,
            "endurance": 0,
            "fortune": 9,
            "hat": "vip_rezzus_hat",
            "kills": 2399,
            "killstreaks": 118,
            "packages": [
                "tripleshot",
                "plusten",
                "normal_hat",
                "vip_rezzus_hat",
                "drunk_hat",
                "nuke",
                "superstrongarm",
                "creeperhead",
                "tntrain",
                "vip_hypixel_hat",
                "shaky_hat",
                "quintupleshot",
                "sentry",
                "landmine",
                "flashbang",
                "achievement_flag_1",
                "achievement_flag_2"
            ],
            "shots_fired": 44203,
            "superluck": 9,
            "transfusion": 3,
            "wins": 55,
            "weekly_kills_a": 367,
            "monthly_kills_a": 367
        },
        "Quake": {
            "armor": "swegkit",
            "barrel": "LARGE_BALL",
            "case": "SHINY_STONE_HOE",
            "coins": 558532,
            "deaths": 3727,
            "hat": "diamond",
            "kills": 4218,
            "killsound": "golem_death",
            "killstreaks": 94,
            "muzzle": "NONE",
            "packages": [
                "cold_war",
                "cactus",
                "soldier",
                "case.iron_hoe",
                "barrel.burst",
                "sight.red",
                "trigger.one_point_four",
                "trigger.nine_point_zero",
                "case.shiny_stone_hoe",
                "majestichat",
                "trigger.one_point_three",
                "majestic",
                "trigger.one_point_two",
                "trigger.one_point_one",
                "instant_respawn",
                "sight.blue",
                "blaze_death",
                "barrel.large_ball",
                "golem_death",
                "swegkit",
                "diamond",
                "achievement_flag_1",
                "achievement_flag_3"
            ],
            "sight": "BLUE",
            "trigger": "ONE_POINT_ONE",
            "wins": 36,
            "wins_team": 3,
            "kills_teams": 47,
            "deaths_teams": 49,
            "wins_teams": 1,
            "killstreaks_teams": 2,
            "monthly_kills_b": 31,
            "weekly_kills_a": 31,
            "showKillPrefix": false
        },
        "TNTGames": {
            "bloodwizard_explode": 0,
            "bloodwizard_regen": 0,
            "coins": 49036,
            "deaths_bowspleef": 171,
            "deaths_capture": 237,
            "doublejump_tntrun": 6,
            "kills_capture": 214,
            "packages": [
                "bakers_hat",
                "wither",
                "clicked_team_deathmatch_npc",
                "tiered_achievement_flag_1",
                "tiered_achievement_flag_3",
                "shop_2018",
                "bounty_hat",
                "dje_rainbow",
                "clicked_tnt_run_npc"
            ],
            "selected_hat": "bakers_hat",
            "spleef_doublejump": 2,
            "spleef_repulse": 1,
            "spleef_triple": 3,
            "tags_bowspleef": 3808,
            "wins_bowspleef": 2,
            "wins_capture": 32,
            "wins_tntag": 3,
            "wins_tntrun": 11,
            "witherwizard_explode": 2,
            "witherwizard_regen": 2,
            "kills_tntag": 1,
            "active_death_effect": "wither",
            "record_tntrun": 163,
            "record_pvprun": 51,
            "kills_pvprun": 1,
            "run_potions_splashed_on_players": 0,
            "new_icewizard_explode": 1,
            "new_tntrun_double_jumps": 6,
            "new_pvprun_double_jumps": 6,
            "new_witherwizard_regen": 3,
            "new_tntag_speedy": 1,
            "new_kineticwizard_explode": 1,
            "new_spleef_double_jumps": 3,
            "new_spleef_repulsor": 1,
            "new_firewizard_explode": 1,
            "new_witherwizard_explode": 3,
            "new_bloodwizard_explode": 1,
            "new_kineticwizard_regen": 1,
            "new_bloodwizard_regen": 1,
            "new_icewizard_regen": 1,
            "new_spleef_tripleshot": 4,
            "new_firewizard_regen": 1,
            "wins": 48,
            "winstreak": 0,
            "deaths_tntrun": 4,
            "new_tntrun_double_jumps_legacy": 7,
            "new_pvprun_double_jumps_legacy": 7,
            "new_selected_hat": "bounty_hat",
            "new_active_death_effect": "wither",
            "new_double_jump_effect": "dje_rainbow",
            "flags": {
                "show_tip_holograms": true,
                "show_tntrun_actionbar_info": false
            },
            "lastTourneyAd": 1628866015170
        },
        "UHC": {
            "coins": 61409,
            "deaths": 143,
            "equippedKit": "WORKING_TOOLS",
            "heads_eaten": 128,
            "kills": 142,
            "packages": [
                "apples",
                "enchant_bottles",
                "iron_ingots",
                "eight_steaks",
                "eight_glowstone",
                "eight_leather",
                "vorpal_sword",
                "obsidian",
                "light_enchanting",
                "sharp_one_book",
                "prot_book",
                "power_one_book",
                "proj_prot_book",
                "melon",
                "green_armor",
                "dragon_armor",
                "tarnhelm",
                "resist_pot",
                "light_anvil",
                "nether_wart",
                "absorption_pot",
                "regen_potion",
                "dragon_sword",
                "arrows_economy",
                "golden_head",
                "pandoras_box",
                "panacea",
                "cupids_bow",
                "philosopher_pick",
                "seven_league_boots",
                "saddle",
                "forge",
                "efficiency_pickaxe",
                "lumberjack_axe",
                "apprentice_helmet",
                "apprentice_bow",
                "apprentice_sword",
                "potion_of_velocity",
                "masters_compass"
            ],
            "perk_alchemy_line_a": 0,
            "perk_alchemy_line_b": 2,
            "perk_alchemy_line_c": 2,
            "perk_armorsmith_line_a": 1,
            "perk_armorsmith_line_b": 3,
            "perk_armorsmith_line_c": 3,
            "perk_cooking_line_a": 0,
            "perk_cooking_line_b": 2,
            "perk_cooking_line_c": 2,
            "perk_enchanting_line_a": 0,
            "perk_enchanting_line_c": 2,
            "perk_engineering_line_a": 1,
            "perk_engineering_line_b": 3,
            "perk_engineering_line_c": 3,
            "perk_survivalism_line_a": 1,
            "perk_survivalism_line_b": 3,
            "perk_survivalism_line_c": 3,
            "perk_weaponsmith_line_a": 1,
            "perk_weaponsmith_line_b": 3,
            "perk_weaponsmith_line_c": 3,
            "score": 334,
            "wins": 19,
            "perk_enchanting_line_b": 2,
            "perk_hunter_line_a": 0,
            "perk_hunter_line_b": 1,
            "perk_hunter_line_c": 1,
            "perk_bloodcraft_line_a": 1,
            "perk_bloodcraft_line_b": 3,
            "perk_bloodcraft_line_c": 3,
            "kit_WORKING_TOOLS": 3,
            "monthly_wins_a": 1,
            "monthly_kills_a": 5,
            "monthly_kills_b": 1,
            "cache3": true,
            "clearup_achievement": true,
            "deaths_solo": 5,
            "kills_solo": 2,
            "heads_eaten_solo": 1,
            "perk_toolsmithing_line_a": 0,
            "perk_toolsmithing_line_c": 3,
            "perk_toolsmithing_line_b": 3,
            "perk_apprentice_line_a": 1,
            "perk_apprentice_line_c": 3,
            "perk_apprentice_line_b": 3,
            "perk_weaponsmith_prestige": 1,
            "perk_engineering_prestige": 1,
            "kills_solo2": 2,
            "wins_solo": 0,
            "kills2": 142,
            "wins2": 19,
            "saved_stats": true
        },
        "VampireZ": {
            "baby_hater": 0,
            "coins": 695341,
            "fireproofing": 2,
            "gold_booster": 2,
            "gold_starter": 2,
            "hellborn": 2,
            "human_deaths": 75,
            "human_kills": 76,
            "human_wins": 8,
            "vampire_deaths": 130,
            "vampire_doubler": 0,
            "vampire_kills": 334,
            "vampiric_scream": 0,
            "zombie_doubler": 2,
            "zombie_kills": 51,
            "updated_stats": true
        },
        "Walls": {
            "blacksmith": 0,
            "chef": 0,
            "chemist": 0,
            "coins": 550227,
            "deaths": 50,
            "dwarwen_skills": 0,
            "fortune": 0,
            "guitarist": 0,
            "hunter": 0,
            "kills": 38,
            "losses": 38,
            "monthly_wins_a": 4,
            "packages": [
                "guitarist",
                "snack_lover",
                "chef",
                "blacksmith",
                "sage",
                "hunter",
                "dwarwen_skills",
                "chemist",
                "vampirism",
                "berserk",
                "adrenaline",
                "boss_skills",
                "thats_hot",
                "soup_drinker",
                "blacksmith_starter"
            ],
            "sage": 0,
            "snack_lover": 0,
            "vampirism": 2,
            "weekly_wins_a": 3,
            "wins": 27,
            "berserk": 0,
            "weekly_wins_b": 1,
            "weekly_kills_b": 2,
            "monthly_kills_a": 2,
            "adrenaline": 0,
            "boss_skills": 0,
            "thats_hot": 0,
            "soup_drinker": 0,
            "blacksmith_starter": 1
        },
        "Walls3": {
            "chosen_class": "Werewolf",
            "coins": 515481,
            "deaths": 826,
            "deaths_Herobrine": 682,
            "finalDeaths": 36,
            "finalKills": 189,
            "finalKills_Herobrine": 189,
            "herobrine_a": 9,
            "herobrine_b": 9,
            "herobrine_c": 9,
            "herobrine_d": 9,
            "herobrine_g": 9,
            "kills": 1046,
            "kills_Herobrine": 912,
            "losses": 140,
            "losses_Herobrine": 114,
            "monthly_finalKills_Herobrine_a": 4,
            "monthly_finalKills_Herobrine_b": 7,
            "mutations_visibility": true,
            "packages": [
                "herobrine_skill_alternate_active",
                "herobrine_enderchest",
                "legacy_achievement_a",
                "pigman_skill_alternate_active",
                "golem_skill_alternate_active",
                "blaze_skill_alternate_active",
                "achievement_fix_flag",
                "noscoped_sign",
                "werewolf_skill_alternate_active",
                "pupper",
                "cakes_fix_flag_2"
            ],
            "war_cry": "CLEAR_SKIES",
            "weeklyDeaths": 59,
            "weeklyDeaths_Herobrine": 59,
            "weeklyKills": 52,
            "weeklyKills_Herobrine": 52,
            "weeklyLosses": 10,
            "weeklyLosses_Herobrine": 10,
            "weeklyWins": 7,
            "weeklyWins_Herobrine": 7,
            "weekly_finalKills_Herobrine_a": 5,
            "weekly_finalKills_Herobrine_b": 6,
            "wins": 74,
            "wins_Herobrine": 59,
            "finalAssists": 8,
            "assists": 106,
            "assists_Herobrine": 29,
            "finalAssists_Herobrine": 8,
            "colorblind": true,
            "herobrineInventory": {
                "0": "373,2",
                "1": "276,0",
                "2": "373,5",
                "6": "364,0",
                "7": "278,0",
                "8": "345,0",
                "27": "58,0",
                "28": "130,0"
            },
            "weeklyLosses_practice": 0,
            "losses_practice_Herobrine": 0,
            "weeklyLosses_practice_Herobrine": 0,
            "losses_practice": 0,
            "plays_practice": 2,
            "weeklyLosses_face_off_Herobrine": 0,
            "losses_face_off": 0,
            "losses_face_off_Herobrine": 0,
            "plays_face_off": 4,
            "weeklyLosses_face_off": 0,
            "witherCoins": 1,
            "weeklyWins_face_off_Herobrine": 2,
            "wins_face_off_Herobrine": 2,
            "wins_face_off": 2,
            "weeklyWins_face_off": 2,
            "witherDamage": 1,
            "weekly_finalKills_a": 1,
            "monthly_finalKills_b": 1,
            "herobrine_losses": 115,
            "total_final_kills_standard": 220,
            "herobrine_final_kills": 189,
            "herobrine_deaths": 702,
            "final_kills_standard": 198,
            "herobrine_kills": 923,
            "total_final_kills": 220,
            "herobrine_final_kills_standard": 189,
            "herobrine_wins_standard": 62,
            "herobrine_total_final_kills_standard": 189,
            "herobrine_wins": 62,
            "final_kills": 198,
            "herobrine_final_assists": 9,
            "herobrine_enderchest_level": 4,
            "herobrine_total_final_kills": 189,
            "herobrine_meters_walked_standard": 36963,
            "meters_fallen": 38277,
            "time_played": 811,
            "herobrine_meters_fallen": 9181,
            "time_played_standard": 796,
            "herobrine_meters_walked": 38840,
            "herobrine_meters_fallen_standard": 8891,
            "herobrine_time_played_standard": 182,
            "herobrine_time_played": 197,
            "meters_walked": 148246,
            "meters_walked_standard": 146369,
            "meters_fallen_standard": 37987,
            "meters_fallen_face_off": 290,
            "herobrine_time_played_face_off": 15,
            "time_played_face_off": 15,
            "herobrine_meters_walked_face_off": 1877,
            "herobrine_meters_fallen_face_off": 290,
            "meters_walked_face_off": 1877,
            "herobrine_a_kills_standard": 4,
            "herobrine_a_total_kills_standard": 6,
            "herobrine_assists": 12,
            "herobrine_a_activations_standard": 40,
            "defender_assists_standard": 38,
            "herobrine_potions_drunk_standard": 47,
            "herobrine_blocks_broken_standard": 992,
            "herobrine_games_played": 4,
            "herobrine_iron_ore_broken": 495,
            "total_deaths": 107,
            "herobrine_potions_drunk": 47,
            "herobrine_kills_standard": 11,
            "herobrine_blocks_broken": 992,
            "herobrine_final_assists_standard": 1,
            "herobrine_final_deaths_standard": 4,
            "total_kills": 122,
            "activations_standard": 176,
            "herobrine_a_defender_kills_standard": 2,
            "treasures_found": 194,
            "herobrine_a_kills": 4,
            "wood_chopped": 3,
            "herobrine_deaths_standard": 20,
            "herobrine_a_damage_dealt": 192,
            "herobrine_damage_dealt_standard": 192,
            "herobrine_defender_kills": 7,
            "herobrine_blocks_placed": 150,
            "defender_kills_standard": 31,
            "herobrine_blocks_placed_preparation": 103,
            "herobrine_food_eaten": 1,
            "wither_damage_standard": 1002,
            "wood_chopped_standard": 3,
            "herobrine_a_total_kills": 6,
            "herobrine_defender_assists": 4,
            "food_eaten_standard": 55,
            "final_deaths": 18,
            "games_played": 21,
            "herobrine_kills_melee": 11,
            "blocks_placed_standard": 604,
            "herobrine_total_deaths": 24,
            "blocks_placed_preparation": 243,
            "herobrine_final_deaths": 4,
            "herobrine_a_defender_kills": 2,
            "blocks_placed_preparation_standard": 243,
            "herobrine_blocks_placed_standard": 150,
            "damage_dealt": 378,
            "herobrine_activations": 40,
            "total_kills_standard": 122,
            "final_assists": 23,
            "herobrine_wither_damage_standard": 247,
            "herobrine_wood_chopped": 2,
            "kills_melee_standard": 48,
            "herobrine_treasures_found_standard": 61,
            "herobrine_iron_ore_broken_standard": 495,
            "kills_standard": 48,
            "iron_ore_broken_standard": 2837,
            "treasures_found_standard": 194,
            "food_eaten": 55,
            "herobrine_defender_assists_standard": 4,
            "blocks_broken_standard": 5529,
            "potions_drunk_standard": 97,
            "herobrine_meters_walked_speed": 3460,
            "damage_dealt_standard": 378,
            "meters_walked_speed_standard": 12884,
            "herobrine_wood_chopped_standard": 2,
            "final_deaths_standard": 18,
            "kills_melee": 48,
            "herobrine_treasures_found": 61,
            "defender_kills": 31,
            "final_assists_standard": 23,
            "herobrine_damage_dealt": 192,
            "herobrine_blocks_placed_preparation_standard": 103,
            "herobrine_activations_standard": 40,
            "herobrine_meters_walked_speed_standard": 3460,
            "potions_drunk": 97,
            "blocks_broken": 5529,
            "activations": 176,
            "assists_standard": 77,
            "blocks_placed": 604,
            "herobrine_total_deaths_standard": 24,
            "meters_walked_speed": 12884,
            "iron_ore_broken": 2837,
            "herobrine_food_eaten_standard": 1,
            "deaths_standard": 89,
            "total_deaths_standard": 107,
            "herobrine_defender_kills_standard": 7,
            "herobrine_total_kills_standard": 20,
            "herobrine_kills_melee_standard": 11,
            "herobrine_games_played_standard": 4,
            "wins_standard": 8,
            "wither_damage": 1002,
            "herobrine_wither_damage": 247,
            "defender_assists": 38,
            "herobrine_a_kills_melee_standard": 4,
            "herobrine_a_damage_dealt_standard": 192,
            "herobrine_assists_standard": 12,
            "herobrine_a_kills_melee": 4,
            "games_played_standard": 21,
            "herobrine_a_activations": 40,
            "herobrine_total_kills": 20,
            "herobrine_reclaimed": 1524250377384,
            "classes": {
                "herobrine": {
                    "prestige": 0,
                    "skill_level_d": 5,
                    "skill_level_g": 3,
                    "unlocked": true,
                    "skill_level_b": 3,
                    "skill_level_c": 3,
                    "enderchest_rows": 5,
                    "skill_level_a": 5,
                    "skill_level_dChecked5": true,
                    "skill_level_aChecked5": true,
                    "skill_level_cChecked5": true,
                    "skill_level_gChecked5": true,
                    "skill_level_bChecked5": true
                },
                "werewolf": {
                    "unlocked": true,
                    "enderchest_rows": 5,
                    "skill_level_d": 5,
                    "skill_level_a": 5,
                    "skill_level_b": 3
                },
                "skeleton": {
                    "skill_level_d": 1,
                    "skill_level_dChecked5": true
                },
                "zombie": {
                    "skill_level_d": 1,
                    "skill_level_dChecked5": true
                },
                "enderman": {
                    "skill_level_dChecked5": true,
                    "skill_level_d": 1
                }
            },
            "activeChallengeMap": "challengemap_random",
            "enemies_hit_standard": 134,
            "herobrine_a_enemies_hit_standard": 27,
            "enemies_hit": 134,
            "herobrine_a_assists": 2,
            "herobrine_enemies_hit_standard": 27,
            "herobrine_enemies_hit": 27,
            "herobrine_a_assists_standard": 2,
            "herobrine_a_enemies_hit": 27,
            "herobrine_kills_melee_behind_standard": 1,
            "losses_standard": 13,
            "herobrine_kills_melee_behind": 1,
            "herobrine_losses_standard": 1,
            "kills_melee_behind": 12,
            "kills_melee_behind_standard": 12,
            "mythic_favor": 1,
            "iron_armor_gifted_standard": 45,
            "herobrine_iron_armor_gifted_standard": 1,
            "iron_armor_gifted": 45,
            "herobrine_iron_armor_gifted": 1,
            "werewolf_blocks_placed_preparation_standard": 140,
            "werewolf_a_enemies_hit_standard": 107,
            "apples_eaten": 7,
            "werewolf_total_deaths_standard": 83,
            "werewolf_treasures_found": 133,
            "werewolf_final_assists_melee_standard": 22,
            "werewolf_meters_fallen_standard": 29096,
            "werewolf_steaks_eaten": 34,
            "werewolf_a_activations_deathmatch_standard": 11,
            "final_assists_melee": 22,
            "werewolf_total_deaths": 83,
            "werewolf_enemies_hit": 107,
            "werewolf_a_assists_standard": 9,
            "werewolf_meters_walked": 109406,
            "werewolf_a_enemies_hit": 107,
            "activations_deathmatch_standard": 13,
            "werewolf_defender_assists_standard": 34,
            "werewolf_food_eaten_standard": 54,
            "werewolf_blocks_placed": 454,
            "werewolf_meters_walked_speed": 9424,
            "werewolf_a_activations_standard": 107,
            "werewolf_assists": 65,
            "werewolf_apples_eaten": 7,
            "werewolf_a_damage_dealt": 186,
            "werewolf_deaths_standard": 69,
            "werewolf_treasures_found_standard": 133,
            "werewolf_blocks_broken_standard": 4537,
            "werewolf_damage_dealt_standard": 186,
            "werewolf_meters_walked_speed_standard": 9424,
            "werewolf_defender_assists": 34,
            "werewolf_enemies_hit_standard": 107,
            "werewolf_damage_dealt": 186,
            "apples_eaten_standard": 7,
            "werewolf_wither_damage_standard": 755,
            "werewolf_total_kills": 102,
            "werewolf_final_assists": 22,
            "werewolf_final_deaths": 14,
            "werewolf_a_total_kills": 10,
            "werewolf_apples_eaten_standard": 7,
            "werewolf_total_final_kills": 31,
            "werewolf_final_assists_melee": 22,
            "werewolf_games_played": 17,
            "werewolf_blocks_placed_standard": 454,
            "werewolf_food_eaten": 54,
            "werewolf_wins_standard": 5,
            "werewolf_total_final_kills_standard": 31,
            "werewolf_potions_drunk": 50,
            "werewolf_a_damage_dealt_standard": 186,
            "werewolf_deaths": 69,
            "werewolf_final_assists_standard": 22,
            "werewolf_blocks_broken": 4537,
            "werewolf_assists_standard": 65,
            "werewolf_a_activations_deathmatch": 11,
            "werewolf_blocks_placed_preparation": 140,
            "werewolf_potions_drunk_standard": 50,
            "steaks_eaten": 34,
            "werewolf_activations_deathmatch": 13,
            "final_assists_melee_standard": 22,
            "werewolf_a_total_kills_standard": 10,
            "steaks_eaten_standard": 34,
            "werewolf_final_deaths_standard": 14,
            "werewolf_meters_walked_standard": 109406,
            "werewolf_time_played": 614,
            "werewolf_activations_standard": 136,
            "werewolf_iron_ore_broken_standard": 2342,
            "werewolf_steaks_eaten_standard": 34,
            "werewolf_time_played_standard": 614,
            "werewolf_games_played_standard": 17,
            "werewolf_wither_damage": 755,
            "werewolf_total_kills_standard": 102,
            "werewolf_meters_fallen": 29096,
            "werewolf_wins": 5,
            "activations_deathmatch": 13,
            "werewolf_a_assists": 9,
            "werewolf_a_activations": 107,
            "werewolf_activations_deathmatch_standard": 13,
            "werewolf_iron_ore_broken": 2342,
            "werewolf_activations": 136,
            "exchange_favor_bought": 9,
            "new_echest": 5,
            "werewolfInventory": {
                "0": "373,5",
                "1": "276,0",
                "2": "373,2",
                "3": "278,0",
                "6": "364,0",
                "7": "130,0",
                "8": "345,0"
            },
            "werewolf_defender_kills_standard": 24,
            "werewolf_losses_standard": 12,
            "werewolf_losses": 12,
            "werewolf_kills": 37,
            "werewolf_g_activations_standard": 29,
            "werewolf_kills_melee_behind_standard": 11,
            "werewolf_kills_melee_standard": 37,
            "werewolf_kills_standard": 37,
            "werewolf_defender_kills": 24,
            "werewolf_g_activations": 29,
            "werewolf_kills_melee": 37,
            "werewolf_kills_melee_behind": 11,
            "werewolf_iron_armor_gifted": 44,
            "werewolf_final_kills_melee_standard": 9,
            "final_kills_melee": 9,
            "werewolf_final_kills_standard": 9,
            "werewolf_final_kills": 9,
            "werewolf_iron_armor_gifted_standard": 44,
            "final_kills_melee_standard": 9,
            "werewolf_final_kills_melee": 9,
            "colorblind_italic": true,
            "colorblind_bold": true,
            "werewolf_arrows_hit_standard": 11,
            "werewolf_potions_splashed_standard": 2,
            "werewolf_arrows_fired": 67,
            "potions_splashed": 2,
            "arrows_fired_standard": 67,
            "werewolf_arrows_fired_standard": 67,
            "werewolf_arrows_hit": 11,
            "werewolf_potions_splashed": 2,
            "arrows_fired": 67,
            "arrows_hit_standard": 11,
            "arrows_hit": 11,
            "potions_splashed_standard": 2,
            "fish_eaten_standard": 13,
            "werewolf_fish_eaten": 13,
            "fish_eaten": 13,
            "werewolf_fish_eaten_standard": 13,
            "energy_syphoned_standard": 44,
            "werewolf_energy_syphoned_standard": 44,
            "energy_syphoned": 44,
            "werewolf_energy_syphoned": 44,
            "werewolf_new_d": 2,
            "werewolf_new_a": 2,
            "werewolf_d_infused": 2,
            "werewolf_a_infused": 2,
            "werewolf_b_infused": 1,
            "kill_message": "DIGITAL",
            "chosen_kill_sign": "NOSCOPED",
            "smiley_kills": "SHOCKED_FACE",
            "chosen_skin_Werewolf": "Pupper",
            "werewolf_wither_kills_standard": 2,
            "wither_kills_standard": 2,
            "werewolf_wither_kills": 2,
            "wither_kills": 2,
            "werewolf_a_kills_melee": 1,
            "werewolf_a_kills": 1,
            "werewolf_a_defender_kills": 1,
            "werewolf_a_defender_kills_standard": 1,
            "werewolf_a_kills_melee_standard": 1,
            "werewolf_a_kills_standard": 1,
            "werewolf_a_defender_assists": 2,
            "werewolf_a_defender_assists_standard": 2,
            "werewolf_a_final_assists": 1,
            "werewolf_a_final_assists_melee_standard": 1,
            "defender_final_assists": 1,
            "werewolf_defender_final_assists_standard": 1,
            "werewolf_a_final_assists_melee": 1,
            "werewolf_defender_final_assists": 1,
            "werewolf_a_total_final_kills_standard": 1,
            "defender_final_assists_standard": 1,
            "werewolf_a_total_final_kills": 1,
            "werewolf_a_final_assists_standard": 1,
            "werewolf_wood_chopped": 1,
            "werewolf_wood_chopped_standard": 1,
            "werewolf_final_kills_melee_behind": 3,
            "werewolf_g_activations_deathmatch": 2,
            "final_kills_melee_behind": 3,
            "final_kills_melee_behind_standard": 3,
            "werewolf_g_activations_deathmatch_standard": 2,
            "werewolf_final_kills_melee_behind_standard": 3
        },
        "GingerBread": {
            "frame_active": "{GingerbreadPart:{PartType:FRAME,PartRarity:SUPER,Attributes:[{KartAttributeType:HANDLING,Level:2},{KartAttributeType:TRACTION,Level:5}]}}",
            "engine_active": "{GingerbreadPart:{PartType:ENGINE,PartRarity:AWESOME,Attributes:[{KartAttributeType:ACCELERATION,Level:4},{KartAttributeType:TOP_SPEED,Level:1},{KartAttributeType:RECOVERY,Level:1}]}}",
            "booster_active": "{GingerbreadPart:{PartType:TURBOCHARGER,PartRarity:AWESOME,Attributes:[{KartAttributeType:DRIFTING_EFFICIENCY,Level:3},{KartAttributeType:BRAKES,Level:4},{KartAttributeType:BOOSTER_SPEED,Level:5}]}}",
            "skin_active": "YELLOW_KART;ALT_2",
            "jacket_active": "LEATHER_JACKET",
            "packages": [
                "helmet_1_2_unlocked",
                "yellow_kart_alt_2_unlocked",
                "rainbowz_unlocked",
                "truck_unlocked",
                "leather_jacket_unlocked",
                "leather_pants_unlocked",
                "leather_shoes_unlocked",
                "helmet_9_1_unlocked",
                "diamond_jacket_unlocked",
                "achievementsupdatedd",
                "achievementsupdatedc"
            ],
            "shoes_active": "LEATHER_SHOES",
            "pants_active": "LEATHER_PANTS",
            "helmet_active": "HELMET_9_1",
            "horn": "TRUCK",
            "coins": 540702,
            "parts": "{GingerbreadPart:{PartType:TURBOCHARGER,PartRarity:AWESOME,Attributes:[{KartAttributeType:DRIFTING_EFFICIENCY,Level:3},{KartAttributeType:BRAKES,Level:4},{KartAttributeType:BOOSTER_SPEED,Level:5}]}};{GingerbreadPart:{PartType:FRAME,PartRarity:SUPER,Attributes:[{KartAttributeType:HANDLING,Level:2},{KartAttributeType:TRACTION,Level:5}]}};{GingerbreadPart:{PartType:ENGINE,PartRarity:AWESOME,Attributes:[{KartAttributeType:ACCELERATION,Level:4},{KartAttributeType:TOP_SPEED,Level:1},{KartAttributeType:RECOVERY,Level:1}]}}",
            "box_pickups": 297,
            "laps_completed": 62,
            "coins_picked_up": 789,
            "banana_hits_received": 63,
            "banana_hits_sent": 59,
            "bronze_trophy": 4,
            "wins": 8,
            "silver_trophy": 4,
            "blue_torpedo_hit": 6,
            "silver_trophy_weekly_b": 3,
            "silver_trophy_monthly_b": 3,
            "silver_trophy_olympus": 1,
            "silver_trophy_retro": 2,
            "bronze_trophy_weekly_b": 4,
            "bronze_trophy_monthly_b": 4,
            "bronze_trophy_olympus": 1,
            "bronze_trophy_hypixelgp": 1,
            "bronze_trophy_retro": 1,
            "bronze_trophy_canyon": 1,
            "box_pickups_weekly_a": 83,
            "box_pickups_weekly_b": 226,
            "box_pickups_monthly_b": 217,
            "box_pickups_olympus": 39,
            "box_pickups_junglerush": 70,
            "box_pickups_hypixelgp": 57,
            "box_pickups_retro": 86,
            "box_pickups_canyon": 57,
            "olympus_plays": 3,
            "junglerush_plays": 4,
            "hypixelgp_plays": 4,
            "retro_plays": 6,
            "canyon_plays": 6,
            "particle_trail": "RAINBOWZ",
            "box_pickups_monthly_a": 92,
            "silver_trophy_weekly_a": 1,
            "silver_trophy_monthly_a": 1,
            "silver_trophy_hypixelgp": 1,
            "lastTourneyAd": 1596852144320
        },
        "SkyWars": {
            "win_streak": 0,
            "survived_players": 21186,
            "losses": 1505,
            "deaths_team_insane": 60,
            "arrows_hit": 462,
            "blocks_placed": 18546,
            "survived_players_kit_mining_team_default": 39,
            "games": 797,
            "coins": 560367,
            "survived_players_team": 15769,
            "items_enchanted": 151,
            "losses_team_insane": 57,
            "losses_kit_mining_team_default": 2,
            "games_kit_mining_team_default": 2,
            "deaths": 1601,
            "deaths_kit_mining_team_default": 2,
            "games_team": 534,
            "losses_team": 877,
            "deaths_team": 968,
            "arrows_shot": 1412,
            "losses_solo": 591,
            "deaths_solo_insane": 71,
            "survived_players_kit_basic_solo_default": 61,
            "blocks_broken": 5561,
            "deaths_kit_basic_solo_default": 11,
            "deaths_solo": 591,
            "quits": 1172,
            "survived_players_solo": 3797,
            "losses_solo_insane": 71,
            "losses_kit_basic_solo_default": 11,
            "soul_well": 821,
            "usedSoulWell": true,
            "packages": [
                "kit_supporting_team_armorsmith",
                "cage_nether-cage",
                "cage_farm-hunt-cage",
                "kit_basic_solo_ecologist",
                "kit_advanced_solo_armorer",
                "cage_mist-cage",
                "kit_defending_team_armorer",
                "cage_bubblegum-cage",
                "kit_basic_solo_armorsmith",
                "kit_attacking_team_scout",
                "kit_advanced_solo_enchanter",
                "cage_banana-cage",
                "kit_supporting_team_healer",
                "cage_lime-cage",
                "cage_green-cage",
                "cage_sky-cage",
                "kit_mining_team_speleologist",
                "kit_advanced_solo_farmer",
                "kit_basic_solo_speleologist",
                "cage_void-cage",
                "legacyachievement",
                "kit_advanced_solo_cannoneer",
                "cage_redstone-master-cage",
                "kit_defending_team_guardian",
                "cage_notch-apple-cage",
                "cage_orange-cage",
                "cage_toffee-cage",
                "kit_supporting_team_enchanter",
                "kit_mining_team_cannoneer",
                "cage_angel-cage",
                "cage_rainbow-cage",
                "kit_defending_team_baseball-player",
                "kit_attacking_team_knight",
                "kit_supporting_team_ecologist",
                "cage_cloud-cage",
                "kit_basic_solo_troll",
                "cage_nicolas-cage",
                "cage_royal-cage",
                "kit_attacking_team_hunter",
                "kit_basic_solo_fisherman",
                "cage_premium-cage",
                "kit_attacking_team_snowman",
                "kit_advanced_solo_knight",
                "cage_ice-cage",
                "cage_tree-cage",
                "cage_slime-cage",
                "legacyachievement3",
                "legacyachievement4",
                "divisionskywars_skywars_rating_8_16",
                "fix_achievements2",
                "kit_basic_solo_princess",
                "kit_basic_solo_batguy",
                "kit_basic_solo_scout",
                "kit_basic_solo_frog",
                "kit_defending_team_frog",
                "kit_attacking_team_energix",
                "kit_basic_solo_grenade",
                "kit_basic_solo_disco",
                "kit_advanced_solo_hunter",
                "kit_basic_solo_baseball-player",
                "kit_enderchest_solo_enderchest",
                "kit_advanced_solo_enderman",
                "kit_basic_solo_pharaoh",
                "kit_advanced_solo_pyro",
                "kit_basic_solo_rookie",
                "kit_basic_solo_snowman",
                "kit_basic_solo_energix",
                "kit_advanced_solo_engineer",
                "kit_advanced_solo_salmon",
                "killmessages_pirate",
                "balloon_bookworm",
                "sprays_snowballed",
                "balloon_clouds",
                "projectiletrail_black_smoke",
                "kit_supporting_team_rookie",
                "kit_attacking_team_pig-rider",
                "kit_attacking_team_engineer",
                "balloon_fusion",
                "sprays_easter_eggs",
                "sprays_creeper",
                "deathcry_energy",
                "deathcry_sniff",
                "sprays_easter_creeper",
                "sprays_great_egg_hunt",
                "balloon_easter_bunny",
                "balloon_fat_chicken",
                "balloon_tire",
                "killmessages_galactic",
                "projectiletrail_peep_hatching",
                "deathcry_dry_bones",
                "sprays_gg_wp",
                "victorydance_cold_snap",
                "balloon_green_fractal",
                "killeffect_lighting_strike",
                "sprays_choc_feast",
                "killmessages_western",
                "projectiletrail_potion",
                "balloon_easter_basket",
                "deathcry_enderman",
                "deathcry_pig",
                "deathcry_squeak",
                "killmessages_insectoid",
                "sprays_soul_harvest",
                "balloon_hearts",
                "cage_dark-cage",
                "deathcry_sploosh",
                "killeffect_bunny_explosion",
                "kit_attacking_team_fisherman",
                "kit_basic_solo_healer",
                "kit_attacking_team_grenade",
                "update_solo_team_kits2",
                "kit_defending_team_disco",
                "kit_supporting_team_troll",
                "convertedstatstoexp",
                "kit_advanced_solo_pig-rider",
                "update_solo_team_perk_levels",
                "kit_attacking_team_enderman",
                "kit_advanced_solo_guardian",
                "update_solo_team_kits_and_perks",
                "kit_defending_team_farmer",
                "kit_attacking_team_salmon",
                "kit_defending_team_batguy",
                "kit_enderchest_team_enderchest",
                "kit_supporting_team_pharaoh",
                "kit_supporting_team_princess",
                "kit_supporting_team_pyro",
                "projectiletrail_golden",
                "killeffect_flower_explosion",
                "killmessages_evil",
                "projectiletrail_wave",
                "sprays_reveillon",
                "balloon_grinch",
                "sprays_santa",
                "killmessages_fire",
                "killeffect_firework",
                "projectiletrail_snowball_rain",
                "sprays_decorative_island",
                "deathcry_robot_mouse",
                "sprays_sorry",
                "deathcry_horse",
                "sprays_essentials",
                "balloon_red_skull",
                "sprays_snowball_fight",
                "balloon_beach_ball",
                "sprays_festive_harbinger",
                "sprays_christmas_tree",
                "sprays_tranquility",
                "balloon_relic",
                "deathcry_dinosaur",
                "killeffect_campfire",
                "cage_plasma-cage",
                "killeffect_gift_explosion",
                "projectiletrail_purple_dust",
                "balloon_rainbowest",
                "victorydance_slimester",
                "projectiletrail_ender",
                "sprays_surprise_snowball",
                "projectiletrail_fire",
                "cage_faded-cage",
                "projectiletrail_red_dust",
                "killeffect_piñata",
                "balloon_disco",
                "victorydance_meteor_shower",
                "sprays_bye_bye",
                "deathcry_grumble",
                "killeffect_snow_globe",
                "killmessages_computer",
                "update_opals_prestige",
                "update_shard_removal",
                "angels_descent_tree_2022",
                "update_shard_removal_bedrock"
            ],
            "souls": 39,
            "paid_souls": 3110,
            "deaths_solo_normal": 520,
            "losses_solo_normal": 520,
            "kills_kit_basic_solo_default": 4,
            "kills_solo": 768,
            "kills_solo_normal": 740,
            "kills": 2345,
            "activeKit_TEAM": "kit_attacking_team_knight",
            "deaths_kit_supporting_team_armorsmith": 44,
            "survived_players_kit_supporting_team_armorsmith": 640,
            "games_kit_supporting_team_armorsmith": 24,
            "deaths_team_normal": 908,
            "losses_team_normal": 820,
            "losses_kit_supporting_team_armorsmith": 43,
            "kills_team": 1541,
            "kills_team_insane": 34,
            "kills_kit_supporting_team_armorsmith": 30,
            "kills_team_normal": 1507,
            "enderpearls_thrown": 198,
            "activeCage": "cage_rainbow-cage",
            "games_solo": 246,
            "games_kit_basic_solo_default": 4,
            "egg_thrown": 1091,
            "wins_solo_insane": 2,
            "wins": 439,
            "kills_solo_insane": 28,
            "wins_solo": 96,
            "wins_kit_basic_solo_default": 1,
            "souls_gathered": 3571,
            "assists_kit_supporting_team_armorsmith": 7,
            "assists_team": 387,
            "assists": 427,
            "activeKit_SOLO": "kit_basic_solo_ecologist",
            "survived_players_kit_basic_solo_ecologist": 646,
            "deaths_kit_basic_solo_ecologist": 133,
            "losses_kit_basic_solo_ecologist": 133,
            "kills_kit_basic_solo_ecologist": 130,
            "games_kit_basic_solo_ecologist": 49,
            "wins_team_insane": 6,
            "wins_kit_supporting_team_armorsmith": 6,
            "wins_team": 333,
            "xezbeth_luck": 2,
            "solo_ender_mastery": 4,
            "soul_well_rares": 148,
            "survived_players_kit_advanced_solo_armorer": 186,
            "games_kit_advanced_solo_armorer": 13,
            "losses_kit_advanced_solo_armorer": 35,
            "deaths_kit_advanced_solo_armorer": 35,
            "kills_kit_advanced_solo_armorer": 33,
            "assists_solo": 29,
            "assists_kit_advanced_solo_armorer": 3,
            "team_ender_mastery": 4,
            "solo_instant_smelting": 0,
            "wins_kit_basic_solo_ecologist": 13,
            "wins_solo_normal": 94,
            "assists_kit_basic_solo_ecologist": 8,
            "games_kit_defending_team_armorer": 26,
            "losses_kit_defending_team_armorer": 48,
            "survived_players_kit_defending_team_armorer": 844,
            "deaths_kit_defending_team_armorer": 52,
            "kills_kit_defending_team_armorer": 84,
            "team_instant_smelting": 0,
            "assists_kit_defending_team_armorer": 23,
            "wins_kit_defending_team_armorer": 19,
            "team_juggernaut": 0,
            "team_blazing_arrows": 0,
            "soul_well_legendaries": 42,
            "solo_marksmanship": 0,
            "solo_resistance_boost": 0,
            "survived_players_kit_attacking_team_scout": 43,
            "losses_kit_attacking_team_scout": 4,
            "kills_kit_attacking_team_scout": 5,
            "deaths_kit_attacking_team_scout": 4,
            "games_kit_attacking_team_scout": 1,
            "assists_kit_attacking_team_scout": 1,
            "votes_Siege": 1,
            "deaths_kit_advanced_solo_cannoneer": 2,
            "kills_kit_advanced_solo_cannoneer": 1,
            "losses_kit_advanced_solo_cannoneer": 2,
            "survived_players_kit_advanced_solo_cannoneer": 17,
            "games_kit_advanced_solo_cannoneer": 2,
            "votes_Congo": 1,
            "assists_kit_mega_mega_default": 2,
            "deaths_kit_mega_mega_default": 9,
            "games_kit_mega_mega_default": 2,
            "games_mega": 7,
            "losses_mega_normal": 28,
            "deaths_mega": 33,
            "losses_mega": 28,
            "losses_kit_mega_mega_default": 8,
            "survived_players_mega": 1596,
            "deaths_mega_normal": 33,
            "assists_mega": 11,
            "survived_players_kit_mega_mega_default": 407,
            "losses_kit_supporting_team_healer": 2,
            "assists_kit_supporting_team_healer": 1,
            "survived_players_kit_supporting_team_healer": 16,
            "deaths_kit_supporting_team_healer": 2,
            "wins_team_normal": 327,
            "votes_Elven": 1,
            "mega_ender_mastery": 0,
            "team_mining_expertise": 0,
            "solo_mining_expertise": 0,
            "votes_Toadstool": 1,
            "mega_rusher": 0,
            "losses_kit_defending_team_guardian": 1,
            "survived_players_kit_defending_team_guardian": 19,
            "games_kit_defending_team_guardian": 1,
            "deaths_kit_defending_team_guardian": 1,
            "votes_Overfall": 1,
            "survived_players_kit_advanced_solo_farmer": 21,
            "deaths_kit_advanced_solo_farmer": 3,
            "losses_kit_advanced_solo_farmer": 3,
            "kills_kit_supporting_team_enchanter": 8,
            "games_kit_supporting_team_enchanter": 3,
            "wins_kit_supporting_team_enchanter": 3,
            "survived_players_kit_supporting_team_enchanter": 77,
            "deaths_kit_supporting_team_enchanter": 3,
            "losses_kit_supporting_team_enchanter": 3,
            "assists_kit_supporting_team_enchanter": 1,
            "kills_kit_mining_team_speleologist": 199,
            "deaths_kit_mining_team_speleologist": 156,
            "survived_players_kit_mining_team_speleologist": 1923,
            "losses_kit_mining_team_speleologist": 145,
            "assists_kit_mining_team_speleologist": 67,
            "games_kit_mining_team_speleologist": 55,
            "wins_kit_mining_team_speleologist": 29,
            "deaths_kit_mining_team_cannoneer": 2,
            "survived_players_kit_mining_team_cannoneer": 20,
            "wins_kit_mining_team_cannoneer": 1,
            "games_kit_mining_team_cannoneer": 1,
            "losses_kit_mining_team_cannoneer": 1,
            "team_resistance_boost": 0,
            "votes_Dwarven": 1,
            "votes_Dragonice": 1,
            "votes_LongIsland": 1,
            "team_arrow_recovery": 0,
            "votes_Onionring": 1,
            "mega_mining_expertise": 0,
            "mega_tank": 0,
            "activeKit_MEGA": "kit_mega_mega_knight",
            "kills_kit_mega_mega_default": 3,
            "kills_mega_normal": 29,
            "kills_mega": 29,
            "wins_mega": 6,
            "wins_kit_mega_mega_default": 1,
            "wins_mega_normal": 6,
            "kit_mega_mega_knight": 2,
            "assists_kit_mega_mega_knight": 9,
            "survived_players_kit_mega_mega_knight": 1189,
            "deaths_kit_mega_mega_knight": 24,
            "losses_kit_mega_mega_knight": 20,
            "kills_kit_mega_mega_knight": 26,
            "games_kit_mega_mega_knight": 5,
            "wins_kit_mega_mega_knight": 5,
            "votes_Dwarf Fortress": 1,
            "votes_Steampunk": 1,
            "kills_kit_advanced_solo_farmer": 3,
            "games_kit_advanced_solo_farmer": 1,
            "kills_kit_basic_solo_speleologist": 582,
            "wins_kit_basic_solo_speleologist": 80,
            "survived_players_kit_basic_solo_speleologist": 2724,
            "games_kit_basic_solo_speleologist": 157,
            "losses_kit_basic_solo_speleologist": 384,
            "deaths_kit_basic_solo_speleologist": 384,
            "assists_kit_basic_solo_speleologist": 17,
            "mega_juggernaut": 0,
            "solo_speed_boost": 0,
            "survived_players_kit_basic_solo_troll": 4,
            "losses_kit_basic_solo_troll": 1,
            "kills_kit_basic_solo_troll": 1,
            "deaths_kit_basic_solo_troll": 1,
            "solo_juggernaut": 0,
            "harvesting_season": 0,
            "survived_players_kit_attacking_team_knight": 11949,
            "games_kit_attacking_team_knight": 416,
            "wins_kit_attacking_team_knight": 271,
            "kills_kit_attacking_team_knight": 1199,
            "losses_kit_attacking_team_knight": 618,
            "deaths_kit_attacking_team_knight": 692,
            "assists_kit_attacking_team_knight": 283,
            "kills_kit_attacking_team_hunter": 2,
            "losses_kit_attacking_team_hunter": 2,
            "survived_players_kit_attacking_team_hunter": 24,
            "deaths_kit_attacking_team_hunter": 2,
            "assists_kit_attacking_team_hunter": 2,
            "votes_Shire": 1,
            "votes_Shattered": 1,
            "assists_kit_attacking_team_snowman": 2,
            "deaths_kit_attacking_team_snowman": 2,
            "survived_players_kit_attacking_team_snowman": 80,
            "losses_kit_attacking_team_snowman": 2,
            "kills_kit_attacking_team_snowman": 4,
            "wins_kit_attacking_team_snowman": 2,
            "games_kit_attacking_team_snowman": 2,
            "solo_blazing_arrows": 0,
            "votes_Temple": 1,
            "survived_players_kit_defending_team_baseball-player": 69,
            "kills_kit_defending_team_baseball-player": 8,
            "games_kit_defending_team_baseball-player": 2,
            "wins_kit_defending_team_baseball-player": 2,
            "deaths_kit_defending_team_baseball-player": 2,
            "losses_kit_defending_team_baseball-player": 2,
            "solo_arrow_recovery": 0,
            "solo_bulldozer": 0,
            "votes_Frostbite": 1,
            "mega_arrow_recovery": 0,
            "votes_Atuin": 1,
            "mega_blazing_arrows": 0,
            "votes_Strata": 1,
            "votes_Skychurch": 1,
            "extra_wheels": 4,
            "deaths_kit_supporting_team_ecologist": 1,
            "losses_kit_supporting_team_ecologist": 1,
            "survived_players_kit_supporting_team_ecologist": 6,
            "kills_weekly_a": 118,
            "kills_monthly_b": 96,
            "kills_weekly_b": 51,
            "kills_monthly_a": 73,
            "winstreak": 3,
            "highestWinstreak": 2,
            "killstreak": 7,
            "highestKillstreak": 3,
            "killstreak_team": 5,
            "winstreak_team": 4,
            "killstreak_kit_attacking_team_knight": 5,
            "winstreak_kit_attacking_team_knight": 4,
            "deaths_kit_ranked_ranked_default": 1,
            "survived_players_kit_ranked_ranked_default": 2,
            "games_ranked": 10,
            "losses_ranked_normal": 9,
            "deaths_ranked": 9,
            "losses_ranked": 9,
            "games_kit_ranked_ranked_default": 1,
            "deaths_ranked_normal": 9,
            "survived_players_ranked": 24,
            "losses_kit_ranked_ranked_default": 1,
            "activeKit_RANKED": "kit_blacksmith_ranked_blacksmith",
            "losses_kit_blacksmith_ranked_blacksmith": 8,
            "games_kit_blacksmith_ranked_blacksmith": 9,
            "deaths_kit_blacksmith_ranked_blacksmith": 8,
            "survived_players_kit_blacksmith_ranked_blacksmith": 22,
            "combatTracker": true,
            "killstreak_solo": 10,
            "winstreak_kit_basic_solo_speleologist": 1,
            "winstreak_solo": 3,
            "killstreak_kit_basic_solo_speleologist": 3,
            "winstreak_ranked": 4,
            "wins_ranked_normal": 4,
            "kills_ranked_normal": 7,
            "killstreak_ranked": 6,
            "killstreak_kit_blacksmith_ranked_blacksmith": 6,
            "wins_kit_blacksmith_ranked_blacksmith": 4,
            "kills_ranked": 7,
            "winstreak_kit_blacksmith_ranked_blacksmith": 4,
            "kills_kit_blacksmith_ranked_blacksmith": 7,
            "wins_ranked": 4,
            "solo_knowledge": 0,
            "team_savior": 0,
            "solo_annoy-o-mite": 0,
            "team_knowledge": 0,
            "survived_players_kit_basic_solo_princess": 36,
            "chests_opened_solo": 134,
            "losses_kit_basic_solo_princess": 4,
            "time_played_solo": 3806,
            "chests_opened_kit_basic_solo_princess": 19,
            "chests_opened": 149,
            "time_played": 5020,
            "time_played_kit_basic_solo_princess": 584,
            "games_kit_basic_solo_princess": 4,
            "deaths_kit_basic_solo_princess": 4,
            "longest_bow_shot": 29,
            "longest_bow_shot_kit_basic_solo_princess": 26,
            "longest_bow_shot_solo": 29,
            "arrows_hit_solo": 9,
            "arrows_shot_kit_basic_solo_princess": 25,
            "arrows_hit_kit_basic_solo_princess": 6,
            "arrows_shot_solo": 34,
            "solo_lucky_charm": 0,
            "games_played_skywars": 159,
            "fastest_win": 139,
            "fastest_win_kit_basic_solo_princess": 186,
            "fastest_win_solo": 139,
            "lastMode": "SOLO",
            "melee_kills_solo": 21,
            "assists_kit_basic_solo_princess": 1,
            "kills_kit_basic_solo_princess": 4,
            "winstreak_kit_basic_solo_princess": 1,
            "melee_kills": 23,
            "most_kills_game_solo": 15,
            "wins_kit_basic_solo_princess": 1,
            "most_kills_game": 21,
            "killstreak_kit_basic_solo_princess": 3,
            "most_kills_game_kit_basic_solo_princess": 3,
            "melee_kills_kit_basic_solo_princess": 3,
            "void_kills_kit_basic_solo_princess": 1,
            "void_kills": 8,
            "void_kills_solo": 5,
            "solo_nourishment": 0,
            "deaths_kit_basic_solo_frog": 16,
            "survived_players_kit_basic_solo_frog": 76,
            "chests_opened_kit_basic_solo_frog": 53,
            "time_played_kit_basic_solo_frog": 1459,
            "losses_kit_basic_solo_frog": 16,
            "games_kit_basic_solo_frog": 14,
            "longest_bow_shot_kit_mega_mega_knight": 57,
            "longest_bow_shot_mega": 57,
            "melee_kills_kit_mega_mega_knight": 1,
            "chests_opened_mega": 1,
            "most_kills_game_mega": 3,
            "melee_kills_mega": 1,
            "void_kills_mega": 1,
            "arrows_shot_kit_mega_mega_knight": 12,
            "arrows_shot_mega": 12,
            "chests_opened_kit_mega_mega_knight": 1,
            "most_kills_game_kit_mega_mega_knight": 3,
            "time_played_kit_mega_mega_knight": 512,
            "void_kills_kit_mega_mega_knight": 1,
            "arrows_hit_mega": 2,
            "arrows_hit_kit_mega_mega_knight": 2,
            "time_played_mega": 512,
            "tnt_madness_explained": 40,
            "fastest_win_kit_attacking_team_knight": 333,
            "fastest_win_team": 333,
            "time_played_kit_attacking_team_knight": 58,
            "chests_opened_team": 4,
            "time_played_team": 357,
            "chests_opened_kit_attacking_team_knight": 1,
            "kill_by_color_explained": 3,
            "kill_by_color_explained_last": 1501880108255,
            "floor_is_lava_explained_last": 1502347569936,
            "floor_is_lava_explained": 3,
            "tnt_madness_explained_last": 1501990376521,
            "chests_opened_ranked": 10,
            "time_played_ranked": 345,
            "most_kills_game_kit_blacksmith_ranked_blacksmith": 1,
            "melee_kills_ranked": 1,
            "melee_kills_kit_blacksmith_ranked_blacksmith": 1,
            "time_played_kit_blacksmith_ranked_blacksmith": 345,
            "most_kills_game_ranked": 1,
            "chests_opened_kit_blacksmith_ranked_blacksmith": 10,
            "rush_explained_last": 1533000015178,
            "rush_explained": 1,
            "win_streak_lab": 0,
            "survived_players_lab_solo": 224,
            "chests_opened_lab_solo": 105,
            "chests_opened_lab_kit_basic_solo_frog": 102,
            "deaths_lab": 43,
            "deaths_lab_solo": 32,
            "time_played_lab_solo": 3461,
            "time_played_lab": 4764,
            "losses_lab_kit_basic_solo_frog": 32,
            "coins_gained_lab": 17124,
            "survived_players_lab": 414,
            "losses_lab_solo": 32,
            "chests_opened_lab": 132,
            "survived_players_lab_kit_basic_solo_frog": 213,
            "losses_lab": 42,
            "quits_lab": 31,
            "enderpearls_thrown_lab": 63,
            "time_played_lab_kit_basic_solo_frog": 3280,
            "deaths_lab_kit_basic_solo_frog": 32,
            "games_lab": 20,
            "assists_lab_solo": 1,
            "assists_lab": 3,
            "games_lab_solo": 15,
            "assists_lab_kit_basic_solo_frog": 1,
            "games_lab_kit_basic_solo_frog": 14,
            "kills_lab_kit_basic_solo_frog": 33,
            "blocks_broken_lab": 14,
            "souls_gathered_lab": 12,
            "kills_lab": 44,
            "egg_thrown_lab": 18,
            "most_kills_game_lab_solo": 28,
            "melee_kills_lab_solo": 16,
            "kills_lab_solo": 34,
            "melee_kills_lab_kit_basic_solo_frog": 16,
            "most_kills_game_lab_kit_basic_solo_frog": 28,
            "most_kills_game_lab": 34,
            "melee_kills_lab": 20,
            "souls_lab": 6,
            "void_kills_lab": 24,
            "void_kills_lab_kit_basic_solo_frog": 17,
            "void_kills_lab_solo": 18,
            "blocks_placed_lab": 90,
            "items_enchanted_lab": 2,
            "chests_opened_lab_team": 27,
            "survived_players_lab_team": 190,
            "time_played_lab_team": 1303,
            "time_played_lab_kit_attacking_team_default": 1303,
            "survived_players_lab_kit_attacking_team_default": 190,
            "deaths_lab_kit_attacking_team_default": 11,
            "losses_lab_team": 10,
            "losses_lab_kit_attacking_team_default": 10,
            "deaths_lab_team": 11,
            "chests_opened_lab_kit_attacking_team_default": 27,
            "arrows_shot_lab_team": 5,
            "arrows_shot_lab": 25,
            "arrows_shot_lab_kit_attacking_team_default": 5,
            "void_kills_lab_kit_attacking_team_default": 6,
            "most_kills_game_lab_kit_attacking_team_default": 6,
            "kills_lab_kit_attacking_team_default": 10,
            "most_kills_game_lab_team": 6,
            "kills_lab_team": 10,
            "void_kills_lab_team": 6,
            "games_lab_kit_attacking_team_default": 5,
            "games_lab_team": 5,
            "fastest_win_lab_kit_attacking_team_default": 223,
            "longest_bow_shot_lab": 39,
            "longest_bow_shot_lab_kit_attacking_team_default": 31,
            "fastest_win_lab_team": 223,
            "fastest_win_lab": 181,
            "longest_bow_shot_lab_team": 31,
            "arrows_hit_lab_team": 1,
            "wins_lab": 9,
            "killstreak_lab": 21,
            "killstreak_lab_kit_attacking_team_default": 7,
            "winstreak_lab_kit_attacking_team_default": 4,
            "winstreak_lab": 9,
            "wins_lab_kit_attacking_team_default": 4,
            "winstreak_lab_team": 4,
            "killstreak_lab_team": 7,
            "arrows_hit_lab": 7,
            "wins_lab_team": 4,
            "arrows_hit_lab_kit_attacking_team_default": 1,
            "team_bridger": 0,
            "mega_bridger": 0,
            "team_lucky_charm": 0,
            "slime_explained_last": 1533000021202,
            "slime_explained": 1,
            "longest_bow_shot_kit_basic_solo_frog": 29,
            "arrows_shot_kit_basic_solo_frog": 9,
            "arrows_hit_kit_basic_solo_frog": 3,
            "longest_bow_shot_team": 10,
            "longest_bow_shot_kit_attacking_team_default": 10,
            "arrows_shot_team": 1,
            "most_kills_game_kit_attacking_team_default": 2,
            "arrows_hit_team": 1,
            "time_played_kit_attacking_team_default": 219,
            "losses_kit_attacking_team_default": 1,
            "most_kills_game_team": 2,
            "arrows_shot_kit_attacking_team_default": 1,
            "deaths_kit_attacking_team_default": 1,
            "chests_opened_kit_attacking_team_default": 2,
            "games_kit_attacking_team_default": 1,
            "void_kills_kit_attacking_team_default": 2,
            "survived_players_kit_attacking_team_default": 10,
            "arrows_hit_kit_attacking_team_default": 1,
            "kills_kit_attacking_team_default": 2,
            "void_kills_team": 2,
            "blizzard_explained_last": 1502346989218,
            "blizzard_explained": 1,
            "assists_lab_kit_attacking_team_default": 2,
            "melee_kills_lab_team": 4,
            "assists_lab_team": 2,
            "melee_kills_lab_kit_attacking_team_default": 4,
            "most_kills_game_kit_basic_solo_frog": 1,
            "melee_kills_kit_basic_solo_frog": 4,
            "kills_kit_basic_solo_frog": 5,
            "void_kills_kit_basic_solo_frog": 1,
            "fastest_win_lab_kit_basic_solo_frog": 229,
            "fastest_win_lab_solo": 181,
            "winstreak_lab_kit_basic_solo_frog": 4,
            "lab_win_slime_lab": 6,
            "winstreak_lab_solo": 5,
            "killstreak_lab_kit_basic_solo_frog": 13,
            "lab_win_slime_lab_solo": 4,
            "killstreak_lab_solo": 14,
            "lab_win_slime_lab_kit_basic_solo_frog": 4,
            "wins_lab_kit_basic_solo_frog": 4,
            "wins_lab_solo": 5,
            "arrows_shot_lab_solo": 20,
            "arrows_shot_lab_kit_basic_solo_frog": 20,
            "arrows_hit_lab_kit_basic_solo_frog": 6,
            "arrows_hit_lab_solo": 6,
            "longest_bow_shot_lab_kit_basic_solo_frog": 39,
            "longest_bow_shot_lab_solo": 39,
            "lab_win_slime_lab_kit_attacking_team_default": 2,
            "lab_win_slime_lab_team": 2,
            "activeKit_TEAMS": "kit_defending_team_frog",
            "survived_players_kit_defending_team_frog": 10,
            "time_played_kit_defending_team_frog": 80,
            "deaths_kit_defending_team_frog": 2,
            "losses_kit_defending_team_frog": 2,
            "chests_opened_kit_defending_team_frog": 1,
            "inGamePresentsCap_2017_3": 10,
            "longest_bow_kill_kit_basic_solo_ecologist": 3,
            "longest_bow_kill": 4,
            "longest_bow_kill_solo": 4,
            "most_kills_game_kit_basic_solo_ecologist": 7,
            "time_played_kit_basic_solo_ecologist": 1454,
            "chests_opened_kit_basic_solo_ecologist": 52,
            "melee_kills_kit_basic_solo_ecologist": 9,
            "void_kills_kit_basic_solo_ecologist": 3,
            "lucky_explained_last": 1516903064289,
            "lucky_explained": 11,
            "freeLootChestNpc": 1516902767294,
            "skywars_chests": 38,
            "SkyWars_openedChests": 143,
            "SkyWars_openedCommons": 71,
            "skywars_chest_history": [
                "killeffect_snow_globe",
                "deathcry_grumble",
                "deathcry_enderman",
                "balloon_red_skull",
                "sprays_snowball_fight"
            ],
            "SkyWars_openedRares": 44,
            "cosmetic_tokens": 163000,
            "fastest_win_lab_kit_basic_solo_ecologist": 181,
            "lab_win_lucky_blocks_lab_kit_basic_solo_ecologist": 1,
            "wins_lab_kit_basic_solo_ecologist": 1,
            "chests_opened_lab_kit_basic_solo_ecologist": 3,
            "time_played_lab_kit_basic_solo_ecologist": 181,
            "killstreak_lab_kit_basic_solo_ecologist": 1,
            "games_lab_kit_basic_solo_ecologist": 1,
            "void_kills_lab_kit_basic_solo_ecologist": 1,
            "kills_lab_kit_basic_solo_ecologist": 1,
            "lab_win_lucky_blocks_lab_solo": 1,
            "lab_win_lucky_blocks_lab": 1,
            "survived_players_lab_kit_basic_solo_ecologist": 11,
            "winstreak_lab_kit_basic_solo_ecologist": 1,
            "refill_chest_destroy": 2,
            "longest_bow_kill_kit_basic_solo_rookie": 4,
            "fastest_win_kit_basic_solo_rookie": 139,
            "most_kills_game_kit_basic_solo_rookie": 4,
            "games_kit_basic_solo_rookie": 2,
            "survived_players_kit_basic_solo_rookie": 26,
            "kills_kit_basic_solo_rookie": 5,
            "time_played_kit_basic_solo_rookie": 309,
            "wins_kit_basic_solo_rookie": 1,
            "winstreak_kit_basic_solo_rookie": 1,
            "killstreak_kit_basic_solo_rookie": 4,
            "chests_opened_kit_basic_solo_rookie": 10,
            "melee_kills_kit_basic_solo_rookie": 5,
            "SkyWars_openedEpics": 25,
            "active_balloon": "balloon_clouds",
            "solo_fat": 0,
            "team_nourishment": 0,
            "solo_bridger": 0,
            "team_black_magic": 0,
            "skywars_easter_boxes": 0,
            "hunters_vs_beasts_explained_last": 1527646470738,
            "hunters_vs_beasts_explained": 1,
            "losses_kit_basic_solo_rookie": 2,
            "deaths_kit_basic_solo_rookie": 2,
            "activeKit_SOLO_random": false,
            "SkyWars_openedLegendaries": 4,
            "team_speed_boost": 0,
            "team_bulldozer": 0,
            "levelFormatted": "§610⋆",
            "team_marksmanship": 0,
            "solo_black_magic": 0,
            "team_annoy-o-mite": 0,
            "skywars_experience": 6771,
            "team_fat": 0,
            "skywars_halloween_boxes": 20,
            "skywars_christmas_boxes": 5,
            "free_event_key_skywars_christmas_boxes_2019": true,
            "opals": 2,
            "perkslot": {
                "normal": {
                    "1": "solo_bulldozer",
                    "2": "solo_juggernaut",
                    "3": "solo_resistance_boost",
                    "4": "solo_savior",
                    "5": "solo_fat"
                },
                "insane": {
                    "1": "team_bulldozer",
                    "2": "team_juggernaut",
                    "3": "team_resistance_boost",
                    "4": "team_savior",
                    "5": "team_fat"
                }
            },
            "toggle_solo_marksmanship": false,
            "toggle_solo_arrow_recovery": false,
            "toggle_solo_juggernaut": true,
            "toggle_solo_speed_boost": false,
            "toggle_solo_savior": true,
            "toggle_solo_blazing_arrows": false,
            "toggle_solo_resistance_boost": true,
            "toggle_solo_revenge": false,
            "toggle_solo_annoy-o-mite": false,
            "toggle_solo_bridger": false,
            "toggle_solo_environmental_expert": false,
            "toggle_solo_robbery": false,
            "toggle_solo_necromancer": false,
            "toggle_mega_arrow_recovery": false,
            "toggle_solo_barbarian": false,
            "toggle_solo_nourishment": false,
            "toggle_mega_juggernaut": false,
            "toggle_solo_fat": true,
            "toggle_solo_frost": false,
            "toggle_mega_blazing_arrows": false,
            "toggle_mega_rusher": false,
            "toggle_mega_notoriety": false,
            "toggle_mega_nourishment": false,
            "toggle_mega_tank": false,
            "toggle_mega_environmental_expert": false,
            "toggle_mega_bridger": false,
            "toggle_mega_necromancer": false,
            "toggle_mega_lucky_charm": false,
            "toggle_mega_black_magic": false,
            "toggle_solo_bulldozer": true,
            "toggle_ranked_bowman_perk": false,
            "toggle_ranked_scout_perk": false,
            "toggle_ranked_champion_perk": false,
            "toggle_ranked_armorer_perk": false,
            "toggle_ranked_blacksmith_perk": false,
            "toggle_solo_knowledge": false,
            "toggle_ranked_paladin_perk": false,
            "toggle_ranked_pyromancer_perk": false,
            "toggle_mega_mining_expertise": false,
            "toggle_ranked_arrow_recovery": false,
            "toggle_ranked_juggernaut": false,
            "toggle_ranked_last_stand": false,
            "toggle_solo_black_magic": false,
            "solo_savior": 0,
            "toggle_ranked_magician_perk": false,
            "toggle_ranked_tough_skin": false,
            "toggle_ranked_athlete_perk": false,
            "toggle_team_arrow_recovery": false,
            "toggle_ranked_environmental_expert": false,
            "toggle_ranked_blazing_arrows": false,
            "toggle_team_blazing_arrows": false,
            "toggle_team_bulldozer": true,
            "toggle_ranked_mining_expertise": false,
            "toggle_team_juggernaut": true,
            "toggle_ranked_rusher": false,
            "toggle_ranked_bridger": false,
            "toggle_ranked_hound_perk": false,
            "toggle_team_mining_expertise": false,
            "toggle_team_resistance_boost": true,
            "toggle_team_speed_boost": false,
            "toggle_team_annoy-o-mite": false,
            "toggle_team_knowledge": false,
            "toggle_team_savior": true,
            "toggle_ranked_healer_perk": false,
            "toggle_team_marksmanship": false,
            "toggle_team_nourishment": false,
            "toggle_team_fat": true,
            "toggle_team_environmental_expert": false,
            "toggle_mega_marksmanship": false,
            "toggle_team_necromancer": false,
            "toggle_team_black_magic": false,
            "toggle_team_robbery": false,
            "toggle_team_bridger": false,
            "toggle_solo_mining_expertise": false,
            "toggle_team_barbarian": false,
            "shard": 0,
            "toggle_team_frost": false,
            "toggle_team_diamondpiercer": false,
            "toggle_team_lucky_charm": false,
            "toggle_solo_lucky_charm": false
        },
        "TrueCombat": {
            "win_streak": 0,
            "games": 14,
            "crazywalls_losses_solo": 12,
            "items_enchanted": 71,
            "deaths": 14,
            "coins": 1,
            "crazywalls_deaths_solo": 5,
            "losses": 32,
            "crazywalls_games_solo": 5,
            "survived_players": 189,
            "packages": [
                "cw_ach_flag1",
                "cw_ach_flag2",
                "cw_ach_flag3",
                "kit_attacking_team_cannoneer",
                "kit_basic_solo_looter",
                "cw_ach_flag5",
                "cw_ach_flag4",
                "converted_coins_to_arcade"
            ],
            "crazywalls_deaths_team": 2,
            "crazywalls_losses_team": 6,
            "crazywalls_games_team": 2,
            "crazywalls_losses_solo_chaos": 12,
            "crazywalls_deaths_team_chaos": 2,
            "crazywalls_games_team_chaos": 2,
            "crazywalls_losses_team_chaos": 2,
            "golden_skulls": 0,
            "arrows_shot": 16,
            "kills": 22,
            "crazywalls_wins_team_chaos": 1,
            "crazywalls_kills_monthly_b_team_chaos": 6,
            "wins": 2,
            "crazywalls_kills_team_chaos": 6,
            "crazywalls_kills_weekly_a_team_chaos": 6,
            "giant_zombie": 5,
            "solo_chaos_bounty_hunter": 0,
            "show_noob_holograms": true,
            "crazywalls_games_solo_chaos": 5,
            "crazywalls_deaths_solo_chaos": 5,
            "crazywalls_kills_monthly_b_solo_chaos": 9,
            "skulls_gathered": 2,
            "crazywalls_kills_solo_chaos": 9,
            "crazywalls_kills_weekly_a_solo_chaos": 9,
            "team_swiftness": 0,
            "crazywalls_wins_solo_chaos": 1,
            "giant_zombie_rares": 1,
            "team_smart_mining": 0,
            "giant_zombie_legendaries": 1,
            "activeKit_Solo": "kit_basic_solo_looter",
            "crazywalls_kills_monthly_b_solo": 4,
            "crazywalls_kills_solo": 4,
            "crazywalls_kills_weekly_a_solo": 4,
            "kit_basic_chaos_alchemist": 0,
            "crazywalls_kills_weekly_b_team": 3,
            "crazywalls_kills_team": 3,
            "arrows_hit": 1,
            "crazywalls_kills_monthly_a_team": 3,
            "activeKit_Team_chaos": "kit_basic_chaos_alchemist",
            "kills_weekly_a": 1,
            "kills_monthly_b": 1
        },
        "SuperSmash": {
            "win_streak": 0,
            "damage_dealt_teams": 8760,
            "class_stats": {
                "BOTMUN": {
                    "batarang": {
                        "kills": 1,
                        "damage_dealt": 58,
                        "kills_teams": 1,
                        "damage_dealt_teams": 58
                    },
                    "games": 1,
                    "kills_teams": 1,
                    "botmubile": {
                        "damage_dealt_teams": 90,
                        "damage_dealt": 90
                    },
                    "kills": 1,
                    "damage_dealt_teams": 148,
                    "games_teams": 1,
                    "damage_dealt": 148,
                    "losses_teams": 1,
                    "losses": 1
                },
                "GENERAL_CLUCK": {
                    "bazooka": {
                        "damage_dealt_teams": 3976,
                        "damage_dealt": 3976,
                        "kills": 29,
                        "kills_teams": 29,
                        "smasher_teams": 20,
                        "smasher": 20,
                        "smashed": 1,
                        "smashed_teams": 1
                    },
                    "egg_bazooka": {
                        "damage_dealt": 712,
                        "damage_dealt_teams": 712,
                        "kills_teams": 3,
                        "kills": 3
                    },
                    "damage_dealt_teams": 5980,
                    "reinforcements": {
                        "damage_dealt": 1288,
                        "damage_dealt_teams": 1288,
                        "kills": 13,
                        "kills_teams": 13,
                        "smasher": 6,
                        "smashed_teams": 3,
                        "smashed": 3,
                        "smasher_teams": 6
                    },
                    "games": 25,
                    "losses": 17,
                    "games_teams": 25,
                    "melee": {
                        "damage_dealt_teams": 4,
                        "damage_dealt": 4,
                        "smashed_teams": 4,
                        "smashed": 4
                    },
                    "losses_teams": 17,
                    "kills_teams": 45,
                    "damage_dealt": 5980,
                    "kills": 45,
                    "deaths": 59,
                    "smashed": 29,
                    "smashed_teams": 29,
                    "deaths_teams": 59,
                    "smasher": 26,
                    "smasher_teams": 26,
                    "homing_missiles": {
                        "smashed": 3,
                        "smashed_teams": 3
                    },
                    "win_streak_teams": 8,
                    "wins_teams": 8,
                    "win_streak": 8,
                    "wins": 8,
                    "ki_blast": {
                        "smashed_teams": 1,
                        "smashed": 1
                    },
                    "monster_mash": {
                        "smashed_teams": 1,
                        "smashed": 1
                    },
                    "laser_cannon": {
                        "smashed_teams": 5,
                        "smashed": 5
                    },
                    "boulder": {
                        "smashed_teams": 1,
                        "smashed": 1
                    },
                    "force_lightning": {
                        "smashed_teams": 1,
                        "smashed": 1
                    },
                    "botmubile": {
                        "smashed": 2,
                        "smashed_teams": 2
                    },
                    "seismic_slam": {
                        "smashed_teams": 1,
                        "smashed": 1
                    },
                    "rocket_punch": {
                        "smashed": 1,
                        "smashed_teams": 1
                    },
                    "force_pull": {
                        "smashed": 2,
                        "smashed_teams": 2
                    },
                    "batarang": {
                        "smashed": 2,
                        "smashed_teams": 2
                    },
                    "web_shot": {
                        "smashed_teams": 1,
                        "smashed": 1
                    }
                },
                "MARAUDER": {
                    "smashed_teams": 18,
                    "deaths_teams": 30,
                    "losses": 33,
                    "melee": {
                        "smashed_teams": 1,
                        "damage_dealt_teams": 709,
                        "smashed": 11,
                        "damage_dealt": 4488,
                        "smasher": 25,
                        "smasher_teams": 5,
                        "kills": 45,
                        "kills_teams": 8,
                        "damage_dealt_normal": 3779,
                        "smashed_normal": 10,
                        "smasher_normal": 20,
                        "kills_normal": 37
                    },
                    "force_pull": {
                        "smashed_teams": 2,
                        "smashed": 3,
                        "damage_dealt": 2627,
                        "damage_dealt_teams": 634,
                        "kills": 55,
                        "smasher": 36,
                        "kills_teams": 9,
                        "smasher_teams": 7,
                        "damage_dealt_normal": 1993,
                        "smasher_normal": 29,
                        "kills_normal": 46,
                        "smashed_normal": 1
                    },
                    "force_lightning": {
                        "damage_dealt": 6049,
                        "damage_dealt_teams": 1289,
                        "kills": 57,
                        "kills_teams": 14,
                        "smashed": 4,
                        "smasher": 20,
                        "smasher_teams": 3,
                        "smashed_teams": 2,
                        "damage_dealt_normal": 4760,
                        "smashed_normal": 2,
                        "kills_normal": 43,
                        "smasher_normal": 17
                    },
                    "smashed": 72,
                    "damage_dealt": 13164,
                    "damage_dealt_teams": 2632,
                    "games_teams": 13,
                    "deaths": 124,
                    "losses_teams": 8,
                    "games": 56,
                    "kills_teams": 31,
                    "wins_teams": 5,
                    "reinforcements": {
                        "smashed_teams": 1,
                        "smashed": 1
                    },
                    "wins": 23,
                    "kills": 157,
                    "win_streak": 23,
                    "win_streak_teams": 5,
                    "smasher": 81,
                    "botmubile": {
                        "smashed_teams": 1,
                        "smashed": 2,
                        "smashed_normal": 1
                    },
                    "smasher_teams": 15,
                    "bazooka": {
                        "smashed_teams": 2,
                        "smashed": 2
                    },
                    "frostbolt": {
                        "smashed": 6,
                        "smashed_teams": 2,
                        "smashed_normal": 4
                    },
                    "laser_cannon": {
                        "smashed": 5,
                        "smashed_teams": 2,
                        "smashed_normal": 3
                    },
                    "seismic_slam": {
                        "smashed_teams": 1,
                        "smashed": 1
                    },
                    "batarang": {
                        "smashed_teams": 3,
                        "smashed": 13,
                        "smashed_normal": 10
                    },
                    "overload": {
                        "smashed": 2,
                        "smashed_teams": 1,
                        "smashed_normal": 1
                    },
                    "games_normal": 43,
                    "smasher_normal": 66,
                    "kills_normal": 126,
                    "deaths_normal": 94,
                    "smashed_normal": 54,
                    "damage_dealt_normal": 10532,
                    "losses_normal": 25,
                    "wins_normal": 18,
                    "win_streak_normal": 18,
                    "throw_cake": {
                        "smashed": 2,
                        "smashed_normal": 2
                    },
                    "spider_kick": {
                        "smashed_normal": 3,
                        "smashed": 3
                    },
                    "homing_missiles": {
                        "smashed": 3,
                        "smashed_normal": 3
                    },
                    "freezing_breath": {
                        "smashed_normal": 3,
                        "smashed": 3
                    },
                    "desert_eagle": {
                        "smashed_normal": 2,
                        "smashed": 2
                    },
                    "flaming_desert_eagle": {
                        "smashed": 2,
                        "smashed_normal": 2
                    },
                    "monster_mash": {
                        "smashed_normal": 3,
                        "smashed": 3
                    },
                    "rocket_punch": {
                        "smashed": 1,
                        "smashed_normal": 1
                    },
                    "cake_storm": {
                        "smashed": 1,
                        "smashed_normal": 1
                    },
                    "monster_charge": {
                        "smashed": 1,
                        "smashed_normal": 1
                    },
                    "void_slash": {
                        "smashed_normal": 1,
                        "smashed": 1
                    }
                }
            },
            "damage_dealt": 19292,
            "losses_teams": 26,
            "coins": 180519,
            "losses_weekly_b": 14,
            "losses_monthly_b": 45,
            "kills_teams": 77,
            "losses": 51,
            "games_monthly_b": 73,
            "kills_monthly_b": 173,
            "kills": 203,
            "games_weekly_b": 19,
            "deaths_teams": 98,
            "deaths": 192,
            "games_teams": 39,
            "games": 82,
            "kills_weekly_b": 50,
            "xp_BOTMUN": 45,
            "lastLevel_THE_BULK": 0,
            "smashLevel": 19,
            "active_class": "MARAUDER",
            "xp_GENERAL_CLUCK": 1312,
            "lastLevel_GENERAL_CLUCK": 7,
            "votes_Triplets": 1,
            "smasher": 107,
            "smashed_teams": 47,
            "losses_weekly_a": 37,
            "games_weekly_a": 63,
            "smasher_teams": 41,
            "smashed": 101,
            "kills_weekly_a": 153,
            "smash_level_total": 19,
            "quits": 16,
            "wins": 31,
            "wins_weekly_a": 26,
            "wins_monthly_b": 28,
            "wins_teams": 13,
            "classes": {
                "MARAUDER": true
            },
            "lastLevel_MARAUDER": 12,
            "xp_MARAUDER": 4056,
            "votes_Strawberry Towers": 1,
            "smasher_normal": 66,
            "losses_normal": 25,
            "smashed_normal": 54,
            "deaths_normal": 94,
            "games_normal": 43,
            "kills_normal": 126,
            "damage_dealt_normal": 10532,
            "wins_normal": 18,
            "wins_weekly_b": 5,
            "games_monthly_a": 9,
            "kills_monthly_a": 30,
            "losses_monthly_a": 6,
            "wins_monthly_a": 3,
            "votes_Cosmos": 1
        },
        "SpeedUHC": {
            "firstJoinLobbyInt": 5,
            "survived_players_normal": 32,
            "wins_normal": 1,
            "coins": 22460,
            "games_solo": 1,
            "kills_monthly_a": 3,
            "wins": 1,
            "kills_solo_normal": 3,
            "wins_mastery_wild_specialist": 1,
            "survived_players_solo": 33,
            "games_normal": 1,
            "kills_mastery_wild_specialist": 3,
            "wins_kit_basic_normal_default": 1,
            "kills_weekly_b": 3,
            "kills": 3,
            "killstreak_solo": 3,
            "tears_gathered": 6,
            "killstreak": 0,
            "winstreak_solo": 1,
            "winstreak": 0,
            "wins_solo_normal": 1,
            "blocks_broken": 1080,
            "kills_solo": 3,
            "tears": 6,
            "killstreak_kit_basic_normal_default": 3,
            "winstreak_kit_basic_normal_default": 1,
            "wins_solo": 1,
            "winstreak_normal": 1,
            "games_kit_basic_normal_default": 1,
            "survived_players_kit_basic_normal_default": 32,
            "games": 1,
            "killstreak_normal": 3,
            "survived_players": 33,
            "kills_normal": 3,
            "blocks_placed": 6,
            "kills_kit_basic_normal_default": 3,
            "highestWinstreak": 1,
            "highestKillstreak": 3,
            "win_streak": 0,
            "deaths_solo_normal": 3,
            "deaths": 4,
            "deaths_kit_basic_normal_default": 3,
            "deaths_mastery_wild_specialist": 4,
            "losses": 4,
            "deaths_solo": 4,
            "losses_mastery_wild_specialist": 4,
            "losses_kit_basic_normal_default": 3,
            "deaths_normal": 3,
            "losses_normal": 3,
            "losses_solo": 4,
            "losses_solo_normal": 3,
            "quits": 4,
            "packages": [
                "kit_basic_normal_enchanter",
                "kit_basic_insane_pyro",
                "kit_basic_normal_scout",
                "kit_basic_insane_archaelogist",
                "kit_basic_normal_oink",
                "kit_basic_insane_scout",
                "kit_basic_insane_fisherman",
                "kit_basic_normal_logger",
                "kit_basic_insane_logger",
                "kit_basic_normal_archer",
                "kit_basic_normal_miner"
            ],
            "found_RARE": 6,
            "tearWellUses": 33,
            "deaths_solo_insane": 1,
            "losses_insane": 1,
            "losses_solo_insane": 1,
            "deaths_insane": 1,
            "deaths_kit_basic_insane_default": 1,
            "losses_kit_basic_insane_default": 1,
            "survived_players_insane": 1,
            "survived_players_kit_basic_insane_default": 1,
            "found_COMMON": 26,
            "salt": 300,
            "insane_knowledge": 0,
            "normal_monster_tamer": 0,
            "insane_telekinesis": 0,
            "normal_no_mercy": 0,
            "normal_low_gravity": 0,
            "found_LEGENDARY": 1,
            "normal_swimming_champion": 0,
            "normal_telekinesis": 0,
            "insane_no_mercy": 0,
            "insane_low_gravity": 0,
            "score": 13,
            "movedOver": true
        },
        "SkyClash": {
            "coins": 0,
            "card_packs": 0,
            "perk_supply_drop_new": false,
            "perk_iron_golem": 0,
            "perk_creeper": 1,
            "perk_iron_golem_new": false,
            "perk_creeper_new": false,
            "packages": [
                "tip_open_card_pack",
                "tip_edit_class",
                "tip_play_game",
                "tip_upgrade_card",
                "tip_buy_kit",
                "kit_berserker",
                "converted_coins_to_arcade"
            ],
            "perk_supply_drop": 0,
            "swordsman_inventory": {
                "LEATHER_LEGGINGS:0": "37",
                "SKULL_ITEM:3": "5",
                "POTION:9": "3",
                "SKULL_ITEM:2": "4",
                "SKULL_ITEM:1": "7",
                "IRON_SWORD:0": "0",
                "LEATHER_BOOTS:0": "36",
                "COMPASS:0": "8",
                "STONE_SWORD:0": "1",
                "LEATHER_HELMET:0": "39"
            },
            "kit_swordsman_minor": 3,
            "class_0": "berserker;HIT_AND_RUN;SHARPENED_SWORD;HEADSTART",
            "active_class": 0,
            "highestKillstreak": 3,
            "killstreak": 0,
            "play_streak": 10,
            "longest_bow_shot_kit_swordsman": 25,
            "longest_bow_shot": 20,
            "win_streak": 0,
            "bow_shots_kit_swordsman": 26,
            "deaths_kit_swordsman": 33,
            "losses": 71,
            "bow_hits": 38,
            "kills_doubles": 57,
            "games": 27,
            "kills": 65,
            "most_kills_game": 15,
            "kills_kit_swordsman": 31,
            "games_played": 80,
            "bow_hits_kit_swordsman": 16,
            "bow_shots": 67,
            "melee_kills": 42,
            "losses_doubles": 64,
            "kills_monthly_a": 64,
            "deaths": 74,
            "games_played_kit_swordsman": 34,
            "deaths_doubles": 67,
            "most_kills_game_kit_swordsman": 10,
            "melee_kills_kit_swordsman": 18,
            "kills_weekly_a": 64,
            "mobs_killed_kit_swordsman": 9,
            "mobs_killed": 11,
            "void_kills": 21,
            "void_kills_kit_swordsman": 12,
            "perk_guardian": 1,
            "perk_pearl_absorption_new": false,
            "perk_blast_protection": 0,
            "perk_pearl_absorption": 1,
            "perk_blast_protection_new": false,
            "perk_guardian_new": false,
            "playstreak": 0,
            "assists_kit_swordsman": 5,
            "assists": 13,
            "quits": 56,
            "perk_creeper_duplicates": 1,
            "perk_pacify": 1,
            "perk_blast_protection_duplicates": 2,
            "perk_pacify_new": false,
            "guardian_inventory": {
                "POTION:5": "0",
                "IRON_BOOTS:0": "36",
                "CHAINMAIL_CHESTPLATE:0": "38",
                "SKULL_ITEM:3": "3",
                "SKULL_ITEM:2": "2",
                "SKULL_ITEM:1": "1",
                "COMPASS:0": "8"
            },
            "spawn_at_witch": 1,
            "fastest_win_doubles": 157,
            "fastest_win_doubles_kit_swordsman": 255,
            "doubles_wins": 8,
            "wins": 8,
            "wins_doubles": 8,
            "doubles_wins_kit_swordsman": 2,
            "perk_marksman_duplicates": 3,
            "perk_pearl_absorption_duplicates": 2,
            "perk_enderman": 0,
            "perk_enderman_new": false,
            "enderchests_opened_kit_swordsman": 17,
            "enderchests_opened": 39,
            "perk_sharpened_sword": 1,
            "perk_guardian_duplicates": 2,
            "perk_sharpened_sword_new": false,
            "perk_hit_and_run_duplicates": 4,
            "perk_sugar_rush": 0,
            "perk_sugar_rush_new": false,
            "perk_sharpened_sword_duplicates": 2,
            "perk_sugar_rush_duplicates": 1,
            "perk_marksman": 1,
            "deaths_solo": 7,
            "losses_solo": 7,
            "kills_solo": 8,
            "perk_skeleton_jockey": 0,
            "perk_damage_potion_new": true,
            "perk_skeleton_jockey_new": true,
            "perk_damage_potion": 0,
            "perk_hit_and_run": 1,
            "perk_invisibility": 0,
            "perk_pacify_duplicates": 1,
            "perk_invisibility_new": true,
            "perk_explosive_bow": 0,
            "perk_fruit_finder_new": true,
            "perk_explosive_bow_new": true,
            "perk_resistant_duplicates": 0,
            "perk_fruit_finder": 0,
            "berserker_inventory": {
                "COOKED_BEEF:0": "26",
                "POTION:1": "0",
                "CHAINMAIL_CHESTPLATE:0": "38",
                "SKULL_ITEM:3": "8",
                "STONE_AXE:0": "1",
                "SKULL_ITEM:2": "7",
                "SKULL_ITEM:1": "6",
                "COMPASS:0": "17",
                "LEATHER_HELMET:0": "39"
            },
            "kit_berserker_minor": 3,
            "deaths_kit_berserker": 41,
            "games_played_kit_berserker": 46,
            "perk_void_magnet": 1,
            "perk_alchemy": 0,
            "perk_alchemy_new": true,
            "perk_void_magnet_new": true,
            "longest_bow_shot_kit_berserker": 20,
            "bow_shots_kit_berserker": 41,
            "bow_hits_kit_berserker": 22,
            "enderchests_opened_kit_berserker": 22,
            "assists_kit_berserker": 8,
            "most_kills_game_kit_berserker": 5,
            "melee_kills_kit_berserker": 24,
            "kills_kit_berserker": 34,
            "perk_regeneration_duplicates": 0,
            "perk_snow_golem_duplicates": 0,
            "perk_snow_golem_new": true,
            "perk_snow_golem": 1,
            "perk_endless_quiver_new": true,
            "perk_void_warranty": 0,
            "perk_void_warranty_new": true,
            "perk_endless_quiver": 0,
            "fastest_win_doubles_kit_berserker": 157,
            "doubles_wins_kit_berserker": 6,
            "perk_witch": 0,
            "perk_witch_new": true,
            "void_kills_kit_berserker": 9,
            "perk_regeneration": 1,
            "perk_blazing_arrows": 0,
            "perk_void_magnet_duplicates": 1,
            "perk_witch_duplicates": 1,
            "perk_blazing_arrows_new": true,
            "mobs_killed_kit_berserker": 2,
            "perk_blazing_arrows_duplicates": 1,
            "perk_skeleton_jockey_duplicates": 1,
            "perk_damage_potion_duplicates": 1,
            "perk_supply_drop_duplicates": 1,
            "perk_void_warranty_duplicates": 1,
            "perk_energy_drink_new": true,
            "perk_energy_drink": 0,
            "perk_resistant": 1,
            "perk_headstart": 0,
            "perk_endless_quiver_duplicates": 1,
            "perk_headstart_new": false,
            "deaths_perk_headstart": 1,
            "kills_perk_headstart": 1,
            "losses_perk_headstart": 1,
            "kills_perk_sharpened_sword": 1,
            "losses_perk_hit_and_run": 1,
            "deaths_perk_hit_and_run": 1,
            "losses_perk_sharpened_sword": 1,
            "deaths_perk_sharpened_sword": 1,
            "kills_perk_hit_and_run": 1
        },
        "Bedwars": {
            "bedwars_boxes": 20,
            "Experience": 423436,
            "first_join_7": true,
            "packages": [
                "npcskin_blaze",
                "projectiletrail_potion",
                "deathcry_plop",
                "sprays_hypixel_logo",
                "islandtopper_sheep",
                "killeffect_campfire",
                "projectiletrail_white_smoke",
                "glyph_burn",
                "deathcry_sad_puppy",
                "projectiletrail_firework",
                "killmessages_fire",
                "killeffect_tnt",
                "deathcry_monster_burp",
                "sprays_sorry",
                "npcskin_holiday_bartender",
                "projectiletrail_purple_dust",
                "victorydance_guardians",
                "npcskin_skeleton",
                "killeffect_head_rocket",
                "killmessages_pirate",
                "glyph_storm",
                "glyph_diamond",
                "killeffect_smiley",
                "killeffect_firework",
                "glyph_gg",
                "projectiletrail_slime",
                "sprays_tnt_drop",
                "islandtopper_whale",
                "deathcry_grumpy_villager",
                "sprays_golem_riding",
                "glyph_thumbs_up",
                "sprays_diamond",
                "killeffect_burning_shoes",
                "islandtopper_heart",
                "npcskin_king_of_beds",
                "killeffect_final_smash",
                "deathcry_enderman",
                "deathcry_bazinga",
                "glyph_gold",
                "sprays_creeper",
                "islandtopper_rubix_cube",
                "victorydance_meteor_shower",
                "npcskin_creeper",
                "killeffect_squid_missile",
                "projectiletrail_red_dust",
                "glyph_star",
                "glyph_smiley_face",
                "glyph_daisy",
                "glyph_angry_face",
                "projectiletrail_blue_dust",
                "islandtopper_flame",
                "npcskin_zombie_pigman",
                "sprays_invisibility_potion",
                "victorydance_fireworks",
                "deathcry_deflated_toy",
                "islandtopper_sword",
                "killmessages_western",
                "sprays_enderman",
                "projectiletrail_water",
                "islandtopper_smiley_face",
                "islandtopper_tnt",
                "victorydance_anvil_rain",
                "npcskin_wither_skeleton",
                "glyph_tnt",
                "killmessages_bbq",
                "npcskin_zombie",
                "glyph_iron",
                "killeffect_lighting_strike",
                "deathcry_fireball",
                "deathcry_pig",
                "deathcry_dry_bones",
                "islandtopper_brick_house",
                "npcskin_magic_vendor",
                "islandtopper_tree",
                "glyph_sword",
                "sprays_bed_shield",
                "islandtopper_bomb",
                "projectiletrail_notes",
                "glyph_no",
                "killeffect_heart_aura",
                "tiered_achievement_flag_1",
                "glyph_heart",
                "npcskin_villager_zombie",
                "tiered_achievement_flag_2",
                "glyph_rainbow",
                "glyph_cry_face",
                "glyph_winky_face",
                "victorydance_dragon_rider",
                "islandtopper_slime",
                "killmessages_love",
                "glyph_spectrum",
                "islandtopper_gong",
                "projectiletrail_magic",
                "deathcry_robot_mouse",
                "glyph_emerald",
                "killeffect_cookie_fountain",
                "sprays_leaping_potion",
                "favoritemap_airshow",
                "favoritemap_lighthouse",
                "favoritemap_rooftop",
                "favoritemap_waterfall",
                "projectiletrail_black_smoke",
                "killeffect_tornado",
                "sprays_shiny",
                "tiered_achievement_flag_3",
                "tiered_achievement_flag_4",
                "npcskin_bed_researcher",
                "projectiletrail_ender",
                "islandtopper_note",
                "glyph_bronze_shield",
                "islandtopper_monocle",
                "glyph_ghost",
                "glyph_lol",
                "victorydance_cold_snap",
                "glyph_gold_shield",
                "npcskin_clown",
                "islandtopper_pumpkin",
                "islandtopper_witch_hat",
                "sprays_gg_wp",
                "islandtopper_chicken",
                "deathcry_bat",
                "glyph_bat",
                "deathcry_dinosaur",
                "killmessages_spooky",
                "projectiletrail_lava",
                "glyph_silver_shield",
                "sprays_thanks",
                "npcskin_bed_salesman",
                "deathcry_ding",
                "sprays_reveillon",
                "islandtopper_fancy_helmet",
                "deathcry_splash",
                "sprays_christmas_tree",
                "sprays_santa",
                "projectiletrail_angry_villager",
                "glyph_yes",
                "npcskin_snowman",
                "deathcry_grumble",
                "killeffect_candle",
                "islandtopper_presents",
                "killmessages_santa_workshop",
                "glyph_christmas_tree",
                "islandtopper_snowglobe",
                "islandtopper_treasure_chest",
                "islandtopper_sloth",
                "islandtopper_reindeer",
                "victorydance_yeehaw",
                "npcskin_santa",
                "islandtopper_christmas_hat",
                "killeffect_snowplosion",
                "deathcry_aww",
                "sprays_carried",
                "killeffect_snow_globe",
                "victorydance_twerk_apocalypse",
                "killeffect_piñata",
                "islandtopper_angel",
                "victorydance_night_shift",
                "glyph_snowman",
                "killeffect_xp_orb",
                "glyph_candy_cane",
                "sprays_snowball_fight",
                "islandtopper_candy_cane",
                "glyph_elf",
                "glyph_gift",
                "deathcry_arcade",
                "islandtopper_sun_glasses",
                "deathcry_gone",
                "projectiletrail_magic_wind",
                "victorydance_special_fireworks",
                "killmessages_memed",
                "glyph_skull",
                "victorydance_toy_stick",
                "npcskin_witch",
                "projectiletrail_green_star",
                "sprays_mob_party",
                "npcskin_you",
                "islandtopper_christmas_tree",
                "glyph_creeper_scream",
                "projectiletrail_random",
                "glyph_thumbs_down",
                "capture_book_0",
                "islandtopper_mark_of_the_paw",
                "sprays_dragon_slayer",
                "sprays_hypixel_logo_default",
                "islandtopper_temple",
                "v14_book",
                "npcskin_bao",
                "sprays_dogs_of_wisdom",
                "islandtopper_yin_and_yang",
                "islandtopper_bunny",
                "glyph_bunny",
                "islandtopper_easter_egg",
                "sprays_easter_eggs",
                "npcskin_egg_delivery",
                "glyph_easter_egg",
                "glyph_quack",
                "deathcry_sniff",
                "islandtopper_hatching_egg",
                "sprays_easter_creeper",
                "deathcry_squeak",
                "sprays_wrong_eggs",
                "beddestroy_lighting_strike",
                "islandtopper_gapple",
                "projectiletrail_cold",
                "islandtopper_chalice",
                "deathcry_burp",
                "beddestroy_firework",
                "glyph_bed",
                "beddestroy_bedbugs",
                "npcskin_evil_eye",
                "beddestroy_squid_missile",
                "islandtopper_fish_bowl",
                "islandtopper_rainbow_sheep",
                "glyph_chicken",
                "beddestroy_tornado",
                "islandtopper_bell",
                "sprays_surprise_snowball",
                "killeffect_holiday_tree",
                "glyph_gingerbread_man",
                "sprays_snowball_spammer",
                "sprays_decorative_island",
                "deathcry_miracle",
                "sprays_sleep_well",
                "leaderboards_resync_mar_2021"
            ],
            "bedwars_box": 170,
            "bedwars_box_rares": 66,
            "bedwars_box_commons": 125,
            "chest_history": "§bBlue Dust Projectile Trail,§aFlame Island Topper,§aDaisy Glyph,§aStar Glyph,§bSmiley Face Glyph",
            "activeProjectileTrail": "projectiletrail_magic_wind",
            "activeNPCSkin": "npcskin_you",
            "activeDeathCry": "deathcry_arcade",
            "spray_glyph_field": "RAINBOW,ANGRY_FACE,CRY_FACE,GOLEM_RIDING,DIAMOND,THUMBS_UP",
            "activeIslandTopper": "islandtopper_christmas_tree",
            "activeKillEffect": "killeffect_snowplosion",
            "coins": 439426,
            "bedwars_box_epics": 11,
            "activeKillMessages": "killmessages_santa_workshop",
            "activeVictoryDance": "victorydance_toy_stick",
            "bedwars_box_legendaries": 5,
            "games_played_bedwars_1": 876,
            "winstreak": 0,
            "eight_one_beds_lost_bedwars": 195,
            "final_deaths_bedwars": 350,
            "gold_resources_collected_bedwars": 34549,
            "void_deaths_bedwars": 1801,
            "eight_one_entity_attack_final_kills_bedwars": 286,
            "eight_one_final_deaths_bedwars": 158,
            "eight_one_deaths_bedwars": 549,
            "eight_one_void_deaths_bedwars": 263,
            "void_kills_bedwars": 1268,
            "eight_one_games_played_bedwars": 273,
            "diamond_resources_collected_bedwars": 5789,
            "deaths_bedwars": 3613,
            "eight_one_final_kills_bedwars": 427,
            "eight_one_beds_broken_bedwars": 553,
            "eight_one_entity_attack_final_deaths_bedwars": 100,
            "entity_attack_final_deaths_bedwars": 208,
            "emerald_resources_collected_bedwars": 3954,
            "resources_collected_bedwars": 216287,
            "eight_one_losses_bedwars": 175,
            "games_played_bedwars": 863,
            "eight_one_iron_resources_collected_bedwars": 53522,
            "permanent _items_purchased_bedwars": 1711,
            "entity_attack_final_kills_bedwars": 1122,
            "eight_one__items_purchased_bedwars": 5722,
            "eight_one_emerald_resources_collected_bedwars": 1202,
            "eight_one_items_purchased_bedwars": 6271,
            "beds_lost_bedwars": 440,
            "kills_bedwars": 3034,
            "eight_one_diamond_resources_collected_bedwars": 1569,
            "eight_one_permanent _items_purchased_bedwars": 546,
            "eight_one_void_kills_bedwars": 225,
            "eight_one_kills_bedwars": 663,
            "losses_bedwars": 361,
            "items_purchased_bedwars": 18790,
            "final_kills_bedwars": 1724,
            "eight_one_resources_collected_bedwars": 69020,
            "iron_resources_collected_bedwars": 166528,
            "beds_broken_bedwars": 1204,
            "eight_one_gold_resources_collected_bedwars": 12580,
            "_items_purchased_bedwars": 17072,
            "eight_one_entity_attack_deaths_bedwars": 280,
            "entity_attack_kills_bedwars": 1715,
            "eight_one_entity_attack_kills_bedwars": 431,
            "entity_attack_deaths_bedwars": 1763,
            "void_final_deaths_bedwars": 134,
            "eight_one_void_final_deaths_bedwars": 55,
            "eight_two_final_deaths_bedwars": 182,
            "eight_two_void_final_deaths_bedwars": 74,
            "eight_two_games_played_bedwars": 577,
            "eight_two_resources_collected_bedwars": 145992,
            "eight_two_beds_lost_bedwars": 235,
            "eight_two_gold_resources_collected_bedwars": 21814,
            "eight_two_kills_bedwars": 2341,
            "eight_two_entity_attack_kills_bedwars": 1264,
            "eight_two_iron_resources_collected_bedwars": 111913,
            "eight_two_losses_bedwars": 176,
            "eight_two_emerald_resources_collected_bedwars": 2749,
            "eight_two_permanent _items_purchased_bedwars": 1159,
            "eight_two_diamond_resources_collected_bedwars": 4196,
            "eight_two__items_purchased_bedwars": 11218,
            "eight_two_entity_attack_final_deaths_bedwars": 104,
            "eight_two_items_purchased_bedwars": 12377,
            "eight_two_void_final_kills_bedwars": 437,
            "void_final_kills_bedwars": 579,
            "eight_two_final_kills_bedwars": 1292,
            "eight_two_void_deaths_bedwars": 1520,
            "eight_two_wins_bedwars": 401,
            "eight_two_void_kills_bedwars": 1034,
            "eight_two_deaths_bedwars": 3037,
            "eight_two_entity_attack_deaths_bedwars": 1475,
            "wins_bedwars": 502,
            "eight_two_beds_broken_bedwars": 647,
            "eight_two_entity_attack_final_kills_bedwars": 833,
            "eight_two_fall_final_deaths_bedwars": 4,
            "fall_final_deaths_bedwars": 7,
            "chest_history_new": [
                "sprays_gg_wp",
                "sprays_enderman",
                "deathcry_robot_mouse",
                "glyph_tnt",
                "projectiletrail_potion"
            ],
            "fall_deaths_bedwars": 34,
            "eight_two_fall_deaths_bedwars": 28,
            "eight_one_fall_deaths_bedwars": 5,
            "eight_one_void_final_kills_bedwars": 140,
            "eight_one_wins_bedwars": 98,
            "four_four__items_purchased_bedwars": 59,
            "four_four_void_kills_bedwars": 5,
            "four_four_kills_bedwars": 13,
            "four_four_final_deaths_bedwars": 6,
            "four_four_deaths_bedwars": 18,
            "four_four_gold_resources_collected_bedwars": 61,
            "four_four_beds_lost_bedwars": 6,
            "four_four_losses_bedwars": 6,
            "four_four_iron_resources_collected_bedwars": 543,
            "four_four_games_played_bedwars": 7,
            "four_four_fall_final_deaths_bedwars": 1,
            "four_four_resources_collected_bedwars": 623,
            "four_four_void_deaths_bedwars": 12,
            "four_four_items_purchased_bedwars": 65,
            "four_four_emerald_resources_collected_bedwars": 3,
            "projectile_deaths_bedwars": 7,
            "eight_two_projectile_deaths_bedwars": 7,
            "fall_kills_bedwars": 49,
            "eight_two_fall_kills_bedwars": 42,
            "entity_explosion_deaths_bedwars": 7,
            "eight_two_entity_explosion_deaths_bedwars": 6,
            "eight_two_fall_final_kills_bedwars": 22,
            "fall_final_kills_bedwars": 23,
            "eight_one_projectile_kills_bedwars": 1,
            "projectile_kills_bedwars": 1,
            "projectile_final_deaths_bedwars": 1,
            "eight_one_projectile_final_deaths_bedwars": 1,
            "eight_one_fall_kills_bedwars": 6,
            "four_four_permanent _items_purchased_bedwars": 6,
            "four_four_void_final_deaths_bedwars": 2,
            "four_four_entity_attack_kills_bedwars": 8,
            "four_four_beds_broken_bedwars": 4,
            "four_four_diamond_resources_collected_bedwars": 16,
            "four_four_entity_attack_final_kills_bedwars": 2,
            "four_four_final_kills_bedwars": 4,
            "four_four_entity_attack_final_deaths_bedwars": 3,
            "fire_tick_deaths_bedwars": 1,
            "eight_two_fire_tick_deaths_bedwars": 1,
            "eight_two_entity_explosion_kills_bedwars": 1,
            "entity_explosion_kills_bedwars": 1,
            "eight_one_fall_final_deaths_bedwars": 2,
            "favourites_1": "wool,iron_sword,golden_apple,wooden_pickaxe_[tier_1],wooden_axe_[tier_1],tnt,iron_boots,diamond_boots,fireball,shears",
            "bedwars_halloween_boxes": 20,
            "free_event_key_bedwars_halloween_boxes_2017": true,
            "Bedwars_openedChests": 539,
            "Bedwars_openedCommons": 309,
            "spooky_open_ach": 31,
            "Bedwars_openedRares": 167,
            "Bedwars_openedEpics": 61,
            "Bedwars_openedLegendaries": 24,
            "eight_one_entity_explosion_deaths_bedwars": 1,
            "two_four_gold_resources_collected_bedwars": 48,
            "two_four_wins_bedwars": 2,
            "two_four_deaths_bedwars": 7,
            "two_four__items_purchased_bedwars": 40,
            "two_four_void_deaths_bedwars": 6,
            "two_four_iron_resources_collected_bedwars": 272,
            "two_four_kills_bedwars": 4,
            "two_four_items_purchased_bedwars": 40,
            "two_four_entity_attack_kills_bedwars": 2,
            "two_four_resources_collected_bedwars": 320,
            "two_four_games_played_bedwars": 3,
            "two_four_entity_attack_final_kills_bedwars": 1,
            "two_four_entity_attack_deaths_bedwars": 1,
            "two_four_final_kills_bedwars": 1,
            "two_four_beds_lost_bedwars": 1,
            "two_four_entity_attack_final_deaths_bedwars": 1,
            "two_four_losses_bedwars": 1,
            "two_four_fall_kills_bedwars": 1,
            "two_four_void_kills_bedwars": 1,
            "two_four_final_deaths_bedwars": 1,
            "bedwars_christmas_boxes": 3,
            "free_event_key_bedwars_christmas_boxes_2017": true,
            "eight_two_wrapped_present_resources_collected_bedwars": 5320,
            "wrapped_present_resources_collected_bedwars": 5467,
            "eight_one_wrapped_present_resources_collected_bedwars": 147,
            "activeSprays": "sprays_carried",
            "activeGlyph": "glyph_rainbow",
            "shop_sort": "rarity_ascending",
            "shop_sort_enable_owned_first": true,
            "free_event_key_bedwars_christmas_boxes_2018": true,
            "four_four_entity_attack_deaths_bedwars": 6,
            "eight_one_fall_final_kills_bedwars": 1,
            "four_four_wins_bedwars": 1,
            "four_four_void_final_kills_bedwars": 2,
            "seen_beta_menu": 1,
            "favorite_slots": "Blocks,Melee,Tools,Tools,Tools,Potions,Utility,Utility,Compass",
            "favourites_2": "wool,stone_sword,chainmail_boots,wooden_pickaxe,invisibility_potion_(30_seconds),dream_defender,tnt,oak_wood_planks,iron_sword,iron_boots,wooden_axe,jump_v_potion_(45_seconds),bedbug,ender_pearl,blast-proof_glass,end_stone,diamond_boots,shears,golden_apple,bridge_egg,fireball",
            "free_event_key_bedwars_lunar_boxes_2018": true,
            "bedwars_lunar_boxes": 0,
            "free_event_key_bedwars_easter_boxes_2018": true,
            "bedwars_easter_boxes": 0,
            "eight_one_winstreak": 0,
            "understands_streaks": true,
            "understands_resource_bank": true,
            "castle_winstreak": 0,
            "castle_permanent _items_purchased_bedwars": 3,
            "castle_deaths_bedwars": 9,
            "castle__items_purchased_bedwars": 34,
            "castle_games_played_bedwars": 1,
            "castle_wins_bedwars": 1,
            "castle_entity_attack_final_kills_bedwars": 1,
            "castle_fall_kills_bedwars": 1,
            "castle_items_purchased_bedwars": 37,
            "castle_gold_resources_collected_bedwars": 43,
            "castle_resources_collected_bedwars": 315,
            "castle_void_final_kills_bedwars": 1,
            "castle_entity_attack_deaths_bedwars": 3,
            "castle_final_kills_bedwars": 2,
            "castle_void_deaths_bedwars": 6,
            "castle_iron_resources_collected_bedwars": 272,
            "castle_kills_bedwars": 1,
            "free_event_key_bedwars_halloween_boxes_2018": true,
            "lastTourneyAd": 1542580298204,
            "free_event_key_bedwars_lunar_boxes_2019": true,
            "free_event_key_bedwars_easter_boxes_2019": true,
            "free_event_key_bedwars_christmas_boxes_2019": true,
            "practice": {
                "records": {
                    "bridging_distance_30:elevation_NONE:angle_STRAIGHT:": 18371
                },
                "bridging": {
                    "failed_attempts": 14,
                    "blocks_placed": 134,
                    "successful_attempts": 2
                },
                "selected": "MLG",
                "mlg": {
                    "failed_attempts": 84,
                    "successful_attempts": 7
                }
            },
            "four_three_winstreak": 0,
            "four_three__items_purchased_bedwars": 33,
            "four_three_beds_lost_bedwars": 3,
            "four_three_deaths_bedwars": 2,
            "four_three_diamond_resources_collected_bedwars": 8,
            "four_three_entity_attack_deaths_bedwars": 1,
            "four_three_entity_attack_kills_bedwars": 10,
            "four_three_fall_deaths_bedwars": 1,
            "four_three_final_deaths_bedwars": 3,
            "four_three_games_played_bedwars": 3,
            "four_three_gold_resources_collected_bedwars": 46,
            "four_three_iron_resources_collected_bedwars": 278,
            "four_three_items_purchased_bedwars": 37,
            "four_three_kills_bedwars": 13,
            "four_three_losses_bedwars": 3,
            "four_three_resources_collected_bedwars": 332,
            "four_three_void_final_deaths_bedwars": 3,
            "four_three_void_kills_bedwars": 3,
            "four_three_permanent_items_purchased_bedwars": 4,
            "permanent_items_purchased_bedwars": 7,
            "eight_one_permanent_items_purchased_bedwars": 3
        },
        "MurderMystery": {
            "mm_chests": 34,
            "packages": [
                "kill_note_bowtie",
                "projectile_trail_ender",
                "last_words_dontcare",
                "knife_skin_shovel",
                "projectile_trail_white_smoke",
                "gesture_goodbye",
                "projectile_trail_slime",
                "knife_skin_carrot_on_stick",
                "projectile_trail_lava",
                "kill_note_shh",
                "kill_note_master_sword",
                "projectile_trail_red_dust",
                "projectile_trail_potion",
                "kill_note_derailed",
                "victory_dance_meteor_shower",
                "last_words_mrobvious",
                "last_words_glutton",
                "victory_dance_fireworks",
                "kill_note_dice_roll",
                "projectile_trail_purple_dust",
                "kill_note_rose",
                "knife_skin_stick",
                "gesture_karaoke",
                "kill_note_gradient",
                "kill_note_super_effective",
                "victory_dance_yeehaw",
                "last_words_pirate",
                "kill_note_boom",
                "projectile_trail_black_smoke",
                "kill_note_big_skull",
                "victory_dance_guardians",
                "kill_note_skull",
                "kill_note_ghosts",
                "kill_note_split_personality",
                "last_words_protips",
                "last_words_rage",
                "victory_dance_cold_snap",
                "kill_note_gas",
                "last_words_naughty",
                "kill_note_gift_spray",
                "last_words_philosoph",
                "kill_note_big_brother",
                "kill_note_bad_time",
                "projectile_trail_water",
                "knife_skin_cheapo",
                "knife_skin_diamond_shovel",
                "knife_skin_rudolphs_snack",
                "gesture_cool_dance",
                "kill_note_candy_cane_guns",
                "gesture_snowball_toss",
                "gesture_zombie_dance",
                "kill_note_cookies_and_milk",
                "kill_note_selfie",
                "gesture_clapping",
                "deathcry_dinosaur",
                "deathcry_pig",
                "sep2021achievementsync"
            ],
            "MurderMystery_openedRares": 36,
            "mm_chest_history": [
                "last_words_rage",
                "knife_skin_vip",
                "last_words_protips",
                "kill_note_ghosts",
                "gesture_karaoke"
            ],
            "MurderMystery_openedChests": 92,
            "MurderMystery_openedCommons": 56,
            "MurderMystery_openedEpics": 6,
            "coins": 391970,
            "active_knife_skin": "knife_skin_carrot_on_stick",
            "active_victory_dance": "victory_dance_guardians",
            "active_gesture": "gesture_zombie_dance",
            "active_last_words": "last_words_dontcare",
            "active_projectile_trail": "projectile_trail_purple_dust",
            "active_kill_note": "kill_note_candy_cane_guns",
            "murdermystery_books": [
                "innocent",
                "murderer",
                "detective"
            ],
            "coins_pickedup_MURDER_CLASSIC": 1700,
            "wins": 246,
            "games_ancient_tomb": 51,
            "detective_wins_ancient_tomb_MURDER_CLASSIC": 5,
            "games_ancient_tomb_MURDER_CLASSIC": 48,
            "wins_ancient_tomb_MURDER_CLASSIC": 40,
            "coins_pickedup_ancient_tomb_MURDER_CLASSIC": 461,
            "detective_wins": 23,
            "games": 326,
            "detective_wins_ancient_tomb": 6,
            "detective_wins_MURDER_CLASSIC": 22,
            "games_MURDER_CLASSIC": 286,
            "coins_pickedup": 1835,
            "coins_pickedup_ancient_tomb": 469,
            "wins_MURDER_CLASSIC": 240,
            "wins_ancient_tomb": 41,
            "granted_chests": 1,
            "MurderMystery_openedLegendaries": 4,
            "wins_transport": 15,
            "coins_pickedup_transport": 88,
            "wins_transport_MURDER_CLASSIC": 14,
            "games_transport_MURDER_CLASSIC": 18,
            "games_transport": 22,
            "coins_pickedup_transport_MURDER_CLASSIC": 67,
            "was_hero_cruise_ship_MURDER_CLASSIC": 2,
            "bow_kills_cruise_ship": 2,
            "kills_cruise_ship": 17,
            "was_hero": 24,
            "wins_cruise_ship_MURDER_CLASSIC": 23,
            "was_hero_MURDER_CLASSIC": 23,
            "bow_kills_MURDER_CLASSIC": 31,
            "kills_MURDER_CLASSIC": 274,
            "coins_pickedup_cruise_ship_MURDER_CLASSIC": 94,
            "games_cruise_ship_MURDER_CLASSIC": 26,
            "was_hero_cruise_ship": 2,
            "coins_pickedup_cruise_ship": 118,
            "bow_kills_cruise_ship_MURDER_CLASSIC": 2,
            "bow_kills": 43,
            "games_cruise_ship": 28,
            "kills": 322,
            "wins_cruise_ship": 23,
            "kills_cruise_ship_MURDER_CLASSIC": 13,
            "wins_gold_rush_MURDER_CLASSIC": 37,
            "games_gold_rush_MURDER_CLASSIC": 43,
            "wins_gold_rush": 38,
            "coins_pickedup_gold_rush": 463,
            "games_gold_rush": 56,
            "coins_pickedup_gold_rush_MURDER_CLASSIC": 449,
            "games_MURDER_ASSASSINS": 7,
            "knife_kills_hollywood": 12,
            "knife_kills": 236,
            "deaths_hollywood_MURDER_ASSASSINS": 1,
            "kills_hollywood": 17,
            "games_hollywood_MURDER_ASSASSINS": 1,
            "deaths": 109,
            "coins_pickedup_hollywood_MURDER_ASSASSINS": 3,
            "deaths_MURDER_ASSASSINS": 5,
            "coins_pickedup_hollywood": 46,
            "knife_kills_hollywood_MURDER_ASSASSINS": 1,
            "deaths_hollywood": 5,
            "kills_hollywood_MURDER_ASSASSINS": 1,
            "games_hollywood": 23,
            "coins_pickedup_MURDER_ASSASSINS": 33,
            "knife_kills_MURDER_ASSASSINS": 13,
            "kills_MURDER_ASSASSINS": 17,
            "detective_wins_gold_rush_MURDER_CLASSIC": 10,
            "detective_wins_gold_rush": 10,
            "murderer_chance": 8,
            "knife_kills_MURDER_CLASSIC": 215,
            "thrown_knife_kills": 29,
            "kills_gold_rush_MURDER_CLASSIC": 61,
            "kills_as_murderer_gold_rush_MURDER_CLASSIC": 56,
            "thrown_knife_kills_MURDER_CLASSIC": 27,
            "thrown_knife_kills_gold_rush": 10,
            "kills_as_murderer_MURDER_CLASSIC": 249,
            "kills_as_murderer_gold_rush": 56,
            "thrown_knife_kills_gold_rush_MURDER_CLASSIC": 8,
            "kills_as_murderer": 249,
            "kills_gold_rush": 68,
            "knife_kills_gold_rush": 51,
            "knife_kills_gold_rush_MURDER_CLASSIC": 47,
            "detective_chance": 20,
            "deaths_gold_rush": 12,
            "deaths_gold_rush_MURDER_CLASSIC": 10,
            "deaths_MURDER_CLASSIC": 104,
            "deaths_headquarters": 6,
            "games_headquarters_MURDER_CLASSIC": 14,
            "wins_headquarters_MURDER_CLASSIC": 12,
            "deaths_headquarters_MURDER_CLASSIC": 6,
            "coins_pickedup_headquarters": 62,
            "wins_headquarters": 12,
            "games_headquarters": 15,
            "coins_pickedup_headquarters_MURDER_CLASSIC": 62,
            "bow_kills_gold_rush_MURDER_CLASSIC": 6,
            "was_hero_gold_rush_MURDER_CLASSIC": 5,
            "was_hero_gold_rush": 5,
            "bow_kills_gold_rush": 7,
            "murderer_wins_gold_rush_MURDER_CLASSIC": 2,
            "murderer_wins_gold_rush": 2,
            "murderer_wins_MURDER_CLASSIC": 12,
            "murderer_wins": 12,
            "wins_MURDER_HARDCORE": 1,
            "kills_MURDER_HARDCORE": 1,
            "bow_kills_ancient_tomb": 12,
            "detective_wins_ancient_tomb_MURDER_HARDCORE": 1,
            "kills_ancient_tomb": 22,
            "bow_kills_MURDER_HARDCORE": 1,
            "coins_pickedup_MURDER_HARDCORE": 4,
            "was_hero_ancient_tomb": 5,
            "wins_ancient_tomb_MURDER_HARDCORE": 1,
            "games_ancient_tomb_MURDER_HARDCORE": 1,
            "bow_kills_ancient_tomb_MURDER_HARDCORE": 1,
            "games_MURDER_HARDCORE": 1,
            "was_hero_ancient_tomb_MURDER_HARDCORE": 1,
            "kills_ancient_tomb_MURDER_HARDCORE": 1,
            "detective_wins_MURDER_HARDCORE": 1,
            "coins_pickedup_ancient_tomb_MURDER_HARDCORE": 4,
            "was_hero_MURDER_HARDCORE": 1,
            "knife_kills_library": 17,
            "deaths_library_MURDER_ASSASSINS": 1,
            "knife_kills_library_MURDER_ASSASSINS": 1,
            "kills_library_MURDER_ASSASSINS": 1,
            "deaths_library": 22,
            "coins_pickedup_library": 276,
            "games_library_MURDER_ASSASSINS": 1,
            "games_library": 44,
            "kills_library": 21,
            "coins_pickedup_library_MURDER_ASSASSINS": 2,
            "wins_library_MURDER_CLASSIC": 32,
            "deaths_library_MURDER_CLASSIC": 21,
            "wins_library": 32,
            "games_library_MURDER_CLASSIC": 43,
            "coins_pickedup_library_MURDER_CLASSIC": 274,
            "deaths_ancient_tomb_MURDER_ASSASSINS": 1,
            "games_ancient_tomb_MURDER_ASSASSINS": 1,
            "knife_kills_ancient_tomb": 10,
            "knife_kills_ancient_tomb_MURDER_ASSASSINS": 1,
            "deaths_ancient_tomb": 21,
            "kills_ancient_tomb_MURDER_ASSASSINS": 1,
            "coins_pickedup_ancient_tomb_MURDER_ASSASSINS": 4,
            "coins_pickedup_archives": 104,
            "bow_kills_archives": 4,
            "knife_kills_archives": 57,
            "coins_pickedup_archives_MURDER_ASSASSINS": 6,
            "kills_archives": 68,
            "wins_archives": 23,
            "bow_kills_archives_MURDER_ASSASSINS": 1,
            "knife_kills_archives_MURDER_ASSASSINS": 2,
            "kills_archives_MURDER_ASSASSINS": 3,
            "games_archives_MURDER_ASSASSINS": 1,
            "games_archives": 31,
            "wins_MURDER_ASSASSINS": 3,
            "wins_archives_MURDER_ASSASSINS": 1,
            "bow_kills_MURDER_ASSASSINS": 2,
            "coins_pickedup_transport_MURDER_ASSASSINS": 7,
            "knife_kills_transport": 15,
            "games_transport_MURDER_ASSASSINS": 1,
            "kills_transport_MURDER_ASSASSINS": 4,
            "wins_transport_MURDER_ASSASSINS": 1,
            "knife_kills_transport_MURDER_ASSASSINS": 4,
            "kills_transport": 20,
            "thrown_knife_kills_gold_rush_MURDER_ASSASSINS": 2,
            "thrown_knife_kills_MURDER_ASSASSINS": 2,
            "kills_gold_rush_MURDER_ASSASSINS": 7,
            "knife_kills_gold_rush_MURDER_ASSASSINS": 4,
            "games_gold_rush_MURDER_ASSASSINS": 2,
            "coins_pickedup_gold_rush_MURDER_ASSASSINS": 11,
            "bow_kills_gold_rush_MURDER_ASSASSINS": 1,
            "wins_gold_rush_MURDER_ASSASSINS": 1,
            "deaths_gold_rush_MURDER_ASSASSINS": 2,
            "games_archives_MURDER_CLASSIC": 26,
            "was_hero_archives": 3,
            "was_hero_archives_MURDER_CLASSIC": 3,
            "kills_archives_MURDER_CLASSIC": 65,
            "wins_archives_MURDER_CLASSIC": 22,
            "bow_kills_archives_MURDER_CLASSIC": 3,
            "coins_pickedup_archives_MURDER_CLASSIC": 98,
            "deaths_cruise_ship_MURDER_CLASSIC": 11,
            "deaths_cruise_ship": 11,
            "wins_hollywood": 21,
            "wins_hollywood_MURDER_CLASSIC": 21,
            "coins_pickedup_hollywood_MURDER_CLASSIC": 34,
            "deaths_hollywood_MURDER_CLASSIC": 4,
            "games_hollywood_MURDER_CLASSIC": 21,
            "games_towerfall_MURDER_CLASSIC": 13,
            "coins_pickedup_towerfall": 43,
            "games_towerfall": 17,
            "wins_towerfall_MURDER_CLASSIC": 10,
            "deaths_towerfall_MURDER_CLASSIC": 6,
            "deaths_towerfall": 6,
            "wins_towerfall": 11,
            "coins_pickedup_towerfall_MURDER_CLASSIC": 31,
            "coins_pickedup_hypixel_world": 106,
            "was_hero_hypixel_world_MURDER_CLASSIC": 3,
            "wins_hypixel_world": 20,
            "kills_hypixel_world_MURDER_CLASSIC": 53,
            "detective_wins_hypixel_world": 3,
            "kills_hypixel_world": 57,
            "games_hypixel_world_MURDER_CLASSIC": 23,
            "bow_kills_hypixel_world_MURDER_CLASSIC": 4,
            "wins_hypixel_world_MURDER_CLASSIC": 20,
            "games_hypixel_world": 24,
            "coins_pickedup_hypixel_world_MURDER_CLASSIC": 91,
            "bow_kills_hypixel_world": 4,
            "was_hero_hypixel_world": 3,
            "detective_wins_hypixel_world_MURDER_CLASSIC": 3,
            "kills_library_MURDER_CLASSIC": 20,
            "knife_kills_library_MURDER_CLASSIC": 16,
            "thrown_knife_kills_library": 2,
            "kills_as_murderer_library": 18,
            "kills_as_murderer_library_MURDER_CLASSIC": 18,
            "thrown_knife_kills_library_MURDER_CLASSIC": 2,
            "total_time_survived_seconds_gold_rush": 2718,
            "total_time_survived_seconds": 2718,
            "longest_time_as_survivor_seconds": 270,
            "longest_time_as_survivor_seconds_gold_rush": 270,
            "total_time_survived_seconds_gold_rush_MURDER_INFECTION": 2718,
            "longest_time_as_survivor_seconds_MURDER_INFECTION": 270,
            "total_time_survived_seconds_MURDER_INFECTION": 2718,
            "longest_time_as_survivor_seconds_gold_rush_MURDER_INFECTION": 270,
            "games_MURDER_INFECTION": 22,
            "kills_as_survivor_MURDER_INFECTION": 36,
            "kills_as_survivor": 36,
            "kills_as_survivor_gold_rush": 19,
            "games_gold_rush_MURDER_INFECTION": 10,
            "kills_as_survivor_gold_rush_MURDER_INFECTION": 19,
            "total_time_survived_seconds_towerfall": 2115,
            "total_time_survived_seconds_towerfall_MURDER_INFECTION": 2115,
            "kills_as_infected_towerfall_MURDER_INFECTION": 8,
            "kills_as_infected_MURDER_INFECTION": 24,
            "kills_as_survivor_towerfall_MURDER_INFECTION": 2,
            "kills_as_infected": 24,
            "kills_as_survivor_towerfall": 2,
            "games_towerfall_MURDER_INFECTION": 3,
            "kills_as_infected_towerfall": 8,
            "total_time_survived_seconds_archives_MURDER_INFECTION": 1192,
            "total_time_survived_seconds_archives": 1192,
            "games_archives_MURDER_INFECTION": 4,
            "last_one_alive_MURDER_INFECTION": 2,
            "last_one_alive_archives_MURDER_INFECTION": 1,
            "last_one_alive": 2,
            "last_one_alive_archives": 1,
            "kills_as_infected_gold_rush": 5,
            "kills_as_infected_gold_rush_MURDER_INFECTION": 5,
            "kills_as_survivor_archives_MURDER_INFECTION": 10,
            "kills_as_survivor_archives": 10,
            "kills_as_infected_archives": 4,
            "kills_as_infected_archives_MURDER_INFECTION": 4,
            "last_one_alive_gold_rush": 1,
            "last_one_alive_gold_rush_MURDER_INFECTION": 1,
            "total_time_survived_seconds_ancient_tomb": 1633,
            "total_time_survived_seconds_ancient_tomb_MURDER_INFECTION": 1633,
            "games_ancient_tomb_MURDER_INFECTION": 1,
            "total_time_survived_seconds_headquarters_MURDER_INFECTION": 1734,
            "total_time_survived_seconds_headquarters": 1734,
            "kills_as_survivor_headquarters_MURDER_INFECTION": 1,
            "kills_as_survivor_headquarters": 1,
            "kills_as_infected_headquarters": 1,
            "kills_as_infected_headquarters_MURDER_INFECTION": 1,
            "games_headquarters_MURDER_INFECTION": 1,
            "total_time_survived_seconds_cruise_ship_MURDER_INFECTION": 2087,
            "total_time_survived_seconds_cruise_ship": 2087,
            "kills_as_survivor_cruise_ship": 3,
            "games_cruise_ship_MURDER_INFECTION": 1,
            "kills_as_survivor_cruise_ship_MURDER_INFECTION": 3,
            "total_time_survived_seconds_transport_MURDER_INFECTION": 2198,
            "total_time_survived_seconds_transport": 2198,
            "kills_as_survivor_transport_MURDER_INFECTION": 1,
            "games_transport_MURDER_INFECTION": 2,
            "kills_as_survivor_transport": 1,
            "kills_as_infected_transport": 6,
            "kills_as_infected_transport_MURDER_INFECTION": 6,
            "survivor_wins": 1,
            "survivor_wins_gold_rush": 1,
            "survivor_wins_gold_rush_MURDER_INFECTION": 1,
            "survivor_wins_MURDER_INFECTION": 1,
            "murderer_wins_cruise_ship": 1,
            "murderer_wins_cruise_ship_MURDER_CLASSIC": 1,
            "thrown_knife_kills_cruise_ship": 1,
            "kills_as_murderer_cruise_ship": 11,
            "thrown_knife_kills_cruise_ship_MURDER_CLASSIC": 1,
            "kills_as_murderer_cruise_ship_MURDER_CLASSIC": 11,
            "knife_kills_cruise_ship_MURDER_CLASSIC": 10,
            "knife_kills_cruise_ship": 10,
            "deaths_archives_MURDER_CLASSIC": 6,
            "deaths_archives": 6,
            "coins_pickedup_mountain_MURDER_CLASSIC": 39,
            "wins_mountain": 10,
            "games_mountain_MURDER_CLASSIC": 11,
            "wins_mountain_MURDER_CLASSIC": 9,
            "games_mountain": 15,
            "coins_pickedup_mountain": 60,
            "kills_mountain_MURDER_CLASSIC": 15,
            "thrown_knife_kills_mountain": 5,
            "kills_as_murderer_mountain_MURDER_CLASSIC": 15,
            "kills_mountain": 28,
            "murderer_wins_mountain": 1,
            "murderer_wins_mountain_MURDER_CLASSIC": 1,
            "knife_kills_mountain_MURDER_CLASSIC": 10,
            "thrown_knife_kills_mountain_MURDER_CLASSIC": 5,
            "kills_as_murderer_mountain": 15,
            "knife_kills_mountain": 15,
            "deaths_mountain": 4,
            "deaths_mountain_MURDER_CLASSIC": 4,
            "mm_christmas_chests": 26,
            "chest_history_new": [
                "kill_note_candy_cane_guns",
                "kill_note_cookies_and_milk",
                "kill_note_skull",
                "§6§6§6Coins",
                "last_words_naughty"
            ],
            "bow_kills_library_MURDER_CLASSIC": 2,
            "was_hero_library_MURDER_CLASSIC": 2,
            "bow_kills_library": 2,
            "was_hero_library": 2,
            "deaths_ancient_tomb_MURDER_CLASSIC": 20,
            "kills_transport_MURDER_CLASSIC": 12,
            "deaths_transport_MURDER_CLASSIC": 8,
            "knife_kills_transport_MURDER_CLASSIC": 10,
            "kills_as_murderer_transport": 11,
            "deaths_transport": 8,
            "kills_as_murderer_transport_MURDER_CLASSIC": 11,
            "detective_wins_archives_MURDER_CLASSIC": 1,
            "detective_wins_archives": 1,
            "thrown_knife_kills_archives": 7,
            "kills_as_murderer_archives": 62,
            "murderer_wins_archives": 3,
            "murderer_wins_archives_MURDER_CLASSIC": 3,
            "knife_kills_archives_MURDER_CLASSIC": 55,
            "thrown_knife_kills_archives_MURDER_CLASSIC": 7,
            "kills_as_murderer_archives_MURDER_CLASSIC": 62,
            "knife_kills_hypixel_world": 47,
            "thrown_knife_kills_hypixel_world": 2,
            "kills_as_murderer_hypixel_world": 50,
            "murderer_wins_hypixel_world_MURDER_CLASSIC": 3,
            "thrown_knife_kills_hypixel_world_MURDER_CLASSIC": 2,
            "kills_as_murderer_hypixel_world_MURDER_CLASSIC": 50,
            "murderer_wins_hypixel_world": 3,
            "knife_kills_hypixel_world_MURDER_CLASSIC": 47,
            "deaths_hypixel_world": 8,
            "deaths_hypixel_world_MURDER_CLASSIC": 8,
            "was_hero_transport": 1,
            "bow_kills_transport_MURDER_CLASSIC": 1,
            "bow_kills_transport": 4,
            "was_hero_transport_MURDER_CLASSIC": 1,
            "bow_kills_towerfall": 1,
            "kills_towerfall": 4,
            "was_hero_towerfall": 2,
            "kills_towerfall_MURDER_CLASSIC": 2,
            "bow_kills_towerfall_MURDER_CLASSIC": 1,
            "was_hero_towerfall_MURDER_CLASSIC": 2,
            "thrown_knife_kills_transport_MURDER_CLASSIC": 1,
            "thrown_knife_kills_transport": 1,
            "trap_kills_MURDER_CLASSIC": 1,
            "trap_kills_towerfall_MURDER_CLASSIC": 1,
            "trap_kills_towerfall": 1,
            "trap_kills": 1,
            "detective_wins_library": 1,
            "detective_wins_library_MURDER_CLASSIC": 1,
            "kills_ancient_tomb_MURDER_CLASSIC": 20,
            "bow_kills_ancient_tomb_MURDER_CLASSIC": 11,
            "was_hero_ancient_tomb_MURDER_CLASSIC": 4,
            "detective_wins_hollywood": 2,
            "detective_wins_hollywood_MURDER_CLASSIC": 2,
            "murderer_wins_hollywood": 1,
            "thrown_knife_kills_hollywood": 1,
            "kills_hollywood_MURDER_CLASSIC": 13,
            "knife_kills_hollywood_MURDER_CLASSIC": 11,
            "murderer_wins_hollywood_MURDER_CLASSIC": 1,
            "thrown_knife_kills_hollywood_MURDER_CLASSIC": 1,
            "kills_as_murderer_hollywood_MURDER_CLASSIC": 12,
            "kills_as_murderer_hollywood": 12,
            "murderer_wins_library_MURDER_CLASSIC": 1,
            "murderer_wins_library": 1,
            "bow_kills_hollywood_MURDER_CLASSIC": 1,
            "was_hero_hollywood": 1,
            "was_hero_hollywood_MURDER_CLASSIC": 1,
            "bow_kills_hollywood": 1,
            "kills_as_murderer_ancient_tomb_MURDER_CLASSIC": 14,
            "kills_as_murderer_ancient_tomb": 14,
            "knife_kills_ancient_tomb_MURDER_CLASSIC": 9,
            "games_MURDER_WILD_REVOLVERS": 6,
            "kills_mountain_MURDER_WILD_REVOLVERS": 2,
            "coins_pickedup_mountain_MURDER_WILD_REVOLVERS": 13,
            "coins_pickedup_MURDER_WILD_REVOLVERS": 64,
            "kills_MURDER_WILD_REVOLVERS": 13,
            "games_mountain_MURDER_WILD_REVOLVERS": 2,
            "games_hollywood_MURDER_WILD_REVOLVERS": 1,
            "kills_hollywood_MURDER_WILD_REVOLVERS": 3,
            "coins_pickedup_hollywood_MURDER_WILD_REVOLVERS": 9,
            "coins_pickedup_gold_rush_MURDER_WILD_REVOLVERS": 3,
            "games_gold_rush_MURDER_WILD_REVOLVERS": 1,
            "coins_pickedup_hypixel_world_MURDER_WILD_REVOLVERS": 15,
            "kills_hypixel_world_MURDER_WILD_REVOLVERS": 4,
            "games_hypixel_world_MURDER_WILD_REVOLVERS": 1,
            "kills_cruise_ship_MURDER_WILD_REVOLVERS": 4,
            "games_cruise_ship_MURDER_WILD_REVOLVERS": 1,
            "coins_pickedup_cruise_ship_MURDER_WILD_REVOLVERS": 24,
            "games_mountain_MURDER_SHOWDOWN": 2,
            "kills_MURDER_SHOWDOWN": 17,
            "knife_kills_MURDER_SHOWDOWN": 8,
            "games_MURDER_SHOWDOWN": 4,
            "bow_kills_mountain": 6,
            "coins_pickedup_mountain_MURDER_SHOWDOWN": 8,
            "bow_kills_mountain_MURDER_SHOWDOWN": 6,
            "knife_kills_mountain_MURDER_SHOWDOWN": 5,
            "kills_mountain_MURDER_SHOWDOWN": 11,
            "coins_pickedup_MURDER_SHOWDOWN": 34,
            "bow_kills_MURDER_SHOWDOWN": 9,
            "quickest_showdown_win_time_seconds_MURDER_SHOWDOWN": 116,
            "quickest_showdown_win_time_seconds_mountain": 140,
            "quickest_showdown_win_time_seconds": 116,
            "quickest_showdown_win_time_seconds_mountain_MURDER_SHOWDOWN": 140,
            "wins_mountain_MURDER_SHOWDOWN": 1,
            "wins_MURDER_SHOWDOWN": 2,
            "quickest_showdown_win_time_seconds_towerfall": 116,
            "quickest_showdown_win_time_seconds_towerfall_MURDER_SHOWDOWN": 116,
            "knife_kills_towerfall": 2,
            "knife_kills_towerfall_MURDER_SHOWDOWN": 2,
            "games_towerfall_MURDER_SHOWDOWN": 1,
            "kills_towerfall_MURDER_SHOWDOWN": 2,
            "wins_towerfall_MURDER_SHOWDOWN": 1,
            "coins_pickedup_towerfall_MURDER_SHOWDOWN": 12,
            "games_transport_MURDER_SHOWDOWN": 1,
            "coins_pickedup_transport_MURDER_SHOWDOWN": 14,
            "kills_transport_MURDER_SHOWDOWN": 4,
            "knife_kills_transport_MURDER_SHOWDOWN": 1,
            "bow_kills_transport_MURDER_SHOWDOWN": 3,
            "mm_halloween_chests": 20
        },
        "Legacy": {
            "next_tokens_seconds": 102,
            "paintball_tokens": 2,
            "total_tokens": 3,
            "tokens": 3,
            "arena_tokens": 1
        },
        "BuildBattle": {
            "wins": 21,
            "packages": [
                "bb_stat_flag",
                "bb_achieve_flag",
                "jumpman_hat",
                "super_votes",
                "aztec_track",
                "balrog",
                "bblc",
                "black_notes",
                "bohemian_rhapsody",
                "cantina",
                "carousel_ride",
                "creeper_chase",
                "comptine",
                "backstreet",
                "holiday",
                "larger_than_life",
                "victory",
                "voting",
                "bleeding_out",
                "fireflies",
                "end_lobby",
                "entertainer",
                "knights_hall",
                "tnt_hat",
                "monastery",
                "suits_monochrome",
                "hats_jumpman_hat"
            ],
            "wins_solo_normal": 16,
            "wins_teams_normal": 2,
            "wins_guess_the_build": 3,
            "games_played": 68,
            "score": 685,
            "coins": 33215,
            "monthly_coins_a": 23215,
            "weekly_coins_b": 23095,
            "weekly_coins_a": 120,
            "solo_most_points": 211,
            "total_votes": 325,
            "correct_guesses": 107,
            "new_selected_hat": "jumpman_hat",
            "super_votes": 1,
            "music": false,
            "last_purchased_song": "entertainer",
            "buildbattle_loadout": []
        },
        "Duels": {
            "sw_duels_kit": "kit_ranked_ranked_paladin",
            "kit_menu_option": "on",
            "games_played_duels": 65,
            "rematch_option_1": "default",
            "mw_duels_class": "Herobrine",
            "duels_recently_played": "SW_TOURNAMENT#SW_DUEL#POTION_DUEL",
            "show_lb_option": "on",
            "duels_winstreak_best_potion_duel": 1,
            "duels_winstreak_potion_duel": 1,
            "selected_1": "sumo",
            "selected_2": "blitz",
            "blitz_duels_kit": "Horsetamer",
            "current_blitz_winstreak": 0,
            "current_winstreak": 0,
            "melee_swings": 129,
            "losses": 3,
            "melee_hits": 49,
            "blitz_duel_melee_swings": 9,
            "rounds_played": 11,
            "blitz_duel_damage_dealt": 13,
            "blitz_duel_melee_hits": 4,
            "blitz_duel_losses": 2,
            "deaths": 4,
            "blitz_duel_rounds_played": 2,
            "health_regenerated": 28,
            "damage_dealt": 63,
            "blitz_duel_health_regenerated": 3,
            "blitz_duel_deaths": 2,
            "sw_tournament_rounds_played": 7,
            "sw_tournament_melee_hits": 29,
            "sw_tournament_damage_dealt": 50,
            "sw_tournament_melee_swings": 104,
            "sw_tournament_health_regenerated": 23,
            "best_overall_winstreak": 1,
            "current_skywars_winstreak": 0,
            "best_skywars_winstreak": 1,
            "sw_duel_kit_wins": 1,
            "sw_duel_paladin_kit_wins": 1,
            "wins": 1,
            "sw_duel_health_regenerated": 2,
            "paladin_kit_wins": 1,
            "sw_duel_kills": 1,
            "kit_wins": 1,
            "kills": 3,
            "sw_duel_rounds_played": 1,
            "sw_duel_melee_hits": 13,
            "sw_duel_melee_swings": 13,
            "sw_duel_wins": 1,
            "sw_tournament_kills": 2,
            "chat_enabled": "on",
            "sw_tournament_deaths": 1,
            "current_uhc_winstreak": 0,
            "current_sumo_winstreak": 0,
            "sumo_duel_losses": 1,
            "sumo_duel_melee_swings": 3,
            "sumo_duel_rounds_played": 1,
            "sumo_duel_melee_hits": 3,
            "sumo_duel_deaths": 1,
            "current_op_winstreak": 0,
            "selected_1_new": "sumo",
            "selected_2_new": "blitz",
            "packages": [
                "fixedachievementsoct2018",
                "emblem_trophy",
                "killmessages_rainbow_km",
                "emblem_cute_dog",
                "kill_effect_charged_creeper"
            ],
            "skywars_rookie_title_prestige": 1,
            "op_rookie_title_prestige": 1,
            "sumo_rookie_title_prestige": 1,
            "mega_walls_rookie_title_prestige": 1,
            "uhc_rookie_title_prestige": 1,
            "no_debuff_rookie_title_prestige": 1,
            "bow_rookie_title_prestige": 1,
            "combo_rookie_title_prestige": 1,
            "blitz_rookie_title_prestige": 1,
            "tnt_games_rookie_title_prestige": 1,
            "bridge_rookie_title_prestige": 1,
            "tournament_rookie_title_prestige": 1,
            "classic_rookie_title_prestige": 1,
            "all_modes_rookie_title_prestige": 1,
            "duels_chests": 54,
            "coins": 34000
        },
        "SkyBlock": {
            "profiles": {
                "e72660b18b88424ea23f2cdd3597c581": {
                    "profile_id": "e72660b1-8b88-424e-a23f-2cdd3597c581",
                    "cute_name": "Grapes"
                }
            }
        },
        "Pit": {
            "pit_stats_ptl": {
                "playtime_minutes": 15,
                "arrows_fired": 2,
                "cash_earned": 79,
                "damage_dealt": 71,
                "damage_received": 137,
                "deaths": 6,
                "ghead_eaten": 2,
                "ingots_cash": 2,
                "ingots_picked_up": 1,
                "joins": 2,
                "jumped_into_pit": 5,
                "kills": 3,
                "launched_by_launchers": 1,
                "left_clicks": 53,
                "lucky_diamond_pieces": 1,
                "max_streak": 1,
                "melee_damage_dealt": 71,
                "melee_damage_received": 137,
                "sword_hits": 26
            },
            "profile": {
                "moved_achievements_1": true,
                "outgoing_offers": [],
                "moved_achievements_2": true,
                "contract_choices": null,
                "chat_option_streaks": false,
                "last_save": 1696443623567,
                "king_quest": {
                    "kills": 3
                },
                "spire_stash_inv": {
                    "type": 0,
                    "data": [
                        31,
                        -117,
                        8,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        -29,
                        98,
                        96,
                        -32,
                        100,
                        96,
                        -52,
                        100,
                        0,
                        3,
                        0,
                        -58,
                        2,
                        -70,
                        27,
                        13,
                        0,
                        0,
                        0
                    ]
                },
                "zero_point_three_gold_transfer": true,
                "inv_enderchest": {
                    "type": 0,
                    "data": [
                        31,
                        -117,
                        8,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        -29,
                        98,
                        96,
                        -32,
                        100,
                        96,
                        -52,
                        -28,
                        98,
                        96,
                        96,
                        -112,
                        102,
                        98,
                        96,
                        -54,
                        76,
                        97,
                        52,
                        102,
                        100,
                        96,
                        117,
                        -50,
                        47,
                        -51,
                        43,
                        97,
                        -28,
                        98,
                        96,
                        46,
                        73,
                        76,
                        103,
                        100,
                        -32,
                        14,
                        -51,
                        75,
                        42,
                        74,
                        77,
                        -52,
                        78,
                        76,
                        -54,
                        73,
                        101,
                        100,
                        96,
                        98,
                        96,
                        115,
                        73,
                        -52,
                        77,
                        76,
                        79,
                        5,
                        106,
                        -127,
                        -24,
                        48,
                        -89,
                        -125,
                        14,
                        -46,
                        93,
                        101,
                        70,
                        -126,
                        14,
                        -104,
                        30,
                        17,
                        -110,
                        109,
                        33,
                        93,
                        -121,
                        9,
                        77,
                        117,
                        -48,
                        -39,
                        51,
                        -90,
                        36,
                        -21,
                        -80,
                        -92,
                        -87,
                        14,
                        50,
                        -67,
                        -49,
                        0,
                        0,
                        -103,
                        60,
                        -93,
                        -45,
                        7,
                        3,
                        0,
                        0
                    ]
                },
                "death_recaps": {
                    "type": 0,
                    "data": [
                        31,
                        -117,
                        8,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        -19,
                        90,
                        95,
                        111,
                        -38,
                        72,
                        16,
                        55,
                        57,
                        -91,
                        74,
                        -13,
                        122,
                        15,
                        -9,
                        120,
                        123,
                        -106,
                        42,
                        -35,
                        41,
                        52,
                        -79,
                        33,
                        -127,
                        -32,
                        -73,
                        -124,
                        112,
                        77,
                        -43,
                        -92,
                        69,
                        -23,
                        93,
                        85,
                        41,
                        65,
                        -43,
                        -126,
                        7,
                        123,
                        -59,
                        -30,
                        -27,
                        -42,
                        -21,
                        -92,
                        28,
                        -30,
                        -23,
                        62,
                        76,
                        -66,
                        71,
                        -34,
                        -18,
                        91,
                        -35,
                        46,
                        -76,
                        -124,
                        -88,
                        -59,
                        38,
                        57,
                        27,
                        7,
                        19,
                        9,
                        89,
                        120,
                        -1,
                        -49,
                        -49,
                        -77,
                        -77,
                        -77,
                        -65,
                        -103,
                        77,
                        77,
                        123,
                        -82,
                        -27,
                        -56,
                        -90,
                        -90,
                        105,
                        107,
                        107,
                        -38,
                        26,
                        -79,
                        115,
                        -1,
                        -28,
                        -76,
                        -11,
                        42,
                        11,
                        60,
                        -111,
                        -37,
                        -44,
                        126,
                        16,
                        -40,
                        -55,
                        105,
                        63,
                        -70,
                        -3,
                        30,
                        -7,
                        12,
                        -12,
                        -112,
                        -79,
                        -50,
                        -69,
                        75,
                        -32,
                        -100,
                        -40,
                        -112,
                        123,
                        -82,
                        -83,
                        -9,
                        -80,
                        3,
                        -2,
                        -122,
                        -20,
                        -103,
                        -5,
                        -23,
                        -28,
                        92,
                        -65,
                        -71,
                        110,
                        -35,
                        92,
                        -45,
                        55,
                        -81,
                        79,
                        78,
                        -48,
                        89,
                        -83,
                        122,
                        80,
                        -41,
                        -13,
                        -6,
                        -123,
                        -89,
                        -25,
                        7,
                        -70,
                        -53,
                        100,
                        -97,
                        -38,
                        37,
                        120,
                        66,
                        -73,
                        6,
                        58,
                        110,
                        9,
                        -62,
                        60,
                        -35,
                        -46,
                        125,
                        -105,
                        93,
                        125,
                        18,
                        -16,
                        89,
                        -56,
                        -122,
                        -105,
                        -104,
                        6,
                        -96,
                        106,
                        91,
                        -116,
                        50,
                        46,
                        43,
                        29,
                        -114,
                        -5,
                        -78,
                        60,
                        -16,
                        108,
                        -32,
                        -108,
                        120,
                        96,
                        -21,
                        86,
                        27,
                        83,
                        31,
                        -14,
                        -6,
                        -88,
                        -121,
                        -91,
                        31,
                        -113,
                        -105,
                        -124,
                        124,
                        -32,
                        114,
                        116,
                        36,
                        72,
                        23,
                        100,
                        -5,
                        38,
                        -93,
                        -73,
                        45,
                        125,
                        -63,
                        73,
                        7,
                        -124,
                        -53,
                        89,
                        -32,
                        -72,
                        -109,
                        82,
                        34,
                        48,
                        37,
                        -83,
                        -55,
                        43,
                        107,
                        -74,
                        3,
                        -65,
                        -123,
                        -59,
                        100,
                        -122,
                        -31,
                        112,
                        50,
                        -57,
                        -51,
                        -11,
                        -66,
                        81,
                        -68,
                        -40,
                        49,
                        -52,
                        -117,
                        29,
                        115,
                        31,
                        -103,
                        -42,
                        94,
                        1,
                        29,
                        -100,
                        -22,
                        -33,
                        31,
                        120,
                        -104,
                        -116,
                        -76,
                        -78,
                        3,
                        -57,
                        -70,
                        117,
                        126,
                        -37,
                        -74,
                        15,
                        -108,
                        -78,
                        -85,
                        80,
                        108,
                        -10,
                        -54,
                        49,
                        65,
                        -111,
                        -65,
                        -57,
                        7,
                        105,
                        -96,
                        -8,
                        39,
                        -75,
                        49,
                        -17,
                        124,
                        114,
                        56,
                        -128,
                        23,
                        58,
                        117,
                        51,
                        112,
                        -38,
                        -100,
                        57,
                        78,
                        63,
                        -90,
                        21,
                        52,
                        38,
                        35,
                        -97,
                        39,
                        -96,
                        83,
                        -123,
                        -23,
                        -27,
                        -122,
                        -88,
                        -110,
                        -2,
                        101,
                        3,
                        -23,
                        111,
                        8,
                        -91,
                        -64,
                        -83,
                        -124,
                        -10,
                        -45,
                        -73,
                        26,
                        -58,
                        101,
                        109,
                        24,
                        -36,
                        101,
                        115,
                        -126,
                        -118,
                        -32,
                        -63,
                        -14,
                        106,
                        87,
                        -76,
                        98,
                        -43,
                        -79,
                        47,
                        -16,
                        -87,
                        122,
                        -100,
                        -87,
                        -57,
                        82,
                        -88,
                        23,
                        -2,
                        118,
                        -47,
                        -95,
                        -10,
                        -22,
                        -10,
                        -5,
                        63,
                        68,
                        -81,
                        -82,
                        92,
                        34,
                        96,
                        94,
                        -59,
                        -62,
                        127,
                        5,
                        56,
                        20,
                        -17,
                        -113,
                        -11,
                        -8,
                        -65,
                        114,
                        -56,
                        10,
                        -65,
                        -52,
                        106,
                        37,
                        -96,
                        91,
                        -111,
                        -94,
                        -18,
                        -115,
                        -74,
                        -10,
                        -62,
                        101,
                        -3,
                        64,
                        -28,
                        103,
                        -19,
                        34,
                        -30,
                        33,
                        -116,
                        122,
                        -104,
                        -117,
                        -72,
                        76,
                        -26,
                        -29,
                        7,
                        124,
                        -85,
                        -4,
                        34,
                        29,
                        -56,
                        63,
                        -42,
                        -111,
                        116,
                        -100,
                        124,
                        -127,
                        -22,
                        -64,
                        59,
                        -85,
                        3,
                        119,
                        -79,
                        -110,
                        18,
                        -34,
                        85,
                        70,
                        105,
                        -32,
                        43,
                        -37,
                        -75,
                        42,
                        88,
                        -65,
                        44,
                        25,
                        41,
                        97,
                        125,
                        -58,
                        84,
                        -99,
                        -115,
                        -126,
                        -34,
                        47,
                        -79,
                        31,
                        -114,
                        -121,
                        -40,
                        -121,
                        -72,
                        -48,
                        -100,
                        62,
                        32,
                        -117,
                        91,
                        -59,
                        -47,
                        57,
                        -13,
                        -3,
                        83,
                        113,
                        -16,
                        -75,
                        33,
                        10,
                        105,
                        -110,
                        -8,
                        73,
                        -23,
                        40,
                        -103,
                        -61,
                        -128,
                        87,
                        13,
                        -48,
                        -81,
                        -50,
                        111,
                        89,
                        -47,
                        -15,
                        72,
                        -127,
                        77,
                        35,
                        29,
                        13,
                        127,
                        -91,
                        -128,
                        -50,
                        -98,
                        -3,
                        -114,
                        -60,
                        123,
                        -53,
                        76,
                        -53,
                        -90,
                        100,
                        -50,
                        126,
                        71,
                        98,
                        -83,
                        -20,
                        -9,
                        -46,
                        -104,
                        -49,
                        -110,
                        -4,
                        -19,
                        110,
                        -17,
                        26,
                        -50,
                        44,
                        -5,
                        -40,
                        -104,
                        106,
                        -68,
                        -33,
                        102,
                        124,
                        -74,
                        33,
                        -67,
                        123,
                        -51,
                        61,
                        -62,
                        93,
                        -20,
                        0,
                        58,
                        97,
                        -50,
                        -19,
                        85,
                        -9,
                        -1,
                        93,
                        78,
                        -94,
                        73,
                        36,
                        -36,
                        -21,
                        -127,
                        44,
                        71,
                        21,
                        -28,
                        67,
                        -117,
                        121,
                        -74,
                        -113,
                        -102,
                        32,
                        -105,
                        12,
                        -56,
                        6,
                        44,
                        -36,
                        36,
                        8,
                        -91,
                        -118,
                        -65,
                        -8,
                        -93,
                        39,
                        -22,
                        66,
                        63,
                        70,
                        62,
                        1,
                        105,
                        91,
                        -26,
                        118,
                        41,
                        57,
                        113,
                        -27,
                        94,
                        -18,
                        78,
                        -117,
                        59,
                        91,
                        -64,
                        1,
                        -79,
                        -83,
                        66,
                        -87,
                        -20,
                        -25,
                        71,
                        -68,
                        -90,
                        101,
                        54,
                        -13,
                        2,
                        59,
                        -42,
                        -32,
                        79,
                        -81,
                        -55,
                        1,
                        119,
                        112,
                        -109,
                        -126,
                        42,
                        27,
                        -26,
                        -57,
                        64,
                        88,
                        -122,
                        -97,
                        31,
                        38,
                        -127,
                        -58,
                        41,
                        80,
                        -128,
                        -24,
                        109,
                        51,
                        -1,
                        -115,
                        61,
                        102,
                        125,
                        -71,
                        -41,
                        -64,
                        -9,
                        39,
                        28,
                        38,
                        125,
                        70,
                        -37,
                        61,
                        114,
                        -36,
                        -10,
                        52,
                        85,
                        -122,
                        -28,
                        -5,
                        113,
                        29,
                        -31,
                        -74,
                        0,
                        110,
                        -55,
                        -105,
                        -106,
                        -79,
                        109,
                        -52,
                        99,
                        -128,
                        -54,
                        -25,
                        99,
                        90,
                        -70,
                        108,
                        -54,
                        -1,
                        -115,
                        89,
                        61,
                        30,
                        -62,
                        -97,
                        -36,
                        49,
                        115,
                        -51,
                        121,
                        -71,
                        60,
                        69,
                        41,
                        -5,
                        106,
                        -3,
                        71,
                        -81,
                        -33,
                        87,
                        -33,
                        -67,
                        125,
                        91,
                        -85,
                        -2,
                        81,
                        59,
                        -6,
                        90,
                        -119,
                        -58,
                        127,
                        26,
                        27,
                        -38,
                        51,
                        28,
                        8,
                        -105,
                        113,
                        45,
                        -121,
                        54,
                        -76,
                        117,
                        65,
                        4,
                        5,
                        -7,
                        87,
                        91,
                        -45,
                        -98,
                        -115,
                        53,
                        84,
                        -111,
                        -11,
                        15,
                        -26,
                        -22,
                        127,
                        -2,
                        55,
                        -85,
                        92,
                        125,
                        -23,
                        98,
                        -57,
                        44,
                        -116,
                        -71,
                        122,
                        -45,
                        50,
                        13,
                        84,
                        79,
                        -99,
                        -84,
                        -113,
                        60,
                        -6,
                        75,
                        -5,
                        -39,
                        -32,
                        82,
                        -17,
                        -53,
                        -44,
                        39,
                        -31,
                        90,
                        70,
                        10,
                        -2,
                        94,
                        40,
                        115,
                        -97,
                        -124,
                        -117,
                        23,
                        117,
                        -62,
                        22,
                        -110,
                        -112,
                        119,
                        -114,
                        72,
                        -112,
                        -110,
                        -40,
                        115,
                        -124,
                        -5,
                        -78,
                        -22,
                        98,
                        -30,
                        17,
                        -49,
                        73,
                        105,
                        29,
                        -22,
                        22,
                        5,
                        30,
                        58,
                        6,
                        108,
                        -5,
                        75,
                        -63,
                        -94,
                        63,
                        -6,
                        32,
                        -51,
                        104,
                        -61,
                        -11,
                        2,
                        -34,
                        -93,
                        -31,
                        23,
                        -102,
                        74,
                        49,
                        27,
                        6,
                        38,
                        58,
                        118,
                        -16,
                        55,
                        -64,
                        -118,
                        89,
                        21,
                        51,
                        -91,
                        -35,
                        124,
                        42,
                        11,
                        -69,
                        -40,
                        75,
                        105,
                        -10,
                        67,
                        -27,
                        -17,
                        -12,
                        -47,
                        -79,
                        124,
                        2,
                        79,
                        105,
                        13,
                        31,
                        112,
                        -73,
                        71,
                        120,
                        92,
                        94,
                        76,
                        -78,
                        -90,
                        -84,
                        -87,
                        118,
                        -58,
                        -4,
                        119,
                        -118,
                        -89,
                        40,
                        -32,
                        2,
                        -115,
                        86,
                        74,
                        81,
                        -64,
                        26,
                        69,
                        -81,
                        -80,
                        96,
                        43,
                        3,
                        -13,
                        86,
                        74,
                        56,
                        -1,
                        78,
                        -72,
                        47,
                        80,
                        17,
                        117,
                        -92,
                        115,
                        16,
                        -105,
                        -33,
                        -77,
                        4,
                        104,
                        -17,
                        -90,
                        27,
                        104,
                        93,
                        29,
                        -96,
                        -51,
                        -76,
                        98,
                        -84,
                        -53,
                        25,
                        -9,
                        51,
                        -53,
                        79,
                        -127,
                        -65,
                        -57,
                        -90,
                        -28,
                        -113,
                        54,
                        -16,
                        119,
                        -57,
                        -51,
                        92,
                        25,
                        -76,
                        -45,
                        -78,
                        -35,
                        25,
                        -13,
                        72,
                        -94,
                        113,
                        126,
                        -14,
                        72,
                        86,
                        64,
                        -85,
                        15,
                        120,
                        -105,
                        113,
                        100,
                        -109,
                        118,
                        27,
                        56,
                        120,
                        -83,
                        -72,
                        -18,
                        -117,
                        79,
                        -128,
                        71,
                        103,
                        107,
                        -84,
                        14,
                        -44,
                        -46,
                        9,
                        92,
                        26,
                        31,
                        76,
                        37,
                        15,
                        20,
                        11,
                        89,
                        -53,
                        30,
                        40,
                        44,
                        44,
                        123,
                        -96,
                        -80,
                        82,
                        -39,
                        3,
                        -91,
                        -39,
                        49,
                        -34,
                        -59,
                        103,
                        15,
                        -104,
                        41,
                        103,
                        15,
                        -108,
                        14,
                        56,
                        31,
                        -79,
                        -110,
                        -39,
                        -54,
                        30,
                        8,
                        103,
                        39,
                        99,
                        77,
                        25,
                        48,
                        119,
                        -25,
                        -49,
                        25,
                        -40,
                        -69,
                        -71,
                        -90,
                        -107,
                        -30,
                        -68,
                        57,
                        3,
                        -95,
                        66,
                        -92,
                        -100,
                        40,
                        -96,
                        -3,
                        7,
                        88,
                        46,
                        59,
                        -13,
                        -30,
                        55,
                        0,
                        0
                    ]
                },
                "spire_stash_armor": {
                    "type": 0,
                    "data": [
                        31,
                        -117,
                        8,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        -29,
                        98,
                        96,
                        -32,
                        100,
                        96,
                        -52,
                        100,
                        0,
                        3,
                        0,
                        -58,
                        2,
                        -70,
                        27,
                        13,
                        0,
                        0,
                        0
                    ]
                },
                "cash": 2202.9636737589362,
                "last_midfight_disconnect": 1528859405121,
                "leaderboard_stats": {},
                "selected_perk_2": "lucky_diamond",
                "inv_armor": {
                    "type": 0,
                    "data": [
                        31,
                        -117,
                        8,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        -29,
                        98,
                        96,
                        -32,
                        100,
                        96,
                        -52,
                        -28,
                        98,
                        96,
                        96,
                        96,
                        97,
                        98,
                        96,
                        -54,
                        76,
                        97,
                        52,
                        101,
                        100,
                        96,
                        117,
                        -50,
                        47,
                        -51,
                        43,
                        97,
                        -28,
                        98,
                        96,
                        46,
                        73,
                        76,
                        103,
                        100,
                        -32,
                        14,
                        -51,
                        75,
                        42,
                        74,
                        77,
                        -52,
                        78,
                        76,
                        -54,
                        73,
                        101,
                        100,
                        96,
                        98,
                        96,
                        115,
                        73,
                        -52,
                        77,
                        76,
                        79,
                        5,
                        106,
                        -127,
                        -24,
                        48,
                        32,
                        89,
                        -121,
                        62,
                        9,
                        58,
                        24,
                        24,
                        0,
                        -84,
                        32,
                        -32,
                        30,
                        -92,
                        0,
                        0,
                        0
                    ]
                },
                "selected_perk_1": "strength_chaining",
                "selected_perk_0": "golden_heads",
                "last_contract": 1529016057637,
                "item_stash": {
                    "type": 0,
                    "data": [
                        31,
                        -117,
                        8,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        -29,
                        98,
                        96,
                        -32,
                        100,
                        96,
                        -52,
                        100,
                        0,
                        3,
                        0,
                        -58,
                        2,
                        -70,
                        27,
                        13,
                        0,
                        0,
                        0
                    ]
                },
                "chat_option_kill_feed": false,
                "login_messages": [],
                "hotbar_favorites": [
                    0,
                    267,
                    261,
                    307,
                    0,
                    0,
                    0,
                    276,
                    0
                ],
                "xp": 13857,
                "inv_contents": {
                    "type": 0,
                    "data": [
                        31,
                        -117,
                        8,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        -29,
                        98,
                        96,
                        -32,
                        100,
                        96,
                        -52,
                        -28,
                        98,
                        96,
                        96,
                        80,
                        97,
                        96,
                        98,
                        96,
                        -54,
                        76,
                        97,
                        -28,
                        102,
                        100,
                        96,
                        117,
                        -50,
                        47,
                        -51,
                        43,
                        97,
                        -28,
                        98,
                        96,
                        46,
                        73,
                        76,
                        103,
                        100,
                        -32,
                        14,
                        -51,
                        75,
                        42,
                        74,
                        77,
                        -52,
                        78,
                        76,
                        -54,
                        73,
                        101,
                        4,
                        -86,
                        98,
                        115,
                        73,
                        -52,
                        77,
                        76,
                        79,
                        5,
                        -22,
                        -127,
                        -24,
                        96,
                        37,
                        65,
                        7,
                        24,
                        64,
                        -76,
                        -79,
                        -63,
                        -76,
                        41,
                        96,
                        40,
                        -64,
                        1,
                        0,
                        -32,
                        -5,
                        -45,
                        25,
                        -82,
                        0,
                        0,
                        0
                    ]
                },
                "ended_contracts": [
                    {
                        "difficulty": "HARD",
                        "gold_reward": 2400,
                        "requirements": {
                            "kills": 1
                        },
                        "progress": {
                            "kills": 0
                        },
                        "completion_date": 0,
                        "remaining_ticks": 0,
                        "key": "no_weapon_kill"
                    }
                ],
                "bounties": [],
                "unlocks": [
                    {
                        "tier": 0,
                        "acquireDate": 1519682723288,
                        "key": "cash_boost"
                    },
                    {
                        "tier": 0,
                        "acquireDate": 1519712555499,
                        "key": "golden_heads"
                    },
                    {
                        "tier": 0,
                        "acquireDate": 1519713733358,
                        "key": "fishing_rod"
                    },
                    {
                        "tier": 0,
                        "acquireDate": 1519857894671,
                        "key": "xp_boost"
                    },
                    {
                        "tier": 1,
                        "acquireDate": 1519885097217,
                        "key": "cash_boost"
                    },
                    {
                        "tier": 0,
                        "acquireDate": 1521514197282,
                        "key": "lucky_diamond"
                    },
                    {
                        "tier": 0,
                        "acquireDate": 1521515393199,
                        "key": "trickle_down"
                    },
                    {
                        "tier": 0,
                        "acquireDate": 1521516891462,
                        "key": "strength_chaining"
                    },
                    {
                        "tier": 0,
                        "acquireDate": 1528748441216,
                        "key": "el_gato"
                    },
                    {
                        "tier": 2,
                        "acquireDate": 1528859795594,
                        "key": "cash_boost"
                    },
                    {
                        "tier": 0,
                        "acquireDate": 1528859802253,
                        "key": "melee_damage"
                    },
                    {
                        "tier": 1,
                        "acquireDate": 1528859821677,
                        "key": "melee_damage"
                    },
                    {
                        "tier": 2,
                        "acquireDate": 1528859824075,
                        "key": "melee_damage"
                    },
                    {
                        "tier": 1,
                        "acquireDate": 1529014852123,
                        "key": "el_gato"
                    },
                    {
                        "tier": 2,
                        "acquireDate": 1529014858156,
                        "key": "el_gato"
                    },
                    {
                        "tier": 0,
                        "acquireDate": 1529014866267,
                        "key": "damage_reduction"
                    },
                    {
                        "tier": 1,
                        "acquireDate": 1529014869360,
                        "key": "damage_reduction"
                    },
                    {
                        "tier": 2,
                        "acquireDate": 1529014871224,
                        "key": "damage_reduction"
                    },
                    {
                        "tier": 3,
                        "acquireDate": 1529014873223,
                        "key": "melee_damage"
                    },
                    {
                        "tier": 3,
                        "acquireDate": 1529014874977,
                        "key": "damage_reduction"
                    },
                    {
                        "tier": 0,
                        "acquireDate": 1529014884425,
                        "key": "bow_damage"
                    }
                ],
                "cash_during_prestige_0": 39102.96367375887
            }
        },
        "Housing": {
            "packages": [
                "skull_pack_holiday"
            ]
        },
        "MainLobby": {
            "questNPCTutorials": {
                "zone_spawn": true,
                "zone_mines": true,
                "zone_port": true,
                "zone_village": true,
                "zone_castle": true,
                "zone_farm": true,
                "zone_paintball_fight": true,
                "zone_ruins": true,
                "zone_ancient_statues": true,
                "zone_fishing_hut": true,
                "dockmaster": true,
                "zone_labyrinth": true,
                "achievement_guide": true,
                "summer_guide_2022": true
            },
            "discoveredZones": {
                "mines": true,
                "port": true,
                "village": true,
                "castle": true,
                "farm": true,
                "paintball_fight": true,
                "ruins": true,
                "ancient_statues": true,
                "fishing_hut": true,
                "labyrinth": true
            },
            "historicalRecords": {
                "warlords_beta": true,
                "skywars_release": true,
                "ptl_release": true,
                "mm_beta": true,
                "hytale": true,
                "smp_beta": true,
                "august_mega_update": true,
                "skyblock_release": true,
                "mystery_update": true,
                "wiki_release": true
            },
            "relics": {
                "tkr": true,
                "mega_walls": true,
                "tnt_games": true,
                "vampirez": true,
                "quake": true,
                "bow_spleef": true,
                "golem": true,
                "blitz": true,
                "code": true
            },
            "fishing": {
                "stats": {
                    "permanent": {
                        "water": {
                            "fish": 22,
                            "junk": 4,
                            "treasure": 1
                        }
                    }
                }
            }
        },
        "WoolGames": {
            "progression": {
                "available_layers": 1
            }
        }
    },
    "testPass": true,
    "thanksReceived": 72,
    "thanksSent": 231,
    "timePlaying": 64956,
    "tournamentTokens": 7,
    "uuid": "e72660b18b88424ea23f2cdd3597c581",
    "vanityMeta": {
        "packages": [
            "disguise_iron_golem",
            "gadget_trampoline",
            "gadget_firework_victory_dance",
            "gadget_kookie_fountain",
            "pet_sheep_white",
            "pet_sheep_black_baby",
            "pet_horse_creamy_baby",
            "pet_sheep_brown_baby",
            "pet_sheep_yellow_baby",
            "pet_sheep_silver_baby",
            "pet_skeleton",
            "pet_sheep_black",
            "pet_sheep_brown",
            "pet_cat_red",
            "pet_horse_gray_baby",
            "pet_sheep_pink_baby",
            "pet_sheep_magenta",
            "pet_iron_golem",
            "pet_sheep_red_baby",
            "pet_sheep_orange",
            "pet_sheep_light_blue_baby",
            "pet_spider",
            "pet_sheep_orange_baby",
            "pet_horse_white",
            "pet_cat_red_baby",
            "pet_sheep_cyan_baby",
            "pet_horse_chestnut",
            "pet_horse_grey",
            "pet_sheep_lime_baby",
            "pet_sheep_blue_baby",
            "pet_cat_siamese_baby",
            "pet_snowman",
            "pet_horse_dark_brown_baby",
            "pet_horse_chestnut_baby",
            "pet_sheep_cyan",
            "pet_sheep_white_baby",
            "pet_sheep_yellow",
            "pet_sheep_green_baby",
            "pet_cat_black",
            "pet_sheep_purple_baby",
            "pet_horse_black",
            "pet_wolf_baby",
            "pet_sheep_blue",
            "pet_sheep_gray_baby",
            "pet_horse_skeleton",
            "pet_sheep_green",
            "pet_horse_dark_brown",
            "pet_horse_undead",
            "pet_horse_brown",
            "pet_sheep_gray",
            "pet_cat_black_baby",
            "pet_sheep_lime",
            "pet_sheep_magenta_baby",
            "pet_squid",
            "pet_sheep_red",
            "pet_sheep_pink",
            "pet_sheep_purple",
            "pet_wolf",
            "pet_horse_creamy",
            "pet_sheep_light_blue",
            "pet_mooshroom",
            "pet_sheep_silver",
            "pet_cat_siamese",
            "pet_witch",
            "gadget_paint_trail",
            "pet_mooshroom_baby",
            "gadget_explosive_bow",
            "suit_ghost_boots",
            "gadget_paintball_gun",
            "hat_duck",
            "pet_silverfish",
            "pet_pig",
            "pet_slime_small",
            "suit_flash_boots",
            "morph_cow",
            "suit_disco_boots",
            "pet_cow_baby",
            "morph_enderman",
            "hat_turtle",
            "hat_koala",
            "hat_walrus",
            "gadget_rocket",
            "pet_chicken",
            "hat_letter_g",
            "hat_doge",
            "suit_frog_leggings",
            "gadget_tetherball",
            "hat_letter_k",
            "hat_beach_ball",
            "hat_astronaut",
            "hat_letter_b",
            "hat_letter_q",
            "hat_letter_h",
            "morph_pig",
            "hat_monkey",
            "morph_sheep",
            "suit_ghost_chestplate",
            "hat_cactus",
            "gadget_disco_ball",
            "hat_clown",
            "morph_zombie",
            "suit_frog_helmet",
            "hat_earth",
            "hat_clownfish",
            "hat_letter_w",
            "hat_letter_j",
            "hat_letter_r",
            "hat_ferret",
            "suit_ghost_leggings",
            "hat_letter_v",
            "morph_spider",
            "hat_bee",
            "hat_burger",
            "morph_iron_golem",
            "hat_halloween_pig_zombie",
            "gadget_bat_launcher",
            "morph_skeleton",
            "gadget_scare_crow",
            "suit_frog_boots",
            "suit_vampire_helmet",
            "cloak_superhero",
            "gadget_parachute",
            "suit_vampire_leggings",
            "hat_halloween_ghast",
            "suit_vampire_chestplate",
            "suit_vampire_boots",
            "hat_letter_y",
            "cloak_firewings",
            "pet_cave_spider",
            "hat_letter_d",
            "gadget_exploding_sheep",
            "pet_zombie",
            "cloak_icy_wings",
            "hat_letter_x",
            "gadget_party_popper",
            "pet_red_helper",
            "hat_ginger_bread",
            "suit_toy_leggings",
            "hat_present_hat",
            "hat_snowman",
            "hat_candy_cane",
            "suit_santa_helmet",
            "morph_grinch",
            "hat_decoration_ball",
            "suit_santa_boots",
            "suit_toy_boots",
            "suit_toy_chestplate",
            "cloak_frosty_cloak",
            "hat_reindeer",
            "gadget_let_snow",
            "gadget_holiday_choir",
            "cloak_mystical",
            "hat_letter_z",
            "morph_creeper",
            "pet_chicken_baby",
            "pet_green_helper",
            "gadget_creeper_astronaut",
            "pet_creeper_powered",
            "pet_villager_farmer_baby",
            "gadget_holiday_tree",
            "gadget_ghosts",
            "suit_santa_chestplate",
            "pet_villager_priest",
            "gadget_poop_bomb",
            "hat_monitor",
            "hat_letter_t",
            "hat_letter_s",
            "hat_letter_u",
            "hat_horse",
            "gadget_fire_trail",
            "gadget_secret_service",
            "pet_brown_horse_baby",
            "suit_disco_chestplate",
            "gadget_tnt_fountain",
            "hat_letter_e",
            "hat_letter_hashtag",
            "emote_sad",
            "suit_thor_boots",
            "taunt_victory",
            "gadget_jetpack",
            "gadget_fortune_cookie",
            "gadget_radio",
            "hat_letter_p",
            "suit_mermaid_boots",
            "rankcolor_gold",
            "rankcolor_green",
            "hat_frog",
            "morph_chicken",
            "gadget_teleporter",
            "suit_warrior_chestplate",
            "suit_baker_boots",
            "suit_death_angel_boots",
            "suit_plumber_boots",
            "emote_surprised",
            "emote_sun_tan",
            "gadget_ice_cream_stand",
            "gadget_water_balloon",
            "suit_pirate_leggings",
            "taunt_sun",
            "suit_pirate_boots",
            "hat_space",
            "emote_spicy",
            "suit_dragon_breath_boots",
            "gadget_dj_booth",
            "gadget_chicken_cannon",
            "hat_evil_eye",
            "taunt_graduation",
            "hat_golem",
            "taunt_mind",
            "gadget_frisbee",
            "gadget_flower_giver",
            "suit_wolf_chestplate",
            "suit_soccer_leggings",
            "suit_solar_chestplate",
            "suit_solar_helmet",
            "taunt_ballet",
            "suit_tnt_boots",
            "taunt_can",
            "suit_tnt_leggings",
            "taunt_hula",
            "emote_deal_with_it",
            "gadget_rainbow",
            "suit_soccer_boots",
            "pet_pig_zombie",
            "taunt_clapping",
            "suit_frog_chestplate",
            "suit_flash_helmet",
            "suit_flash_chestplate",
            "suit_flash_leggings",
            "emote_cheeky",
            "taunt_crab_dance",
            "suit_pirate_chestplate",
            "hat_robo_bird",
            "emote_cool",
            "hat_number_1",
            "hat_elephant",
            "pet_zombie_baby",
            "emote_grin",
            "emote_smile",
            "hat_golden_knight",
            "suit_ninja_leggings",
            "hat_mars",
            "taunt_hype_dance",
            "hat_letter_m",
            "emote_sleepy",
            "emote_wink",
            "hat_number_7",
            "hat_number_4",
            "hat_squid",
            "suit_arctic_boots",
            "suit_dragon_breath_chestplate",
            "hat_number_3",
            "hat_letter_o",
            "hat_letter_i",
            "suit_spiderman_boots",
            "pet_cow",
            "suit_fireman_boots",
            "suit_spiderman_leggings",
            "hat_number_9",
            "hat_number_2",
            "hat_forester",
            "suit_bumblebee_boots",
            "hat_parrot",
            "taunt_goodbye",
            "emote_cry",
            "suit_wolf_boots",
            "suit_mermaid_helmet",
            "hat_letter_exclaimation",
            "hat_polar_bear",
            "hat_wood_steve",
            "hat_ender_dragon",
            "hat_white_wizard",
            "hat_toaster",
            "hat_number_8",
            "cloak_vampire_wings",
            "suit_costume_chestplate",
            "hat_werewolf",
            "hat_scarecrow2",
            "suit_costume_boots",
            "hat_halloween_skull",
            "suit_treasure_chestplate",
            "suit_costume_leggings",
            "hat_halloween_marionette",
            "hat_halloween_evil_pumpkin",
            "pet_villager_librarian",
            "taunt_possessed",
            "suit_bumblebee_helmet",
            "suit_costume_helmet",
            "hat_panda",
            "hat_egyptian_queen",
            "suit_warrior_boots",
            "hat_pug_white",
            "hat_groopo",
            "hat_santa",
            "suit_grinch_helmet",
            "hat_letter_n",
            "pet_bat",
            "hat_number_0",
            "taunt_cool_dance",
            "pet_endermite",
            "cloak_shaman",
            "gadget_tennis_ball",
            "gadget_magic_carpet",
            "gadget_meteorite",
            "gadget_grappling_hook",
            "gadget_wizardwand",
            "gadget_horror_movie",
            "morph_blaze",
            "hat_letter_a",
            "hat_bird",
            "hat_letter_c",
            "hat_letter_f",
            "hat_letter_l",
            "hat_number_5",
            "hat_number_6",
            "hat_letter_plus",
            "hat_letter_question",
            "hat_snowglobe",
            "taunt_wave_dance",
            "suit_ninja_helmet",
            "suit_ninja_chestplate",
            "suit_ninja_boots",
            "suit_ghost_helmet",
            "suit_disco_leggings",
            "suit_disco_helmet",
            "suit_mermaid_leggings",
            "suit_mermaid_chestplate",
            "suit_spiderman_chestplate",
            "suit_spiderman_helmet",
            "suit_warrior_helmet",
            "suit_warrior_leggings",
            "suit_necromancer_boots",
            "suit_necromancer_leggings",
            "suit_necromancer_chestplate",
            "suit_necromancer_helmet",
            "suit_thor_leggings",
            "suit_thor_chestplate",
            "suit_thor_helmet",
            "suit_death_angel_leggings",
            "suit_death_angel_chestplate",
            "suit_death_angel_helmet",
            "suit_baker_leggings",
            "suit_baker_chestplate",
            "suit_baker_helmet",
            "suit_bumblebee_leggings",
            "suit_bumblebee_chestplate",
            "suit_fireman_helmet",
            "suit_fireman_chestplate",
            "suit_fireman_leggings",
            "suit_toy_helmet",
            "hat_gingerbread",
            "suit_grinch_chestplate",
            "gadget_new_year",
            "hat_bauble",
            "suit_grinch_boots",
            "suit_santa_leggings",
            "gadget_christmas_cracker",
            "hat_elfgirl",
            "hat_elfboy",
            "suit_new_years_helmet",
            "suit_new_years_chestplate",
            "emote_angry",
            "hat_egg_head",
            "hat_sandwich",
            "hat_cheese",
            "hat_penguin",
            "hat_elf_princess",
            "hat_otter",
            "hat_dinosaur",
            "hat_mummy",
            "hat_orc",
            "hat_minotaur",
            "hat_demon_knight",
            "hat_scavenger",
            "hat_hypixel_h",
            "hat_miner",
            "hat_football_star",
            "hat_monk",
            "hat_wood_elf",
            "hat_dead_pirate",
            "hat_odin",
            "hat_assassin",
            "hat_rainbow_glitch",
            "hat_alien_slug",
            "hat_ghost",
            "hat_scarecrow",
            "hat_mage",
            "hat_fox",
            "hat_hp8",
            "hat_pug_black",
            "hat_owl",
            "hat_duckling",
            "hat_sloth",
            "hat_gorilla",
            "hat_magic_dog",
            "hat_lucky_dragon",
            "hat_shibe",
            "suit_plumber_leggings",
            "suit_plumber_chestplate",
            "suit_plumber_helmet",
            "suit_arctic_leggings",
            "pet_villager_blacksmith",
            "suit_arctic_helmet",
            "pet_enderman",
            "suit_arctic_chestplate",
            "pet_black_rabbit",
            "pet_black_white_rabbit",
            "pet_brown_rabbit",
            "pet_gold_rabbit",
            "pet_salt_pepper_rabbit",
            "pet_white_rabbit",
            "pet_villager_blacksmith_baby",
            "pet_villager_butcher",
            "pet_villager_butcher_baby",
            "pet_villager_farmer",
            "pet_villager_librarian_baby",
            "pet_zombie_villager",
            "pet_mule",
            "pet_villager_priest_baby",
            "pet_creeper",
            "rankcolor_yellow",
            "pet_donkey",
            "pet_pig_baby",
            "pet_pig_zombie_baby",
            "pet_slime_big",
            "pet_slime_tiny",
            "pet_magma_cube_tiny",
            "pet_magma_cube_small",
            "pet_magma_cube_big",
            "emote_relax",
            "taunt_hi_5",
            "suit_dragon_breath_helmet",
            "taunt_karaoke",
            "emote_heart",
            "gadget_sand_castle",
            "suit_tnt_chestplate",
            "suit_tnt_helmet",
            "suit_wolf_leggings",
            "gadget_pocket_beach",
            "suit_soccer_chestplate",
            "suit_wolf_helmet",
            "hat_aqua_orb",
            "hat_siren",
            "suit_dragon_breath_leggings",
            "hat_fire_demon",
            "hat_broken_tv",
            "gadget_dice",
            "emote_rip",
            "gadget_diving_board",
            "taunt_jump",
            "morph_guardian",
            "pet_herobrine",
            "rankcolor_light_purple",
            "gadget_swing",
            "gadget_rock_paper_shears",
            "gadget_pong",
            "gadget_hype_train",
            "gadget_rush_pearl",
            "gadget_pumpkin_cannon",
            "hat_clown2",
            "suit_treasure_helmet",
            "emote_face_melter",
            "hat_vintage",
            "pet_totem",
            "cloak_scanner",
            "rankcolor_white",
            "hat_joe_penguin",
            "taunt_snowball_toss",
            "hat_gingerbread_man",
            "hat_comet_reindeer",
            "gadget_advent_proof",
            "rankcolor_blue",
            "hat_basketball",
            "emote_dizzy",
            "suit_solar_boots",
            "gadget_tic_tac_toe",
            "taunt_zombie_dance",
            "cloak_rainy_day",
            "gadget_snowman",
            "suit_new_years_leggings",
            "cloak_lovely",
            "suit_phoenix_helmet",
            "pet_guardian",
            "cloak_achievement_points",
            "suit_pirate_helmet",
            "gadget_volleyball",
            "suit_phoenix_chestplate",
            "rankcolor_dark_green",
            "hat_snowball",
            "pet_frozen_zombie",
            "suit_elf_boots",
            "suit_yeti_boots",
            "cloak_candy_spiral",
            "suit_elf_chestplate",
            "particlepack_tinsel",
            "gadget_new_year_countdown",
            "particlepack_snow_trail",
            "suit_elf_leggings",
            "pet_frozen_skeleton",
            "pet_black_pug",
            "hat_ice_mage",
            "gadget_bbq_grill",
            "hat_festive_skeleton",
            "hat_rainbow_present",
            "hat_bell",
            "gadget_cornucopia",
            "gadget_firework_launcher",
            "cloak_sweetwings",
            "hat_snow_globe",
            "suit_elf_helmet",
            "hat_skull_king_banner",
            "hat_gift",
            "hat_grinch",
            "cloak_clover",
            "clickeffects_hypixel",
            "gadget_hot_potato",
            "suit_solar_leggings",
            "gadget_anniversary_trampoline",
            "hat_chick",
            "pet_growing_zombie",
            "hat_lady_bug",
            "suit_chicken_chestplate",
            "suit_easter_egg_leggings",
            "suit_easter_egg_boots"
        ]
    },
    "wardrobe": ",,GOLD_BOOTS,",
    "eugene": {
        "dailyTwoKExp": 1696894056984,
        "weekly_booster": 1430603247815
    },
    "voting": {
        "total_mcsorg": 72,
        "total": 222,
        "secondary_mcsorg": 72,
        "last_mcsorg": 1534431288361,
        "last_vote": 1534431288361,
        "total_mcmp": 34,
        "secondary_mcmp": 34,
        "last_mcmp": 1458447333435,
        "total_pmc": 16,
        "secondary_pmc": 16,
        "last_pmc": 1437334170723,
        "secondary_pact": 1,
        "total_pact": 1,
        "last_pact": 1430945252360,
        "secondary_mcsl": 47,
        "total_mcsl": 47,
        "last_mcsl": 1517642518067,
        "secondary_topg": 27,
        "total_topg": 27,
        "last_topg": 1501466478320,
        "secondary_minestatus": 21,
        "total_minestatus": 21,
        "last_minestatus": 1442967166476,
        "votesToday": 1,
        "total_mcipl": 1,
        "secondary_mcipl": 1,
        "last_mcipl": 1439229117092,
        "total_mcf": 3,
        "secondary_mcf": 3,
        "last_mcf": 1500829897552
    },
    "adventureTester": true,
    "housingMeta": {
        "tutorialStep": "FINISH_FINISHED",
        "packages": [
            "lollipop_theme",
            "default_theme",
            "jardin_theme",
            "fjord_theme",
            "haunted_mansion_theme",
            "housing_item_flag_1",
            "specialoccasion_christmas_skull_blue_present",
            "gifts_theme",
            "specialoccasion_christmas_skull_yellow_ornament",
            "north_pole_theme",
            "santas_workshop_theme",
            "flowers_theme",
            "specialoccasion_christmas_skull_green_present",
            "warlords_blue_theme",
            "sci_fi_theme",
            "fireplace_theme",
            "crystals_theme",
            "basic_theme",
            "housing_item_flag_3",
            "goldmine_theme",
            "specialoccasion_summer_2016_skull_beach_ball",
            "specialoccasion_summer_2016_skull_red_cooler",
            "day_at_the_beach_theme",
            "pool_party_bbq_theme",
            "specialoccasion_summer_2016_skull_ice_cream",
            "specialoccasion_reward_card_skull_mana_potion",
            "fruit_salad_theme",
            "nether_theme",
            "mushrooms_theme",
            "future_tech_theme",
            "specialoccasion_christmas_skull_holiday_toy",
            "specialoccasion_christmas_skull_red_ornament",
            "warlords_red_theme",
            "jungle_theme",
            "end_theme",
            "specialoccasion_reward_card_skull_agility_potion",
            "specialoccasion_summer_2016_skull_chocolate_mint_scoop",
            "specialoccasion_summer_2016_skull_frozen_yogurt",
            "specialoccasion_reward_card_skull_crown",
            "tenshu_theme",
            "specialoccasion_reward_card_skull_green_treasure_chest",
            "smileys_theme",
            "specialoccasion_reward_card_skull_golden_chalice",
            "specialoccasion_reward_card_skull_mystic_pearl",
            "specialoccasion_reward_card_skull_ornamental_helmet",
            "specialoccasion_reward_card_skull_health_potion",
            "specialoccasion_reward_card_skull_rubik's_cube",
            "town_square_theme",
            "painter_studio_theme",
            "specialoccasion_reward_card_skull_gold_nugget",
            "specialoccasion_reward_card_skull_jewelery_box",
            "specialoccasion_reward_card_skull_blue_treasure_chest",
            "specialoccasion_reward_card_skull_pot_o'_gold",
            "specialoccasion_reward_card_skull_coin_bag",
            "specialoccasion_reward_card_skull_red_treasure_chest",
            "specialoccasion_reward_card_skull_piggy_bank",
            "specialoccasion_reward_card_skull_pocket_galaxy",
            "air_theme",
            "specialoccasion_reward_card_skull_molten_core",
            "blocking_dead_theme",
            "northern_lights_theme",
            "vanilla_theme",
            "specialoccasion_summer_2016_skull_sand_bucket",
            "synced_cookies_v1",
            "farmland_theme",
            "vineyard_theme",
            "bayou_theme",
            "fortress_theme",
            "tropical_paradise_theme",
            "the_docks_theme",
            "gladiator_arena_theme",
            "burnwood_theme",
            "cursed_cove_theme",
            "courtyard_theme",
            "paris_theme",
            "palace_theme",
            "gothic_facade_theme",
            "amiri_temple_theme",
            "neighborhood_theme",
            "opera_theme",
            "venice_theme",
            "space_dock_theme",
            "parthenon_theme",
            "modern_suburb_theme",
            "haven_theme"
        ],
        "allowedBlocks": [
            "82:0",
            "1:1",
            "3:0",
            "13:0",
            "2:0",
            "5:0",
            "1:0",
            "4:0",
            "31:1",
            "324:0",
            "44:1",
            "161:1",
            "143:0",
            "5:3",
            "35:2",
            "330:0",
            "15:0",
            "42:0",
            "171:4",
            "135:0",
            "76:0",
            "39:0",
            "69:0",
            "184:0",
            "167:0",
            "6:2",
            "1:4",
            "24:1",
            "116:0",
            "171:15",
            "147:0",
            "38:6",
            "192:0",
            "126:2",
            "55:0",
            "40:0",
            "148:0",
            "98:2",
            "50:0",
            "98:0",
            "18:0",
            "35:0",
            "20:0",
            "85:0",
            "3:1",
            "38:0",
            "37:0",
            "53:0",
            "109:0",
            "44:0",
            "171:0",
            "139:0",
            "17:1",
            "5:2",
            "45:0",
            "5:1",
            "18:1",
            "126:0",
            "44:5",
            "80:0",
            "78:0",
            "1:3",
            "12:1",
            "172:0",
            "48:0",
            "12:0",
            "24:0",
            "32:0",
            "44:3",
            "6:0",
            "145:0",
            "65:0",
            "161:0",
            "31:2",
            "136:0",
            "113:0",
            "18:2",
            "160:0",
            "102:0",
            "6:5",
            "38:4",
            "126:3",
            "157:0",
            "77:0",
            "31:0",
            "323:0",
            "126:4",
            "70:0",
            "17:0",
            "338:0",
            "126:1",
            "86:0",
            "1:5",
            "1:6",
            "107:0",
            "160:2",
            "185:0",
            "390:0",
            "72:0",
            "41:0",
            "134:0",
            "99:0",
            "91:0",
            "54:0",
            "112:0",
            "325:0",
            "110:0",
            "88:0",
            "121:0",
            "35:9",
            "159:3",
            "155:0",
            "162:0",
            "87:0",
            "24:2",
            "326:0",
            "190:0",
            "84:0",
            "427:0",
            "14:0",
            "95:13",
            "189:0",
            "6:3",
            "171:8",
            "259:0",
            "5:5",
            "356:0",
            "179:0",
            "35:7",
            "146:0",
            "171:14",
            "1:2",
            "118:0",
            "35:1",
            "58:0",
            "89:0",
            "187:0",
            "56:0",
            "35:8",
            "98:1",
            "175:1",
            "103:0",
            "404:0",
            "95:10",
            "6:4",
            "162:1",
            "6:1",
            "19:0",
            "95:15",
            "38:7",
            "171:13",
            "168:0",
            "67:0",
            "160:8",
            "171:2",
            "38:2",
            "96:0",
            "22:0",
            "23:0",
            "35:13"
        ],
        "visibilityDisabled": false,
        "toggle_BORDER": true,
        "toggle_TIPS": false,
        "playerSettings": {
            "BORDER": "BooleanState-true",
            "VISIBILITY": "IntegerState-6",
            "TIPS": "BooleanState-false",
            "customVisibility": 1000
        },
        "playlist": "HOPPIN_BLOCKS,ENDLOBBY,HAPPY,CORPSE_PARTY,CANTINA,KIRBY_GOURMET,NYNY,PHWEE,BAD_APPLE,KEWL,MAD_WORLD,MBISON,SIMILAR,FUN,AZTEC,CHASED_BY_CREEPER,COMPTINE,LARGER_THAN_LIFE,VICTORY,VOTING,SCREAMING_OUT,DRAGONFLIES,ENTERTAINER,FEASIBILITY,CROSSING_FIELD,HILLY_ESCAPADES,PUMP_IT_UP,SUSPENSEFUL,INTERDIMENSIONAL,FEELS,OLYMPUS,ORIGINAL,MINECRAFT_IS_MY_LIFE,RED_HOUSE,ROLL,CIRNO,GAMEMODE8,",
        "firstHouseJoinMs": 1539828003218,
        "given_cookies_104994": [
            "837bc698-397b-4fc1-86b0-b5217161ab38"
        ],
        "given_cookies_104995": [
            "837bc698-397b-4fc1-86b0-b5217161ab38"
        ],
        "selectedChannels_v3": [
            "",
            "",
            "",
            "",
            "social"
        ],
        "plotSize": "EXTREME",
        "given_cookies_105237": [
            "837bc698-397b-4fc1-86b0-b5217161ab38"
        ]
    },
    "petConsumables": {
        "COOKIE": 1583,
        "BAKED_POTATO": 1551,
        "FEATHER": 4634,
        "SLIME_BALL": 4742,
        "RAW_FISH": 1510,
        "WATER_BUCKET": 9380,
        "WOOD_SWORD": 4736,
        "MELON": 1615,
        "STICK": 4630,
        "MILK_BUCKET": 9392,
        "GOLD_RECORD": 4647,
        "LEASH": 4545,
        "LAVA_BUCKET": 9137,
        "MAGMA_CREAM": 1508,
        "APPLE": 1589,
        "WHEAT": 1450,
        "BREAD": 1494,
        "CAKE": 1531,
        "PORK": 1547,
        "BONE": 1603,
        "MUSHROOM_SOUP": 1513,
        "ROTTEN_FLESH": 1510,
        "CARROT_ITEM": 1612,
        "HAY_BLOCK": 1572,
        "PUMPKIN_PIE": 1598,
        "COOKED_BEEF": 1593,
        "RED_ROSE": 1525
    },
    "petStats": {
        "MOOSHROOM": {
            "HUNGER": {
                "timestamp": 1650307754454,
                "value": 100
            },
            "THIRST": {
                "timestamp": 1515965397740,
                "value": 100
            },
            "name": "§cBarbara",
            "EXERCISE": {
                "timestamp": 1515965403253,
                "value": 100
            },
            "experience": 11200
        },
        "PENGUIN": {
            "name": "§7PenguinNoise"
        },
        "TOTEM": {
            "name": "Borb"
        },
        "HP8_2": {
            "name": "§7BB9E"
        },
        "BLACK_PUG": {
            "name": "§7Gabe"
        },
        "SILVERFISH": {
            "EXERCISE": {
                "value": 100,
                "timestamp": 1515965333745
            },
            "HUNGER": {
                "timestamp": 1515965339566,
                "value": 100
            },
            "THIRST": {
                "timestamp": 1515965359949,
                "value": 100
            },
            "experience": 800
        }
    },
    "petJourneyTimestamp": 1650307759258,
    "transformation": "IRON_GOLEM",
    "socialMedia": {
        "TWITTER": "bugfroggy",
        "links": {
            "TWITTER": "https://twitter.com/bugfroggy",
            "HYPIXEL": "https://hypixel.net/members/bugfroggy.52450/",
            "DISCORD": "discord.gg/ZuwscGD"
        },
        "prompt": true,
        "BEAM": ""
    },
    "plotResets": {
        "time": 1450231205687,
        "uuid": "76611565-6380-44b4-bc58-680a7005645f"
    },
    "sendCerberusMessages": true,
    "rewardConsumed": true,
    "giftingMeta": {
        "giftsGiven": 123,
        "bundlesGiven": 25,
        "realBundlesGiven": 25,
        "milestones": [
            "ONE",
            "FIVE",
            "TEN",
            "TWENTY_FIVE"
        ],
        "realBundlesReceivedInc": 5,
        "bundlesReceived": 9,
        "realBundlesReceived": 9,
        "ranksGiven": 3,
        "rankgiftingmilestones": [
            "ONE"
        ]
    },
    "fortuneBuff": 0,
    "rankPlusColor": "DARK_GREEN",
    "specialtyCooldowns": {
        "VIP0": true,
        "VIP_PLUS0": true,
        "MVP0": true,
        "MVP_PLUS0": true,
        "VIP1": true,
        "VIP_PLUS1": true,
        "MVP1": true,
        "MVP_PLUS1": true,
        "VIP2": true,
        "VIP_PLUS2": true,
        "MVP2": true,
        "MVP_PLUS2": true,
        "VIP3": true,
        "VIP_PLUS3": true,
        "MVP_PLUS3": true,
        "MVP3": true,
        "VIP4": true,
        "VIP_PLUS4": true,
        "MVP4": true,
        "MVP_PLUS4": true,
        "VIP5": true,
        "MVP_PLUS5": true,
        "MVP5": true,
        "VIP_PLUS5": true,
        "VIP6": true,
        "VIP_PLUS6": true,
        "MVP6": true,
        "MVP_PLUS6": true
    },
    "questSettings": {
        "autoActivate": true
    },
    "adsense_tokens": 0,
    "lastAdsenseGenerateTime": 1683680641982,
    "lastClaimedReward": 1650301263482,
    "totalRewards": 494,
    "totalDailyRewards": 377,
    "rewardStreak": 1,
    "rewardScore": 1,
    "rewardHighScore": 154,
    "vanityFirstConvertedBox": 1468821026520,
    "vanityConvertedBoxToday": 0,
    "flashingSalePopup": 1471970853082,
    "flashingSalePoppedUp": 2,
    "flashingSaleOpens": 6,
    "halloween2016Cooldowns": {
        "VIP0": true,
        "VIP_PLUS0": true,
        "MVP0": true,
        "MVP_PLUS0": true,
        "VIP1": true,
        "VIP_PLUS1": true,
        "MVP_PLUS1": true,
        "MVP1": true,
        "VIP_PLUS2": true,
        "VIP2": true,
        "MVP2": true
    },
    "flashingNewsPopup": [
        "898051",
        "904326",
        "884091"
    ],
    "flashingNewsPoppedUp": 3,
    "flashingNewsOpens": 17,
    "holiday2016Cooldowns": {
        "VIP0": true,
        "VIP_PLUS0": true,
        "VIP_PLUS1": true,
        "VIP1": true,
        "MVP0": true,
        "MVP2": true,
        "MVP_PLUS0": true,
        "MVP_PLUS2": true,
        "MVP_PLUS1": true,
        "MVP1": true,
        "VIP2": true,
        "VIP_PLUS2": true,
        "VIP3": true,
        "VIP4": true,
        "VIP_PLUS3": true,
        "MVP4": true,
        "MVP3": true,
        "VIP5": true,
        "VIP_PLUS4": true,
        "MVP_PLUS3": true,
        "MVP_PLUS4": true,
        "VIP_PLUS5": true,
        "MVP5": true,
        "MVP_PLUS5": true
    },
    "SANTA_QUEST_STARTED": true,
    "SANTA_FINISHED": true,
    "vanityFavorites": "OUTFIT_FROG_HELMET;GADGET_TRAMPOLINE;PET_HP8_2;GADGET_HYPE_TRAIN;PET_MOOSHROOM;GADGET_RUSH_PEARL;GADGET_GRAPPLING_HOOK",
    "network_update_book": "v0.75",
    "lastLogout": 1697477916642,
    "userLanguage": "ENGLISH",
    "autoDetectLanguage": true,
    "achievementTracking": [
        "bedwars_loot_box",
        "bedwars_level",
        "bedwars_wins",
        "general_wins",
        "speeduhc_collector",
        "speeduhc_hunter",
        "speeduhc_salty",
        "speeduhc_uhc_master",
        "tntgames_bow_spleef_wins",
        "tntgames_tnt_wizards_caps",
        "tntgames_tnt_wizards_kills",
        "tntgames_pvp_run_killer",
        "tntgames_tnt_run_wins",
        "tntgames_pvp_run_wins",
        "tntgames_wizards_wins",
        "tntgames_tnt_banker",
        "tntgames_tnt_tag_wins",
        "tntgames_tnt_triathlon",
        "blitz_looter",
        "blitz_kills",
        "blitz_wins",
        "blitz_treasure_seeker",
        "blitz_wins_teams",
        "blitz_war_veteran",
        "walls3_coins",
        "walls3_wins",
        "walls3_guardian",
        "walls3_kills",
        "walls3_rusher",
        "copsandcrims_hero_terrorist",
        "copsandcrims_serial_killer",
        "copsandcrims_cac_banker",
        "copsandcrims_bomb_specialist",
        "uhc_moving_up",
        "uhc_hunter",
        "uhc_champion",
        "uhc_bounty",
        "warlords_warrior_level",
        "warlords_dom_wins",
        "warlords_mage_level",
        "warlords_kills",
        "warlords_shaman_level",
        "warlords_paladin_level",
        "warlords_assist",
        "warlords_tdm_wins",
        "warlords_repair_weapons",
        "warlords_coins",
        "warlords_ctf_wins",
        "skywars_kits_mega",
        "skywars_kills_mega",
        "skywars_wins_mega",
        "skywars_kills_solo",
        "skywars_wins_solo",
        "skywars_wins_team",
        "skywars_kills_team",
        "truecombat_feels_lucky",
        "truecombat_kit_hoarder_solo",
        "truecombat_king",
        "truecombat_kit_hoarder_team",
        "truecombat_solo_killer",
        "truecombat_solo_winner",
        "truecombat_team_killer",
        "truecombat_team_winner",
        "supersmash_handyman",
        "supersmash_hero_slayer",
        "supersmash_smash_champion",
        "supersmash_smash_winner",
        "skyclash_wins",
        "skyclash_cards_unlocked",
        "skyclash_packs_opened",
        "skyclash_mob_beheading",
        "skyclash_kills",
        "skyclash_treasure_hunter",
        "arcade_arcade_banker",
        "arcade_arcade_winner",
        "arcade_bounty_hunter",
        "arcade_buildbattle_points",
        "arcade_farmhunt_dominator",
        "arcade_football_pro",
        "arcade_miniwalls_winner",
        "arcade_zombie_killer",
        "arcade_team_work",
        "gingerbread_racer",
        "gingerbread_banker",
        "gingerbread_winner",
        "vampirez_zombie_killer",
        "vampirez_coins",
        "vampirez_kill_vampires",
        "vampirez_survivor_wins",
        "vampirez_kill_survivors",
        "quake_headshots",
        "quake_godlikes",
        "quake_killing_sprees",
        "quake_kills",
        "quake_coins",
        "quake_weapon_arsenal",
        "quake_wins",
        "arena_gotta_wear_em_all",
        "arena_gladiator",
        "arena_climb_the_ranks",
        "arena_bossed",
        "paintball_wins",
        "paintball_kills",
        "walls_wins",
        "walls_kills",
        "walls_coins",
        "murdermystery_wins_as_murderer",
        "buildbattle_build_battle_score",
        "buildbattle_guess_the_build_guesses",
        "buildbattle_build_battle_voter",
        "buildbattle_guess_the_build_winner",
        "walls3_jack_of_all_trades",
        "walls3_cake_hunter_tiered",
        "walls3_moctezuma"
    ],
    "achievementRewardsNew": {
        "for_points_200": 1509934415159,
        "for_points_300": 1509934418459,
        "for_points_400": 1509934424961,
        "for_points_500": 1509934427665,
        "for_points_600": 1509934430219,
        "for_points_700": 1509934431867,
        "for_points_800": 1509934433220,
        "for_points_900": 1509934434669,
        "for_points_1000": 1509934436118,
        "for_points_1100": 1509934437420,
        "for_points_1200": 1509934438669,
        "for_points_1300": 1509934439968,
        "for_points_1500": 1509934442221,
        "for_points_1400": 1509934444519,
        "for_points_1600": 1509934446529,
        "for_points_1700": 1509934447822,
        "for_points_1800": 1509934450223,
        "for_points_1900": 1509934451622,
        "for_points_2000": 1509934452824,
        "for_points_2100": 1509934455828,
        "for_points_2200": 1509934460027,
        "for_points_2300": 1509934461797,
        "for_points_2400": 1509934463148,
        "for_points_2500": 1509934465101,
        "for_points_2700": 1509934467710,
        "for_points_2600": 1509934469009,
        "for_points_2800": 1509934470509,
        "for_points_2900": 1509934472009,
        "for_points_3000": 1509934481875,
        "for_points_3100": 1509934483822,
        "for_points_3200": 1509934485022,
        "for_points_3300": 1509934486222,
        "for_points_3400": 1512180461501,
        "for_points_3500": 1512261197465,
        "for_points_3600": 1512276437187,
        "for_points_3700": 1512428748976,
        "for_points_3800": 1512880756423,
        "for_points_3900": 1512943642685,
        "for_points_4000": 1513242488368,
        "for_points_4100": 1513406323316,
        "for_points_4200": 1513458747443,
        "for_points_4300": 1513831256476,
        "for_points_4400": 1514113933304,
        "for_points_4500": 1515141166666,
        "for_points_4600": 1529014808821,
        "for_points_4700": 1534431000561,
        "for_points_4800": 1557774828645,
        "for_points_4900": 1562368472511,
        "for_points_5000": 1562368479216,
        "for_points_5100": 1562368483266,
        "for_points_5200": 1608845034139,
        "for_points_5300": 1624538813004,
        "for_points_5400": 1650305492322,
        "for_points_5500": 1683680632231
    },
    "achievementTotem": {
        "canCustomize": true,
        "allowed_max_height": 2,
        "unlockedParts": [
            "birdy",
            "happy",
            "arrow",
            "snake",
            "pong",
            "corner"
        ],
        "selectedParts": {
            "slot_0": "snake",
            "slot_1": "birdy"
        },
        "unlockedColors": [
            "blue",
            "purple"
        ],
        "selectedColors": {
            "slotcolor_0": "purple",
            "slotcolor_1": "purple"
        }
    },
    "completed_christmas_quests_2017": 8,
    "achievementSync": {
        "quake_tiered": 1
    },
    "completed_christmas_quests_2018": 1,
    "challenges": {
        "all_time": {
            "BEDWARS__offensive": 39,
            "BEDWARS__support": 21,
            "SKYWARS__rush_challenge": 3,
            "MURDER_MYSTERY__murder_spree": 1,
            "DUELS__feed_the_void_challenge": 2,
            "WALLS3__protector_challenge": 1
        }
    },
    "currentGadget": "HYPE_TRAIN",
    "achievementPoints": 5060,
    "tourney": {
        "first_join_lobby": 1549728670845,
        "gingerbread_solo_0": {
            "seenRPbook": true
        }
    },
    "battlePassGlowStatus": true,
    "newPackageRank": "MVP_PLUS",
    "monthlyPackageRank": "NONE",
    "mostRecentMonthlyPackageRank": "SUPERSTAR",
    "cooldowns": {
        "fun": {
            "event_scrambled": 1566013194299,
            "whatsmyface": 1566006769916,
            "santaclaus": 1566006848929,
            "event_quickmaths": 1566013164361
        }
    },
    "monthlycrates": {
        "1-2017": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "1-2018": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true,
            "MVP": true
        },
        "1-2019": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "10-2016": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "VIP": true,
            "REGULAR": true
        },
        "10-2017": {
            "REGULAR": true,
            "VIP": true,
            "MVP": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true
        },
        "10-2018": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "11-2016": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "11-2017": {
            "REGULAR": true,
            "VIP": true,
            "MVP": true,
            "MVP_PLUS": true,
            "VIP_PLUS": true
        },
        "11-2018": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true,
            "MVP": true
        },
        "12-2016": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "12-2017": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "12-2018": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "2-2017": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "2-2018": {
            "MVP_PLUS": true,
            "VIP_PLUS": true,
            "MVP": true,
            "VIP": true,
            "REGULAR": true
        },
        "2-2019": {
            "VIP": true,
            "REGULAR": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true,
            "MVP": true
        },
        "3-2017": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP": true,
            "REGULAR": true,
            "VIP_PLUS": true
        },
        "3-2018": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "3-2019": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "4-2017": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "4-2018": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "4-2019": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "5-2018": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "5-2019": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "6-2017": {
            "REGULAR": true,
            "VIP": true,
            "MVP": true,
            "MVP_PLUS": true,
            "VIP_PLUS": true
        },
        "6-2018": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "6-2019": {
            "REGULAR": true,
            "VIP": true,
            "MVP": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true
        },
        "7-2016": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "VIP": true,
            "REGULAR": true
        },
        "7-2017": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "7-2018": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "VIP": true,
            "REGULAR": true
        },
        "8-2016": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "VIP": true,
            "REGULAR": true
        },
        "8-2017": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "8-2018": {
            "REGULAR": true,
            "VIP": true,
            "MVP": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true
        },
        "8-2019": {
            "REGULAR": true,
            "VIP": true,
            "MVP": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true
        },
        "9-2016": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "VIP": true,
            "REGULAR": true
        },
        "9-2017": {
            "REGULAR": true,
            "VIP": true,
            "MVP": true,
            "MVP_PLUS": true,
            "VIP_PLUS": true
        },
        "9-2018": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true,
            "MVP": true
        },
        "12-2019": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "2-2020": {
            "VIP": true,
            "REGULAR": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "4-2020": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "6-2020": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "REGULAR": true,
            "VIP": true
        },
        "7-2020": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "8-2020": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true,
            "MVP": true
        },
        "9-2020": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "REGULAR": true,
            "VIP": true
        },
        "11-2020": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true,
            "MVP": true
        },
        "12-2020": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "1-2021": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "2-2021": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "VIP": true,
            "REGULAR": true
        },
        "5-2021": {
            "REGULAR": true,
            "VIP": true,
            "MVP": true,
            "VIP_PLUS": true,
            "MVP_PLUS": true
        },
        "6-2021": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "7-2021": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "VIP": true,
            "REGULAR": true
        },
        "8-2021": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "VIP": true,
            "REGULAR": true
        },
        "12-2021": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "4-2022": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "VIP": true,
            "REGULAR": true
        },
        "6-2022": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "7-2022": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "11-2022": {
            "MVP_PLUS": true,
            "MVP": true,
            "VIP_PLUS": true,
            "VIP": true,
            "REGULAR": true
        },
        "4-2023": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "5-2023": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        },
        "10-2023": {
            "REGULAR": true,
            "VIP": true,
            "VIP_PLUS": true,
            "MVP": true,
            "MVP_PLUS": true
        }
    },
    "adventRewards2017": {
        "day1": 1512175641055,
        "day2": 1512191020985,
        "day3": 1512277429778,
        "day4": 1512367204636,
        "day5": 1512450403064,
        "day6": 1512540577830,
        "day7": 1512623501518,
        "day8": 1512709306548,
        "day9": 1512853082856,
        "day10": 1512882138844,
        "day11": 1513017556786,
        "day12": 1513056690068,
        "day13": 1513182560818,
        "day14": 1513231700450,
        "day15": 1513366916986,
        "day16": 1513403107958,
        "day17": 1513487095448,
        "day18": 1513574337458,
        "day19": 1513664530319,
        "day20": 1513749720701,
        "day21": 1513832551825,
        "day22": 1513925545141,
        "day23": 1514043188229,
        "day24": 1514091843357,
        "day25": 1514217347357
    },
    "adventRewards_v2_2018": {
        "day20": 1545355696511,
        "day22": 1545500742800
    },
    "christmas2019Cooldowns": {
        "MVP1": true,
        "MVP0": true,
        "VIP0": true,
        "VIP1": true,
        "SUPERSTAR0": true,
        "MVP_PLUS1": true,
        "MVP_PLUS0": true,
        "NORMAL1": true,
        "NORMAL0": true,
        "VIP_PLUS0": true,
        "VIP_PLUS1": true
    },
    "adventRewards2019": {
        "day1": 1577049381315,
        "day2": 1577049388516,
        "day22": 1577049415996
    },
    "xmas2019_SKYWARS_1": true,
    "xmas2019_BEDWARS_1": true,
    "easter2020Cooldowns2": {
        "MVP_PLUS3": true,
        "MVP_PLUS2": true,
        "MVP_PLUS1": true,
        "MVP_PLUS0": true,
        "NORMAL3": true,
        "NORMAL2": true,
        "NORMAL0": true,
        "VIP_PLUS0": true,
        "NORMAL1": true,
        "VIP_PLUS1": true,
        "VIP_PLUS3": true,
        "MVP0": true,
        "MVP1": true,
        "MVP2": true,
        "VIP0": true,
        "VIP1": true,
        "VIP2": true,
        "VIP3": true,
        "MVP3": true,
        "VIP_PLUS2": true
    },
    "currentPet": "MOOSHROOM",
    "summer2020Cooldowns": {
        "MVP_PLUS2": true,
        "MVP_PLUS1": true,
        "MVP_PLUS0": true,
        "NORMAL2": true,
        "NORMAL1": true,
        "NORMAL0": true,
        "VIP_PLUS1": true,
        "VIP_PLUS2": true,
        "VIP_PLUS0": true,
        "MVP0": true,
        "MVP1": true,
        "MVP2": true,
        "VIP0": true,
        "VIP1": true,
        "VIP2": true,
        "MVP3": true,
        "VIP_PLUS3": true,
        "VIP3": true,
        "MVP_PLUS3": true,
        "NORMAL3": true
    },
    "christmas2020Cooldowns": {
        "NORMAL0": true
    },
    "adventRewards2020": {
        "day1": 1606882280987,
        "day5": 1607230124571,
        "day17": 1608237739396,
        "day23": 1608748196733,
        "day24": 1608841570798
    },
    "christmas2020Cooldowns2": {
        "VIP0": true,
        "VIP_PLUS0": true,
        "NORMAL0": true,
        "VIP1": true,
        "MVP1": true,
        "MVP0": true,
        "VIP_PLUS1": true,
        "NORMAL1": true,
        "MVP_PLUS1": true,
        "NORMAL2": true,
        "MVP_PLUS0": true,
        "VIP_PLUS2": true,
        "NORMAL3": true,
        "VIP2": true,
        "MVP2": true,
        "MVP_PLUS2": true,
        "VIP3": true,
        "MVP3": true,
        "VIP_PLUS3": true,
        "MVP_PLUS3": true
    },
    "xmas2020_ARCADE_3": true,
    "xmas2020_ARCADE_1": true,
    "xmas2020_ARCADE_2": true,
    "xmas2020_BEDWARS_1": true,
    "xmas2020_BEDWARS_5": true,
    "xmas2020_BEDWARS_4": true,
    "xmas2020_BEDWARS_3": true,
    "xmas2020_BEDWARS_2": true,
    "xmas2020_BLITZ_2": true,
    "xmas2020_BLITZ_3": true,
    "xmas2020_BLITZ_1": true,
    "xmas2020_BUILDBATTLE_1": true,
    "xmas2020_BUILDBATTLE_3": true,
    "xmas2020_BUILDBATTLE_2": true,
    "xmas2020_CLASSIC_1": true,
    "xmas2020_CLASSIC_2": true,
    "xmas2020_CLASSIC_3": true,
    "xmas2020_COPS_AND_CRIMS_1": true,
    "xmas2020_COPS_AND_CRIMS_3": true,
    "xmas2020_COPS_AND_CRIMS_2": true,
    "xmas2020_DUELS_3": true,
    "xmas2020_DUELS_1": true,
    "xmas2020_DUELS_2": true,
    "xmas2020_HOUSING_3": true,
    "xmas2020_HOUSING_1": true,
    "xmas2020_HOUSING_5": true,
    "xmas2020_HOUSING_2": true,
    "xmas2020_HOUSING_4": true,
    "xmas2020_MEGAWALLS_2": true,
    "xmas2020_MEGAWALLS_1": true,
    "xmas2020_MEGAWALLS_3": true,
    "xmas2020_MURDER_1": true,
    "xmas2020_MURDER_2": true,
    "xmas2020_MURDER_3": true,
    "xmas2020_PROTOTYPE_2": true,
    "xmas2020_PROTOTYPE_3": true,
    "xmas2020_PROTOTYPE_1": true,
    "xmas2020_SKYWARS_1": true,
    "xmas2020_SKYWARS_5": true,
    "xmas2020_SKYWARS_4": true,
    "xmas2020_SKYWARS_2": true,
    "xmas2020_SKYWARS_3": true,
    "xmas2020_SMASH_1": true,
    "xmas2020_SMASH_2": true,
    "xmas2020_SMASH_3": true,
    "xmas2020_TNT_3": true,
    "xmas2020_TNT_2": true,
    "xmas2020_TNT_1": true,
    "xmas2020_UHC_1": true,
    "xmas2020_UHC_2": true,
    "xmas2020_UHC_3": true,
    "xmas2020_WARLORDS_1": true,
    "xmas2020_WARLORDS_3": true,
    "xmas2020_WARLORDS_2": true,
    "xmas2020_MAIN_LOBBY_1": true,
    "xmas2020_MAIN_LOBBY_16": true,
    "xmas2020_MAIN_LOBBY_14": true,
    "xmas2020_MAIN_LOBBY_8": true,
    "xmas2020_MAIN_LOBBY_22": true,
    "xmas2020_MAIN_LOBBY_7": true,
    "xmas2020_MAIN_LOBBY_6": true,
    "xmas2020_MAIN_LOBBY_28": true,
    "xmas2020_MAIN_LOBBY_30": true,
    "xmas2020_MAIN_LOBBY_29": true,
    "xmas2020_MAIN_LOBBY_9": true,
    "xmas2020_MAIN_LOBBY_31": true,
    "xmas2020_MAIN_LOBBY_10": true,
    "xmas2020_MAIN_LOBBY_32": true,
    "xmas2020_MAIN_LOBBY_33": true,
    "xmas2020_MAIN_LOBBY_34": true,
    "xmas2020_MAIN_LOBBY_11": true,
    "xmas2020_MAIN_LOBBY_38": true,
    "xmas2020_MAIN_LOBBY_4": true,
    "snowball_fight_intro_2019": true,
    "xmas2020_MAIN_LOBBY_35": true,
    "xmas2020_MAIN_LOBBY_13": true,
    "xmas2020_MAIN_LOBBY_12": true,
    "xmas2020_MAIN_LOBBY_36": true,
    "xmas2020_MAIN_LOBBY_37": true,
    "xmas2020_MAIN_LOBBY_39": true,
    "xmas2020_MAIN_LOBBY_3": true,
    "xmas2020_MAIN_LOBBY_17": true,
    "xmas2020_MAIN_LOBBY_2": true,
    "xmas2020_MAIN_LOBBY_40": true,
    "xmas2020_MAIN_LOBBY_20": true,
    "xmas2020_MAIN_LOBBY_19": true,
    "xmas2020_MAIN_LOBBY_21": true,
    "xmas2020_MAIN_LOBBY_18": true,
    "xmas2020_MAIN_LOBBY_27": true,
    "xmas2020_MAIN_LOBBY_15": true,
    "xmas2020_MAIN_LOBBY_26": true,
    "xmas2020_MAIN_LOBBY_24": true,
    "xmas2020_MAIN_LOBBY_25": true,
    "xmas2020_MAIN_LOBBY_23": true,
    "xmas2020_MAIN_LOBBY_5": true,
    "anniversaryNPCVisited2021": [
        1,
        4,
        3,
        2,
        5,
        0,
        6,
        8,
        7,
        11,
        13,
        9,
        12,
        10,
        14,
        15,
        16,
        17,
        24,
        22,
        18,
        20,
        21,
        19,
        23,
        27,
        30,
        28,
        25,
        29,
        37,
        34,
        32,
        35,
        31,
        33,
        36,
        41,
        43,
        44,
        42,
        40,
        51,
        47,
        49,
        45,
        50,
        46,
        53,
        52,
        54,
        55
    ],
    "anniversaryNPCProgress2021": 9,
    "currentClickEffect": "HYPIXEL",
    "skyblock_free_cookie": 1623410983246,
    "claimed_year143_cake": 1624643378101,
    "scorpius_bribe_144": 1624888156392,
    "summer2021Cooldowns": {
        "NORMAL0": true,
        "VIP_PLUS0": true,
        "VIP0": true,
        "MVP1": true,
        "MVP0": true,
        "VIP_PLUS1": true,
        "NORMAL1": true,
        "MVP_PLUS0": true,
        "VIP1": true,
        "MVP_PLUS1": true,
        "VIP2": true,
        "NORMAL2": true,
        "VIP_PLUS2": true,
        "MVP2": true,
        "MVP_PLUS2": true
    },
    "seasonal": {
        "christmas": {
            "2021": {
                "adventRewards": {
                    "day22": 1640209988462,
                    "day23": 1640239077583,
                    "day24": 1640375500593,
                    "day25": 1640479938977
                }
            }
        },
        "easter": {
            "2022": {
                "mainlobby_egghunt_42_53_253": true,
                "mainlobby_egghunt_-11_57_203": true,
                "mainlobby_egghunt_128_45_-14": true,
                "mainlobby_egghunt_-15_34_-52": true,
                "mainlobby_egghunt_65_25_121": true,
                "mainlobby_egghunt_126_52_179": true
            }
        },
        "anniversary": {
            "2022": {
                "anniversaryNPCVisited": [
                    1,
                    4,
                    3,
                    0,
                    2,
                    5,
                    9,
                    7,
                    6,
                    11,
                    10,
                    8,
                    12,
                    17,
                    16,
                    15,
                    14,
                    13,
                    19,
                    20,
                    22,
                    21,
                    23,
                    18,
                    24,
                    29,
                    27,
                    25,
                    28,
                    30,
                    33,
                    31,
                    32,
                    35,
                    34,
                    40,
                    36,
                    39,
                    38,
                    37,
                    42,
                    41,
                    44,
                    43,
                    45,
                    46,
                    47,
                    48,
                    50,
                    49,
                    53,
                    54,
                    55,
                    51,
                    52,
                    56,
                    57,
                    59,
                    58,
                    60,
                    65,
                    63,
                    64,
                    61,
                    66,
                    62,
                    71,
                    69,
                    70,
                    68,
                    67,
                    73,
                    72,
                    75,
                    74
                ],
                "anniversaryNPCProgress": 14
            }
        },
        "halloween": {
            "2023": {
                "levelling": {
                    "experience": 534
                }
            }
        }
    },
    "easter2022Cooldowns2": {
        "VIP_PLUS0": true,
        "NORMAL0": true,
        "NORMAL1": true,
        "VIP_PLUS1": true,
        "MVP_PLUS0": true,
        "MVP0": true,
        "VIP0": true,
        "VIP1": true
    },
    "parkourCheckpointBests": {
        "mainLobby2022": {
            "0": 17316,
            "1": 8400,
            "2": 18446,
            "3": 21102,
            "4": 18306
        }
    },
    "leveling": {
        "claimedRewards": [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            34,
            26,
            35,
            43,
            49,
            48,
            47,
            46,
            45,
            44,
            42,
            41,
            40,
            39,
            38,
            37,
            36,
            33,
            32,
            31,
            30,
            29,
            28,
            27,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57,
            58,
            59,
            60,
            61,
            62,
            63,
            64,
            65,
            66,
            67,
            68,
            69,
            70,
            71,
            72,
            73,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            82,
            83,
            84,
            85,
            86,
            87,
            88,
            89,
            90,
            91,
            92,
            93,
            94,
            109,
            95,
            96,
            97,
            98,
            99,
            119,
            129
        ]
    },
    "mostRecentGameType": "PROTOTYPE"
}

// Read schema from file system
const schema = JSON.parse((await fs.promises.readFile(join(__dirname, '../schemas/hypixel/player.json'))).toString())
await writeSchemaTypedefs(schema, "HypixelPlayer", join(__dirname, "..", "..", "types"))
const playerSchema = getSchemaDefinition(schema, "HypixelPlayer")!;

const changesDiff = findSchemaChanges(playerSchema, data);
if(!changesDiff) {
    console.log(undefined);
} else {
    const changesSchema = toJsonSchema(changesDiff, {
        strings: {
            detectFormat: false
        },
        objects: {
            preProcessFnc: (obj, defaultFunc) => {
                return defaultFunc(Object.fromEntries(Object
                    .entries(obj)
                    .map(([key, value]) => {
                        if(key.endsWith("__added")) {
                            key = key.slice(0, -7)
                        }
                        return [key, value]
                    })
                ));
            }
        }
    })
    console.log(JSON.stringify(combineSchemas(playerSchema, changesSchema)));
}

function getSchemaDefinition(schema: Record<string, any>, name: string): Record<string, any> | undefined {
    return schema.definitions?.[name] ?? undefined;
}

/**
 * Combine two JSON schemas on top of each other
 * @param originalSchema
 * @param newSchema
 */
function combineSchemas(originalSchema: Record<string, any>, newSchema: Record<string, any>): Record<string, any> {
    const finalSchema = structuredClone(originalSchema);

    if(newSchema.properties) {
        if(!finalSchema.properties) {
            finalSchema.properties = {};
        }
        for(const prop in newSchema.properties) {
            if(!finalSchema.properties[prop]) {
                finalSchema.properties[prop] = newSchema.properties[prop];
            } else {
                finalSchema.properties[prop] = combineSchemas(finalSchema.properties[prop], newSchema.properties[prop]);
            }
        }
    } else if(newSchema.items?.properties) {
        if(!finalSchema.items) {
            finalSchema.items = {}
        }
        if(!finalSchema.items.properties) {
            finalSchema.items.properties = newSchema.items.properties;
        } else {
            finalSchema.items.properties = combineSchemas(finalSchema.items.properties, newSchema.items.properties);
        }
    }

    return finalSchema
}


/**
 * Create TypeScript type definition files based on a JSON schema.
 * @param schema The JSON schema to create type definitions for.
 * @param name Output file name, without the extension (`.d.ts` will be appended).
 * @param outdir Directory to write TypeScript definitions file to.
 * @returns A `Promise` that resolves when the TypeScript definition file has been written.
 * @throws
 * - `Error` on file system error
 * - `Error` if `schema` is not a valid JSON schema
 */
export async function writeSchemaTypedefs(schema: Record<string, any>, name: string, outdir: string) {
    // compile schema to TypeScript
    const ts = await compile(schema, name, {
        additionalProperties: true
    })

    // Write compiled TypeScript to .d.ts files
    await fs.promises.mkdir(outdir, { recursive: true });
    await fs.promises.writeFile(join(outdir, `${name}.d.ts`), ts)
}

/**
 * Crawl recursively breadth-first through an object. The callback is called for each value in the object.
 *
 * @param obj The object or array to crawl through. Technically this may also be primitives, `null`, or `undefined`,
 * however the callback will only be called once.
 * @param cb Callback to call for each value. Takes two parameters:
 *
 *  - `identifier` - An array of the keys used to access this point. For example, the property `obj.some.value[0].here`
 * would equate to an identifier of `['some', 'value', 0, 'here']`.
 * - `value` - The value located at the given identifier. Could be a primitive, object, or array.
 *
 * The callback is called for all child properties, including objects, arrays, and the values within arrays. For objects
 * and arrays, the callback is later called for all the value's child properties.
 *
 * If callback ever returns a value other than `undefined`, the crawling is stopped and the returned value is returned.
 * @returns The value returned by `callback` if it ever returns anything other than `undefined`. Otherwise, `undefined`
 * is returned.
 */
export function crawl(obj: any, cb: (identifier: (string | number | symbol)[], value: any) => any): any {
    const valuesToCrawl: { value: any, namespace: (string | number | symbol)[]}[] = [{
        value: obj,
        namespace: []
    }];
    while(valuesToCrawl.length > 0) {
        const next = valuesToCrawl.shift();
        const value = next!.value;
        const namespace = next!.namespace;
        const returnVal = cb(namespace, value);
        if(returnVal !== undefined) {
            return returnVal;
        }

        if(Array.isArray(value)) {
            for(let i = 0; i < value.length; i++) {
                valuesToCrawl.push({
                    value: value[i],
                    namespace: [...namespace, i]
                })
            }
        } else if(typeof value === "object" && value !== null) {
            for(const key in value) {
                valuesToCrawl.push({
                    value: value[key],
                    namespace: [...namespace, key]
                })
            }
        }
    }
}

/**
 * Find divergences in an input object's keys from a given JSON schema. Changes in value or type will not be reported.
 * @param schema A valid JSON schema to check the difference of `input` against.
 * @param input Any object that you want to check for new/removed keys compared to the given `schema`.
 * @returns An object containing differences in object keys. New keys will have `__added` appended, and removed keys
 * will have `__deleted` appended. If a deleted property is an object or an array, its children properties will not
 * have `__added` or `__deleted` appended.
 *
 * @throws
 * - `Error` if the given schema is not a valid JSON schema
 * @example
 * const schema = {
 *     type: "object",
 *     properties: {
 *         prop_one: {
 *             type: "string"
 *         }
 *     }
 * }
 *
 * const output = findSchemaChanges(schema, {
 *     prop_one: "Hello, world!",
 *     prop_two: false
 * })
 * console.log(output)
 * // Output: { prop_two__added: false }
 */
export function findSchemaChanges(schema: Record<string, any>, input: Record<string, any>): Record<string, any> {
    const allValues = structuredClone(input)
    const definedValues = structuredClone(input)

    const validate = new Ajv().compile(schema);
    const validateAndRemove = new Ajv({removeAdditional: "all"}).compile(schema);

    validate(allValues);
    validateAndRemove(definedValues);

    return diff(definedValues, allValues, {
        keysOnly: true
    })
}

