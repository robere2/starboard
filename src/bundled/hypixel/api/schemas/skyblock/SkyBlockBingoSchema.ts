import z from "zod";
import {BaseSchema} from "../BaseSchema.ts";

export type SkyBlockBingoSchema = ReturnType<typeof generateSkyBlockBingoSchema>;
export type HypixelSkyBlockBingoProfile = z.infer<SkyBlockBingoSchema>["events"][number];

export function generateSkyBlockBingoSchema() {
    return BaseSchema.extend({
        events: z.array(
            z.object({
                key: z.string(),
                points: z.number().nonnegative(),
                completed_goals: z.array(z.string()).default([]).readonly()
            })
        ).default([])
    })
}
