import * as z from "zod";
import {HypixelBaseSchema} from "../../HypixelBaseSchema";
import {ZodUnixDate} from "../../../ZodUnixDate";

export type SkyBlockCollectionsResourceSchema = ReturnType<typeof generateSkyBlockCollectionsResourceSchema>;
export type HypixelSkyBlockCollection = z.infer<SkyBlockCollectionsResourceSchema>["collections"][string];

export function generateSkyBlockCollectionsResourceSchema() {
    return HypixelBaseSchema.extend({
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
