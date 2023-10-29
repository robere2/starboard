import * as z from "zod";
import {HypixelBaseSchema} from "../../HypixelBaseSchema";
import {ZodUnixDate} from "../../../ZodUnixDate";

export type SkyBlockItemsResourceSchema = ReturnType<typeof generateSkyBlockItemsResourceSchema>;
export type HypixelSkyBlockItem = z.infer<SkyBlockItemsResourceSchema>["items"][number];

export function generateSkyBlockItemsResourceSchema() {
    return HypixelBaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        items: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                material: z.string(),
                skin: z.string().nullish(),
                category: z.string().nullish(),
                tier: z.string().nullish(),
                soulbound: z.string().nullish(),
                generator: z.string().nullish(),
                furniture: z.string().nullish(),
                color: z.string().regex(/\d{1,3}(?:,\d{1,3}){2}/).nullish(),
                sword_type: z.string().nullish(),
                origin: z.string().nullish(),
                crystal: z.string().nullish(),
                private_island: z.string().nullish(),
                durability: z.number().nullish(),
                npc_sell_price: z.number().nullish(),
                generator_tier: z.number().nonnegative().nullish(),
                gear_score: z.number().nullish(),
                ability_damage_scaling: z.number().nullish(),
                motes_sell_price: z.number().nullish(),
                rarity_salvageable: z.boolean().nullish(),
                glowing: z.boolean().nullish(),
                unstackable: z.boolean().nullish(),
                museum: z.boolean().nullish(),
                dungeon_item: z.boolean().nullish(),
                cannot_reforge: z.boolean().nullish(),
                lose_motes_value_on_transfer: z.boolean().nullish(),
                salvageable_from_recipe: z.boolean().nullish(),
                rift_transferrable: z.boolean().nullish(),
                can_have_attributes: z.boolean().nullish(),
                hide_from_viewrecipe_command: z.boolean().nullish(),
                item_specific: z.record(z.string(), z.unknown()).nullish().readonly(),
                enchantments: z.record(z.string(), z.number()).nullish().readonly(),
                stats: z.record(z.string(), z.unknown()).nullish().readonly(),
                tiered_stats: z.record(z.string(),
                    z.array(z.number()).default([]).readonly()
                ).nullish().readonly(),
                salvages: z.array(
                    z.object({
                        type: z.string(),
                        essence_type: z.string().nullish(),
                        amount: z.number().nullish()
                    }).readonly()
                ).nullish().readonly(),
                requirements: z.array(
                    z.object({
                        type: z.string(),
                        skill: z.string().nullish(),
                        level: z.number().nullish(),
                        reward: z.string().nullish(),
                        faction: z.string().nullish(),
                        reputation: z.number().nullish(),
                        slayer_boss_type: z.string().nullish(),
                        dungeon_type: z.string().nullish(),
                        tier: z.number().nullish(),
                        collection: z.string().nullish(),
                        mode: z.string().nullish(),
                        minimum_age_unit: z.string().nullish(),
                        minimum_age: z.number().nullish(),
                    }).readonly()
                ).nullish().readonly(),
                upgrade_costs: z.array(
                    z.array(
                        z.object({
                            type: z.string(),
                            item_id: z.string().nullish(),
                            essence_type: z.string().nullish(),
                            amount: z.number().nullish()
                        })
                    ).readonly()
                ).nullish().readonly(),
                gemstone_slots: z.array(
                    z.object({
                        slot_type: z.string(),
                        costs: z.array(
                            z.object({
                                type: z.string(),
                                coins: z.number().nullish(),
                                item_id: z.string().nullish(),
                                amount: z.number().nullish()
                            }).readonly()
                        ).default([]).readonly()
                    }).readonly()
                ).nullish().readonly(),
                dungeon_item_conversion_cost: z.object({
                    essence_type: z.string(),
                    amount: z.number()
                }).nullish().readonly(),
                catacombs_requirements: z.array(
                    z.object({
                        type: z.string(),
                        dungeon_type: z.string().nullish(),
                        level: z.number().nullish()
                    }).readonly()
                ).nullish().readonly(),
                prestige: z.object({
                    item_id: z.string(),
                    costs: z.array(
                        z.object({
                            type: z.string(),
                            item_id: z.string().nullish(),
                            essence_type: z.string().nullish(),
                            amount: z.number().nullish()
                        }).readonly()
                    ).default([]).readonly(),
                }).nullish().readonly()
            })
        ).default([])
    })
}
