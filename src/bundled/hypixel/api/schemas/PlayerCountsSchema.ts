import type {HypixelAPI} from "../HypixelAPI.ts";
import z from "zod";
import {HypixelEntity} from "../HypixelEntity.ts";
import {BaseSchema} from "../BaseAPI.ts";
import {ZodEnumHypixelPlayerCounts} from "./enums.ts";

export type PlayerCountsSchema = ReturnType<typeof generatePlayerCountsSchema>;
export type HypixelPlayerCounts = z.infer<PlayerCountsSchema>;
export type HypixelGamePlayerCount = HypixelEntity & HypixelPlayerCounts[z.infer<typeof ZodEnumHypixelPlayerCounts>]

export function generatePlayerCountsSchema(api: HypixelAPI) {
    return BaseSchema.extend({
        games: z.record(ZodEnumHypixelPlayerCounts, z.object({
            players: z.number().nonnegative().nullish(),
            modes: z.record(z.string(), z.number().nonnegative()).nullish()
        }).default({}).readonly().transform((game) => {
            return Object.assign(new HypixelEntity(api), {
                ...game,

                // /**
                //  *
                //  */
                // getGame(this: HypixelEntity & typeof game): HypixelGame | null {
                //     // TODO need access to parent somehow
                // }
            })
        })),
        playerCount: z.number().nonnegative().nullish()
    })
}
