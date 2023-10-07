import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";

export class HypixelSkyBlockBingoProfile extends HypixelEntity {
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockBingoProfile>) {
        super(root, resources);
        Object.assign(this, input);
    }
}

export type HypixelSkyBlockBingoProfilesResponse = HypixelAPIResponse<{
    events: HypixelSkyBlockBingoProfile[];
}>
