import {HypixelEntity} from "./HypixelEntity.ts";
import {HypixelResources} from "./resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";

export class HypixelBooster extends HypixelEntity {
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelBooster>) {
        super(root, resources);
        Object.assign(this, input);
    }
}
export type HypixelBoostersResponse = HypixelAPIResponse<{
    boosters: HypixelBooster[];
    boosterState: {
        decrementing: boolean
    }
}>
