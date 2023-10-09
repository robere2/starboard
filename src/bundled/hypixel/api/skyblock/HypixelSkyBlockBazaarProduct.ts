import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export type HypixelSkyBlockBazaarPurchaseSummary = {
    amount: number,
    pricePerUnit: number,
    orders: number
};

export class HypixelSkyBlockBazaarProduct extends HypixelEntity {
    product_id: string;
    sell_summary: HypixelSkyBlockBazaarPurchaseSummary[] = [];
    buy_summary: HypixelSkyBlockBazaarPurchaseSummary[] = [];
    quick_status?: {
        productId?: string;
        sellPrice?: number;
        sellVolume?: number;
        sellMovingWeek?: number;
        sellOrders?: number;
        buyPrice?: number;
        buyVolume?: number;
        buyMovingWeek?: number;
        buyOrders?: number;
    }
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockBazaarProduct>) {
        super(root, resources);
        Object.assign(this, input);
        if(!input.product_id) {
            throw new HypixelParseError("SkyBlock bazaar product must have the \"product_id\" property", input);
        }
        this.product_id = input.product_id;
    }
}

export type HypixelSkyBlockBazaarResponse = HypixelAPIResponse<{
    products: Record<string, HypixelSkyBlockBazaarProduct>;
}>;
