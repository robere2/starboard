import * as z from "zod";
import {UUID_REGEX} from "../../util";
import {ZodEnumHypixelGames} from "../enums";
import {ZodUnixDate} from "../ZodUnixDate";
import {HypixelBaseSchema} from "./HypixelBaseSchema";

export type RecentGamesSchema = ReturnType<typeof generateRecentGamesSchema>;
export type HypixelRecentGame = Exclude<z.infer<RecentGamesSchema>["games"], undefined | null>[number];

export function generateRecentGamesSchema() {
    return HypixelBaseSchema.extend({
        uuid: z.string().regex(UUID_REGEX).nullish(),
        games: z.array(z.object({
            date: ZodUnixDate.nullish(),
            gameType: ZodEnumHypixelGames.nullish(),
            mode: z.string().nullish(),
            map: z.string().nullish(),
            ended: ZodUnixDate.nullish(),
        }).readonly()).default([])
    })
}
