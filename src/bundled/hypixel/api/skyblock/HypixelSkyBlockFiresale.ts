import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";

export class HypixelSkyBlockFiresale extends HypixelEntity {
    public readonly item_id?: string;
    public readonly start?: number;
    public readonly end?: number;
    public readonly amount?: number;
    public readonly price?: number;
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockFiresale>) {
        super(root, resources);
        Object.assign(this, input);
    }
}
export type HypixelSkyBlockFiresalesResponse = HypixelAPIResponse<{
    sales: HypixelSkyBlockFiresale[];
}>
