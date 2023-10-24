import * as z from "zod";
import {BaseSchema} from "../../BaseAPI";
import {ZodUnixDate} from "../ZodUnixDate";
import {EnumHypixelGames, ZodEnumHypixelGames} from "../enums";

export type GamesResourceSchema = ReturnType<typeof generateGamesResourceSchema>;
export type HypixelGame = z.infer<GamesResourceSchema>["games"][keyof typeof EnumHypixelGames];

export function generateGamesResourceSchema() {
    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        games: z.record(ZodEnumHypixelGames,
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
