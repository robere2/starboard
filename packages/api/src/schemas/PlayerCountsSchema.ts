import type {HypixelAPI} from "../HypixelAPI";
import * as z from "zod";
import {HypixelEntity} from "../HypixelEntity";
import {BaseSchema} from "../BaseAPI";
import {ZodEnumHypixelPlayerCounts} from "./enums";

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
