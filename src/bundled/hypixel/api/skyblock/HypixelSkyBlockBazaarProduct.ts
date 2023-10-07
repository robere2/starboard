import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";

export class HypixelSkyBlockBazaarProduct extends HypixelEntity {
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockBazaarProduct>) {
        super(root, resources);
        Object.assign(this, input);
    }
}

export type HypixelSkyBlockBazaarResponse = HypixelAPIResponse<{
    products: Record<string, HypixelSkyBlockBazaarProduct>;
}>;
