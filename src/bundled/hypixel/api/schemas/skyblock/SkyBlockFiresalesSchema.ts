import z from "zod";
import {BaseSchema} from "../BaseSchema.ts";
import {ZodUnixDate} from "../ZodUnixDate.ts";

export type SkyBlockFiresalesSchema = ReturnType<typeof generateSkyBlockFiresalesSchema>;
export type HypixelSkyBlockFiresale = z.infer<SkyBlockFiresalesSchema>["sales"][number];

export function generateSkyBlockFiresalesSchema() {
    return BaseSchema.extend({
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
