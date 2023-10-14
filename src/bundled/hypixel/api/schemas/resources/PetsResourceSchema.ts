import z from "zod";
import {BaseSchema} from "../../../../BaseAPI.ts";
import {ZodUnixDate} from "../ZodUnixDate.ts";
import {ZodEnumMinecraftFormatting} from "../enums.ts";

export type PetsResourceSchema = ReturnType<typeof generatePetsResourceSchema>;
export type HypixelPet = z.infer<PetsResourceSchema>["types"][number];
export type HypixelRarity = z.infer<PetsResourceSchema>["rarities"][number];

export function generatePetsResourceSchema() {
    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        types: z.array(
            z.object({
                key: z.string(),
                name: z.string(),
                rarity: z.string().nullable().default(null),
                package: z.string()
            })
        ).default([]),
        rarities: z.array(
            z.object({
                name: z.string(),
                color: ZodEnumMinecraftFormatting
            })
        ).default([])
    })
}
