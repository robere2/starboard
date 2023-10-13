import type {HypixelAPI} from "../HypixelAPI.ts";
import z from "zod";
import {UUID_REGEX} from "../../../../util.ts";
import {BaseSchema} from "./BaseSchema.ts";
import {ZodUnixDate} from "./ZodUnixDate.ts";
import {HypixelPlayer} from "./PlayerSchema.ts";
import {HypixelGame} from "./resources/GamesResourceSchema.ts";

export type BoosterSchema = ReturnType<typeof generateBoosterSchema>;
export type HypixelBooster = z.infer<BoosterSchema>["boosters"][number];

export function generateBoosterSchema(api: HypixelAPI) {
    return BaseSchema.extend({
        boosters: z.array(
            z.object({
                _id: z.string(),
                purchaserUuid: z.string().regex(UUID_REGEX).nullish(),
                amount: z.number().nullish(),
                originalLength: z.number().nullish(),
                length: z.number().nullish(),
                gameType: z.number().nullish(),
                dateActivated: ZodUnixDate.nullish().readonly(),
                stacked: z.union([z.array(z.string()).nullish().readonly(), z.boolean()]).readonly()
            }).transform((booster) => {
                return Object.assign(booster, {

                    /**
                     *
                     */
                    async getPurchaser(this: typeof booster): Promise<HypixelPlayer | null> {
                        if(!this.purchaserUuid) {
                            return null;
                        }
                        return await api.getPlayer(this.purchaserUuid);
                    },

                    /**
                     *
                     */
                    async getGame(this: typeof booster): Promise<HypixelGame | null> {
                        const games = api.getResources().games;
                        const matchingGameId = Object.entries(games).find(([, game]) => game.id === this.gameType)?.[0]
                        return matchingGameId ? games[matchingGameId] : null;
                    },

                    /**
                     *
                     */
                    async *stackedIterator(this: typeof booster): AsyncIterableIterator<HypixelPlayer | null> {
                        if(!Array.isArray(this.stacked)) {
                            return;
                        }

                        const stackedArr = this.stacked as string[];
                        for(const uuid of stackedArr) {
                            yield await api.getPlayer(uuid);
                        }
                    }
                })
            })
        ).default([]),
        boosterState: z.object({
            decrementing: z.boolean()
        }).readonly()
    })
}
