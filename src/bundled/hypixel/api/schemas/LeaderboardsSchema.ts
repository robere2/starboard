import type {HypixelAPI} from "../HypixelAPI.ts";
import z from "zod";
import {UUID_REGEX} from "../../../../util.ts";
import {HypixelEntity} from "../HypixelEntity.ts";
import {BaseSchema} from "../../../BaseAPI.ts";
import {ZodEnumHypixelGames} from "./enums.ts";
import {HypixelPlayer} from "./PlayerSchema.ts";

export type LeaderboardsSchema = ReturnType<typeof generateLeaderboardsSchema>;
export type HypixelLeaderboards = z.infer<LeaderboardsSchema>["leaderboards"];
export type HypixelLeaderboard = HypixelEntity & Exclude<HypixelLeaderboards[z.infer<typeof ZodEnumHypixelGames>], undefined>[number]

export function generateLeaderboardsSchema(api: HypixelAPI) {
    return BaseSchema.extend({
        leaderboards: z.record(ZodEnumHypixelGames, z.array(z.object({
            path: z.string(),
            prefix: z.string(),
            title: z.string(),
            location: z.string(),
            count: z.number(),
            leaders: z.array(z.string().regex(UUID_REGEX)).default([]).readonly()
        }).transform((leaderboard) => {
            return Object.assign(new HypixelEntity(api), {
                ...leaderboard,

                /**
                 *
                 */
                async *[Symbol.asyncIterator](this: HypixelEntity & typeof leaderboard): AsyncIterableIterator<HypixelPlayer | null> {
                    for(const leader of this.leaders ?? []) {
                        yield await api.getPlayer(leader)
                    }
                }
            })
        })).default([]).readonly()).default({}).readonly()
    })
}
