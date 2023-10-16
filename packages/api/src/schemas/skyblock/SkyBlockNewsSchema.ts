
import * as z from "zod";
import {BaseSchema} from "../../BaseAPI";

export type SkyBlockNewsSchema = ReturnType<typeof generateSkyBlockNewsSchema>;
export type HypixelSkyBlockNews = z.infer<SkyBlockNewsSchema>["items"][number];

export function generateSkyBlockNewsSchema() {
    return BaseSchema.extend({
        items: z.array(
            z.object({
                item: z.object({
                    material: z.string().nullish()
                }).nullish().readonly(),
                link: z.string().url().nullish(),
                text: z.string().nullish(),
                title: z.string().nullish()
            })
        ).default([])
    })
}
