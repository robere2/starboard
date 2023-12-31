import * as z from "zod";
import {HypixelBaseSchema} from "../HypixelBaseSchema";
import {ZodUnixDate} from "../../ZodUnixDate";

export type GuildAchievementsResourceSchema = ReturnType<typeof generateGuildAchievementsResourceSchema>;
export type HypixelGuildAchievements = z.infer<GuildAchievementsResourceSchema>;
export type HypixelTieredGuildAchievement = HypixelGuildAchievements["tiered"][string];
export type HypixelOneTimeGuildAchievement = HypixelGuildAchievements["one_time"][string];

export function generateGuildAchievementsResourceSchema() {
    return HypixelBaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        one_time: z.record(z.string(), z.unknown()).default({}).readonly(),
        tiered:
            z.record(z.string(),
                z.object({
                    name: z.string(),
                    description: z.string(),
                    tiers: z.array(
                        z.object({
                            tier: z.number().nonnegative(),
                            amount: z.number().nonnegative()
                        }).readonly()
                    ).default([]).readonly()
                })
            ).default({}).readonly()
    })
}
