import * as z from "zod";
import {BaseSchema} from "../../../BaseAPI";
import {ZodUnixDate} from "../../ZodUnixDate";

export type SkyBlockBingoResourceSchema = ReturnType<typeof generateSkyBlockBingoResourceSchema>;
export type HypixelSkyBlockBingo = z.infer<SkyBlockBingoResourceSchema>;
export type HypixelSkyBlockBingoGoal = HypixelSkyBlockBingo["goals"][number];

export function generateSkyBlockBingoResourceSchema() {
    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        id: z.number(),
        goals: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                lore: z.string().nullish(),
                requiredAmount: z.number().nonnegative().nullish(),
                tiers: z.array(
                    z.number()
                ).nullish(),
                progress: z.number().nullish()
            })
        ).default([])
    })
}
