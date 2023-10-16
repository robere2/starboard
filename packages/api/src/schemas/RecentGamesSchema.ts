import type {HypixelAPI} from "../HypixelAPI";
import * as z from "zod";
import {UUID_REGEX} from "../util";
import {HypixelEntity} from "../HypixelEntity";
import {BaseSchema} from "../BaseAPI";
import {ZodEnumHypixelGames} from "./enums";
import {ZodUnixDate} from "./ZodUnixDate";

export type RecentGamesSchema = ReturnType<typeof generateRecentGamesSchema>;
export type HypixelRecentGame = Exclude<z.infer<RecentGamesSchema>["games"], undefined | null>[number];

export function generateRecentGamesSchema(api: HypixelAPI) {
    return BaseSchema.extend({
        uuid: z.string().regex(UUID_REGEX).nullish(),
        games: z.array(z.object({
            date: ZodUnixDate.nullish(),
            gameType: ZodEnumHypixelGames.nullish(),
            mode: z.string().nullish(),
            map: z.string().nullish(),
            ended: ZodUnixDate.nullish(),
        }).readonly().transform((game) => {
            return Object.assign(new HypixelEntity(api), {
                ...game,
            });
        })).default([])
    })
}
