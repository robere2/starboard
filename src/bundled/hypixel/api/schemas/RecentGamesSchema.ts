import type {HypixelAPI} from "../HypixelAPI.ts";
import z from "zod";
import {UUID_REGEX} from "../../../../util.ts";
import {HypixelEntity} from "../HypixelEntity.ts";
import {BaseSchema} from "./BaseSchema.ts";
import {ZodEnumHypixelGames} from "./enums.ts";
import {ZodUnixDate} from "./ZodUnixDate.ts";

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
