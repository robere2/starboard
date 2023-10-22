import * as z from "zod";
import {BaseSchema} from "../../BaseAPI";

export type SkyBlockBingoSchema = ReturnType<typeof generateSkyBlockBingoSchema>;
export type HypixelSkyBlockBingoProfile = z.infer<SkyBlockBingoSchema>["events"][number];

export function generateSkyBlockBingoSchema() {
    return BaseSchema.extend({
        events: z.array(
            z.object({
                key: z.number(),
                points: z.number().nonnegative(),
                completed_goals: z.array(z.string()).default([]).readonly()
            })
        ).default([])
    })
}