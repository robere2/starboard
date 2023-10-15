import z from "zod";
import {BaseSchema} from "../../BaseAPI.ts";
import {ZodUnixDate} from "../ZodUnixDate.ts";

export type ChallengesResourceSchema = ReturnType<typeof generateChallengesResourceSchema>;
export type HypixelChallenge = z.infer<ChallengesResourceSchema>["challenges"][string][number];

export function generateChallengesResourceSchema() {
    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        challenges: z.record(z.string(),
            z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    rewards: z.array(
                        z.object({
                            type: z.string(),
                            amount: z.number().nonnegative()
                        }).readonly()
                    ).default([]).readonly()
                }).readonly()
            ).default([])
        ).default({})
    })
}
