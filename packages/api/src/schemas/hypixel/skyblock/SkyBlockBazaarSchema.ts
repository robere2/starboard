import * as z from "zod";
import {HypixelBaseSchema} from "../HypixelBaseSchema";

export type SkyBlockBazaarSchema = ReturnType<typeof generateSkyBlockBazaarSchema>;
export type HypixelSkyBlockBazaarProduct = z.infer<SkyBlockBazaarSchema>["products"][string];

export function generateSkyBlockBazaarSchema() {
    return HypixelBaseSchema.extend({
        products: z.record(z.string(),
            z.object({
                product_id: z.string(), // TODO getter
                sell_summary: z.array(
                    z.object({
                        amount: z.number().nonnegative().nullish(),
                        pricePerUnit: z.number().nonnegative().nullish(),
                        orders: z.number().int().nonnegative().nullish()
                    })
                ).default([]).readonly(),
                buy_summary: z.array(
                    z.object({
                        amount: z.number().nonnegative().nullish(),
                        pricePerUnit: z.number().nonnegative().nullish(),
                        orders: z.number().int().nonnegative().nullish()
                    })
                ).default([]).readonly(),
                quick_status: z.object({
                    productId: z.string(),
                    sellPrice: z.number().nonnegative().nullish(),
                    sellVolume: z.number().nonnegative().nullish(),
                    sellMovingWeek: z.number().nonnegative().nullish(),
                    sellOrders: z.number().int().nonnegative().nullish(),
                    buyPrice: z.number().nonnegative().nullish(),
                    buyVolume: z.number().nonnegative().nullish(),
                    buyMovingWeek: z.number().nonnegative().nullish(),
                    buyOrders: z.number().int().nonnegative().nullish()
                }).readonly()
            })
        ).default({})
    })
}
