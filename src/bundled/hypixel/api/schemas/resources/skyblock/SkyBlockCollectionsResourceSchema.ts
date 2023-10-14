import z from "zod";
import {BaseSchema} from "../../../../../BaseAPI.ts";
import {ZodUnixDate} from "../../ZodUnixDate.ts";

export type SkyBlockCollectionsResourceSchema = ReturnType<typeof generateSkyBlockCollectionsResourceSchema>;
export type HypixelSkyBlockCollection = z.infer<SkyBlockCollectionsResourceSchema>["collections"][string];

export function generateSkyBlockCollectionsResourceSchema() {
    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        version: z.string(),
        collections: z.record(z.string(),
            z.object({
                name: z.string(),
                items: z.record(z.string(),
                    z.object({
                        name: z.string(),
                        maxTiers: z.number().nonnegative(),
                        tiers: z.array(
                            z.object({
                                tier: z.number().nonnegative().int(),
                                amountRequired: z.number().nonnegative(),
                                unlocks: z.array(z.string()).default([]).readonly()
                            }).readonly()
                        ).default([]).readonly()
                    }).readonly()
                ).default({}).readonly()
            }).readonly()
        ).default({}).readonly()
    })
}
