import z from "zod";
import {BaseSchema} from "../../../../BaseAPI.ts";
import {ZodUnixDate} from "../ZodUnixDate.ts";

export type AchievementsResourceSchema = ReturnType<typeof generateAchievementsResourceSchema>;
export type HypixelGameAchievements = z.infer<AchievementsResourceSchema>["achievements"][string];
export type HypixelTieredAchievement = HypixelGameAchievements["tiered"][string];
export type HypixelOneTimeAchievement = HypixelGameAchievements["one_time"][string];

export function generateAchievementsResourceSchema() {
    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        achievements: z.record(z.string(),
            z.object({
                one_time: z.record(z.string(),
                    z.object({
                        points: z.number().nonnegative(),
                        name: z.string(),
                        description: z.string(),
                        gamePercentUnlocked: z.number().min(0).max(100).default(0),
                        globalPercentUnlocked: z.number().min(0).max(100).default(0),
                        legacy: z.boolean().default(false),
                        secret: z.boolean().default(false)
                    })
                ).default({}).readonly(),
                tiered: z.record(z.string(),
                    z.object({
                        name: z.string(),
                        description: z.string(),
                        tiers: z.array(
                            z.object({
                                tier: z.number().nonnegative(),
                                points: z.number().nonnegative(),
                                amount: z.number().nonnegative()
                            }).readonly()
                        ).default([]).readonly(),
                    }).readonly()
                ).default({}).readonly(),
                total_points: z.number().default(0),
                total_legacy_points: z.number().default(0)
            })
        ).default({})
    })
}
