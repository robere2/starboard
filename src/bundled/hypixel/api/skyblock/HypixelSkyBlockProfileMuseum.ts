import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";

export class HypixelSkyBlockProfileMuseum extends HypixelEntity {
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockProfileMuseum>) {
        super(root, resources);
        Object.assign(this, input);
    }
}

export type HypixelSkyBlockMuseumResponse = HypixelAPIResponse<{
    members: Record<string, HypixelSkyBlockProfileMuseum>;
}>;
