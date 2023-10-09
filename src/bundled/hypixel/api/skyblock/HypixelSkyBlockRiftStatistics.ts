import {HypixelSkyBlockInventoryData} from "./HypixelSkyBlockProfileMember.ts";

type BrotherNames = 'threebrother_0' | 'threebrother_1' | 'threebrother_2';
export type HypixelSkyBlockRiftStatistics = {
    village_plaza?: {
        murder?: {
            step_index?: number;
            room_clues?: string[];
            [undocumentedProperties: string]: any;
        };
        barry_center?: {
            first_talk_to_barry?: boolean;
            convinced?: string[];
            received_reward?: boolean;
            [undocumentedProperties: string]: any;
        };
        cowboy?: {
            stage?: number;
            hay_eaten?: number;
            rabbit_name?: string;
            [undocumentedProperties: string]: any;
        };
        barter_bank?: unknown;
        lonely?: {
            seconds_sitting?: number;
        };
        seraphine?: {
            step_index?: number;
        };
        got_scammed?: boolean;
        [undocumentedProperties: string]: any;
    };
    wither_cage?: {
        killed_eyes?: string[];
        [undocumentedProperties: string]: any;
    };
    black_lagoon?: {
        talked_to_edwin?: boolean;
        received_science_paper?: boolean;
        delivered_science_paper?: boolean;
        completed_step?: number;
        [undocumentedProperties: string]: any;
    };
    dead_cats?: {
        talked_to_jacquelle?: boolean;
        picked_up_detector?: boolean;
        found_cats?: string[];
        unlocked_pet?: boolean;
        montezuma?: {
            uuid?: string | null;
            type: string;
            exp?: number;
            active?: boolean;
            tier?: string;
            heldItem?: unknown | null;
            candyUsed?: number;
            skin?: unknown | null;
            [undocumentedProperties: string]: any;
        };
        [undocumentedProperties: string]: any;
    };
    wizard_tower?: {
        wizard_quest_step?: number;
        crumbs_laid_out?: number;
        [undocumentedProperties: string]: any;
    };
    west_village?: {
        crazy_kloon?: {
            selected_colors?: Record<string, string>,
            talked?: boolean;
            hacked_terminals?: string[];
            quest_complete?: boolean;
            [undocumentedProperties: string]: any;
        };
        mirrorverse?: {
            visited_rooms?: string[];
            upside_down_hard?: boolean;
            claimed_chest_items?: string[];
            claimed_reward?: boolean;
            [undocumentedProperties: string]: any;
        };
        kat_house?: {
            bin_collected_mosquito?: number;
            bin_collected_silverfish?: number;
            bin_collected_spider?: number;
            [undocumentedProperties: string]: any;
        };
        glyphs?: {
            claimed_wand?: boolean;
            current_glyph_delivered?: boolean;
            current_glyph_completed?: boolean;
            current_glyph?: number;
            completed?: boolean;
            claimed_bracelet?: boolean;
            [undocumentedProperties: string]: any;
        };
        enigma?: {
            bought_cloak?: boolean;
            found_souls?: string[];
            claimed_bonus_index?: number;
            [undocumentedProperties: string]: any;
        };
        wyld_woods?: {
            talked_threebrothers?: [BrotherNames, BrotherNames?, BrotherNames?];
            bughunter_step?: number;
            sirius_started_q_a?: boolean;
            sirius_q_a_chain_done?: boolean;
            sirius_completed_q_a?: boolean;
            sirius_claimed_doubloon?: boolean;
            [undocumentedProperties: string]: any;
        };
        gallery?: {
            elise_step?: number;
            secured_trophies?: {
                type?: string;
                timestamp?: number;
                visits?: number;
                [undocumentedProperties: string]: any;
            }[];
            sent_trophy_dialogues?: string[];
            [undocumentedProperties: string]: any;
        };
        castle?: {
            unlocked_pathway_skip?: boolean;
            fairy_step?: number;
            [undocumentedProperties: string]: any;
        };
        access?: {
            last_free?: number;
            consumed_prism?: boolean;
            [undocumentedProperties: string]: any;
        };
        slayer_quest?: {
            type?: string;
            tier?: number;
            start_timestamp?: number;
            completeion_state?: number;
            used_armor?: boolean;
            solo?: boolean;
            [undocumentedProperties: string]: any;
        };
        dreadfarm?: {
            shania_stage?: number;
            [undocumentedProperties: string]: any;
        };
        lifetime_purchased_boundaries?: string[];
        inventory?: {
            ender_chest_contents?: HypixelSkyBlockInventoryData;
            ender_chest_page_icons?: (unknown | null)[];
            inv_contents?: HypixelSkyBlockInventoryData;
            inv_armor?: HypixelSkyBlockInventoryData;
            equippment_contents?: HypixelSkyBlockInventoryData;
            [undocumentedProperties: string]: any;
        };
        [undocumentedProperties: string]: any;
    };
    [undocumentedProperties: string]: any;
}
