import z from "zod";
import {BaseSchema} from "../BaseSchema.ts";
import {ZodUnixDate} from "../ZodUnixDate.ts";

export type GamesResourceSchema = ReturnType<typeof generateGamesResourceSchema>;
export type HypixelGame = z.infer<GamesResourceSchema>["games"][string];

export function generateGamesResourceSchema() {
    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        games: z.record(z.string(),
            z.object({
                id: z.number(),
                name: z.string(),
                databaseName: z.string(),
                modeNames: z.record(z.string(), z.string()).default({}).readonly(),
                retired: z.boolean().default(false),
                legacy: z.boolean().default(false)
            })
        ).default({})
    })
}
