import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";

export class HypixelSkyBlockProfile extends HypixelEntity {
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockProfile>) {
        super(root, resources);
        Object.assign(this, input);
    }
}

export type HypixelSkyBlockProfileResponse = HypixelAPIResponse<{
    profile: HypixelSkyBlockProfile;
}>;

export type HypixelSkyBlockProfilesResponse = HypixelAPIResponse<{
    profiles: HypixelSkyBlockProfile[];
}>
