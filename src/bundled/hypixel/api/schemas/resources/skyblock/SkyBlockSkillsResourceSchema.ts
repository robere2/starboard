import type {HypixelAPI} from "../../../HypixelAPI.ts";
import z from "zod";
import {BaseSchema} from "../../BaseSchema.ts";
import {ZodUnixDate} from "../../ZodUnixDate.ts";
import {HypixelEntity} from "../../../HypixelEntity.ts";
import {HypixelSkyBlockCollection} from "./SkyBlockCollectionsResourceSchema.ts";

export type SkyBlockSkillsResourceSchema = ReturnType<typeof generateSkyBlockSkillsResourceSchema>;
export type HypixelSkyBlockSkill = HypixelEntity & z.infer<SkyBlockSkillsResourceSchema>["skills"][string];

export function generateSkyBlockSkillsResourceSchema(api: HypixelAPI) {
    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        version: z.string(),
        skills: z.record(z.string(),
            z.object({
                name: z.string(),
                description: z.string(),
                maxLevel: z.number(),
                levels: z.array(
                    z.object({
                        level: z.number().nonnegative(),
                        totalExpRequired: z.number().nonnegative(),
                        unlocks: z.array(z.string()).default([]).readonly()
                    }).readonly()
                ).default([]).readonly()
            }).readonly().transform(skill => {
                return Object.assign(new HypixelEntity(api), {
                    ...skill,

                    /**
                     *
                     */
                    getCollection(): HypixelSkyBlockCollection {
                        return api.getResources().skyBlockCollections[this.name.toUpperCase()];
                    }
                })
            })
        ).default({}).readonly()
    })
}
