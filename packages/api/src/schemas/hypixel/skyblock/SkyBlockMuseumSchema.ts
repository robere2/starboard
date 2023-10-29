import * as z from "zod";
import {HypixelBaseSchema} from "../HypixelBaseSchema";
import {UUID_REGEX} from "../../../util";
import {ZodUnixDate} from "../../ZodUnixDate";
import {MinecraftInventoryDataSchema} from "../../MinecraftInventoryDataSchema";

export type SkyBlockMuseumSchema = ReturnType<typeof generateSkyBlockMuseumSchema>;
export type HypixelSkyBlockMuseum = z.infer<SkyBlockMuseumSchema>["members"][string];

export function generateSkyBlockMuseumSchema() {
    return HypixelBaseSchema.extend({
        members: z.record(z.string().regex(UUID_REGEX),
            z.object({
                value: z.number().nonnegative().nullish(),
                appraisal: z.boolean().nullish(),
                items: z.record(z.string(),
                    z.object({
                        donated_time: ZodUnixDate.readonly().nullish(),
                        borrowing: z.boolean().nullish(),
                        items: MinecraftInventoryDataSchema.readonly().nullish() // TODO decoder
                    }).readonly().default({})
                )
            })
        ).default({})
    })
}
