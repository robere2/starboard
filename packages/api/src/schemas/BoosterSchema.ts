import type {HypixelAPI} from "../HypixelAPI";
import * as z from "zod";
import {MONGODB_ID_REGEX, UUID_REGEX} from "../util";
import {HypixelEntity} from "../HypixelEntity";
import {BaseSchema} from "../BaseAPI";
import {ZodUnixDate} from "./ZodUnixDate";
import {HypixelPlayer} from "./PlayerSchema";
import {HypixelGame} from "./resources/GamesResourceSchema";

export type BoosterSchema = ReturnType<typeof generateBoosterSchema>;
export type HypixelBooster = HypixelEntity & z.infer<BoosterSchema>["boosters"][number];

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
                return Object.assign(new HypixelEntity(api), {
                    ...booster,

                    /**
                     *
                     */
                    async getPurchaser(this: HypixelEntity & typeof booster): Promise<HypixelPlayer | null> {
                        if(!this.purchaserUuid) {
                            return null;
                        }
                        return await this.getRoot().getPlayer(this.purchaserUuid);
                    },

                    /**
                     *
                     */
                    async getGame(this: HypixelEntity & typeof booster): Promise<HypixelGame | null> {
                        const games = this.getRoot().getResources().games;
                        const matchingGameId = Object.entries(games).find(([, game]) => game.id === this.gameType)?.[0]
                        return matchingGameId ? games[matchingGameId] : null;
                    },

                    /**
                     *
                     */
                    getDateScheduled(this: HypixelEntity & typeof booster): Date | null {
                        // First four bytes of MongoDB IDs contain the timestamp of document insertion
                        if(!MONGODB_ID_REGEX.test(this._id)) {
                            return null;
                        }
                        return new Date(parseInt(this._id.substring(0, 8), 16) * 1000);
                    },

                    /**
                     *
                     */
                    async *stackedIterator(this: HypixelEntity & typeof booster): AsyncIterableIterator<HypixelPlayer | null> {
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
