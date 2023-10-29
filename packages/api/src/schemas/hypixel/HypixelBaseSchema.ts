import * as z from "zod";

export const HypixelBaseSchema = z.object({
    success: z.boolean(),
    cause: z.string().nullish(),
    throttle: z.boolean().nullish(),
    global: z.boolean().nullish()
}).passthrough()
