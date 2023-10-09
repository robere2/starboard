import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelSkyBlockProfileMember} from "./HypixelSkyBlockProfileMember.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export type HypixelSkyBlockProfileCommunityUpgradeState = {
    upgrade: string;
    tier: number;
    started_ms?: number;
    started_by?: string;
    claimed_ms?: number;
    claimed_by?: string;
    fasttracked?: boolean;
    [undocumentedProperties: string]: any;
}

export type HypixelSkyBlockProfileCommunityUpgrades = {
    currently_upgrading: unknown | null;
    upgrade_states?: HypixelSkyBlockProfileCommunityUpgradeState[];
    [undocumentedProperties: string]: any;
}

export type HypixelSkyBlockBankTransaction = {
    amount: number;
    timestamp: number;
    action: string;
    initiator_name: string;
    [undocumentedProperties: string]: any;
}

export class HypixelSkyBlockProfile extends HypixelEntity {
    profile_id: string;
    community_upgrades?: HypixelSkyBlockProfileCommunityUpgrades;
    members?: Record<string, HypixelSkyBlockProfileMember>;
    banking?: {
        balance?: number;
        transactions?: HypixelSkyBlockBankTransaction[];
        [undocumentedProperties: string]: any;
    }

    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockProfile>) {
        super(root, resources);
        Object.assign(this, input);

        if(input.profile_id == null) {
            throw new HypixelParseError("SkyBlock profile ID cannot be null", input);
        }
        this.profile_id = input.profile_id;
    }
}

export type HypixelSkyBlockProfileResponse = HypixelAPIResponse<{
    profile: HypixelSkyBlockProfile;
}>;

export type HypixelSkyBlockProfilesResponse = HypixelAPIResponse<{
    profiles: HypixelSkyBlockProfile[];
}>
