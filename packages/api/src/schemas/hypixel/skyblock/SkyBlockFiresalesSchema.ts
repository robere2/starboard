import * as z from "zod";
import {ZodUnixDate} from "../../ZodUnixDate";
import {HypixelBaseSchema} from "../HypixelBaseSchema";

export type SkyBlockFiresalesSchema = ReturnType<typeof generateSkyBlockFiresalesSchema>;
export type HypixelSkyBlockFiresale = z.infer<SkyBlockFiresalesSchema>["sales"][number];

export function generateSkyBlockFiresalesSchema() {
    return HypixelBaseSchema.extend({
        sales: z.array(
            z.object({
                item_id: z.string(),
                start: ZodUnixDate,
                end: ZodUnixDate,
                amount: z.number().nonnegative().int(),
                price: z.number()
            })
        ).default([])
    })
}
