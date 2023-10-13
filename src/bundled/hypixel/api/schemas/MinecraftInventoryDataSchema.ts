import z from "zod";

export const MinecraftInventoryDataSchema = z.object({
    type: z.number().nullish(),
    data: z.string().nullish()
})
