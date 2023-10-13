import z from "zod";

export type BaseResponse = z.infer<typeof BaseSchema> & Record<string, any>

export const BaseSchema = z.object({
    success: z.boolean(),
    cause: z.string().nullish(),
    throttle: z.boolean().nullish(),
    global: z.boolean().nullish()
}).passthrough()
