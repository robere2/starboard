import * as z from "zod";
import {UUID_REGEX} from "../util";
import {BaseSchema} from "../BaseAPI";

export type StatusSchema = ReturnType<typeof generateStatusSchema>;
export type HypixelStatus = z.infer<StatusSchema>;
export type HypixelSession = Exclude<HypixelStatus["session"], null | undefined>;

export function generateStatusSchema() {
    return BaseSchema.extend({
        uuid: z.string().regex(UUID_REGEX).nullish(),
        session: z.object({
            online: z.boolean().nullish(),
            gameType: z.string().nullish(),
            mode: z.string().nullish(),
            map: z.string().nullish()
        }).nullish().readonly()
    })
}
