import z from "zod";
import {BaseSchema} from "../BaseSchema.ts";
import {ZodUnixDate} from "../ZodUnixDate.ts";

export type QuestsResourceSchema = ReturnType<typeof generateQuestsResourceSchema>;
export type HypixelQuest = z.infer<QuestsResourceSchema>["quests"][string][number];

export function generateQuestsResourceSchema() {
    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.nullish().readonly(),
        quests: z.record(z.string(),
            z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    rewards: z.array(
                        z.object({
                            type: z.string(),
                            amount: z.number().nonnegative().nullish(),
                            package: z.string().nullish()
                        }).readonly()
                    ).default([]).readonly(),
                    objectives: z.array(
                        z.object({
                            id: z.string(),
                            type: z.string(),
                            integer: z.number().nullish()
                        }).readonly()
                    ).default([]).readonly(),
                    requirements: z.array(
                        z.object({
                            type: z.string()
                        }).readonly()
                    ).default([]).readonly(),
                })
            ).default([])
        ).default({})
    })
}
