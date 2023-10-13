import z from "zod";
import {BaseSchema} from "../../BaseSchema.ts";
import {ZodUnixDate} from "../../ZodUnixDate.ts";

export type SkyBlockElectionResourceSchema = ReturnType<typeof generateSkyBlockElectionResourceSchema>;
export type HypixelSkyBlockMayor = z.infer<SkyBlockElectionResourceSchema>["mayor"];
export type HypixelSkyBlockCandidate = Exclude<z.infer<SkyBlockElectionResourceSchema>["current"], null | undefined>["candidates"][number];
export type HypixelSkyBlockElection = z.infer<SkyBlockElectionResourceSchema>["current"];

export function generateSkyBlockElectionResourceSchema() {

    const baseMayorSchema = z.object({
        key: z.string(),
        name: z.string(),
        perks: z.array(
            z.object({
                name: z.string(),
                description: z.string()
            }).readonly()
        ).default([]).readonly()
    });

    const electionSchema = z.object({
        year: z.number().nonnegative().int(),
        candidates: z.array(
            baseMayorSchema.extend({
                votes: z.number().nonnegative().int()
            })
        ).default([]).readonly()
    })

    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        mayor: baseMayorSchema.extend({
            election: electionSchema.nullable().default(null)
        }),
        current: electionSchema.nullish()
    })
}
