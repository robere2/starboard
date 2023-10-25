import type {HypixelAPI} from "../HypixelAPI";
import * as z from "zod";
import {HypixelEntity} from "../HypixelEntity";
import {BaseSchema} from "../BaseAPI";
import {EnumHypixelPlayerCounts, ZodEnumHypixelPlayerCounts} from "./enums";

export type PlayerCountsSchema = ReturnType<typeof generatePlayerCountsSchema>;
/**
 * Type-safe representation of the data retrieved from the `/counts` Hypixel endpoint. This type does not have
 *   its fields documented due to the size of the inferred type. Look at the source definition to see the data
 *   structure.
 * @see https://api.hypixel.net/#tag/Other/paths/~1counts/get
 */
export type HypixelPlayerCounts = z.infer<PlayerCountsSchema>;
/**
 * Type-safe representation of the player data of a Hypixel game, retrieved from the `/counts` Hypixel endpoint. This
 *   type does not have its fields documented due to the size of the inferred type. Look at the source definition to
 *   see the data structure.
 * @see https://api.hypixel.net/#tag/Other/paths/~1counts/get
 */
export type HypixelGamePlayerCount = HypixelEntity & HypixelPlayerCounts["games"][keyof typeof EnumHypixelPlayerCounts]

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
