import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelTieredGuildAchievement} from "./HypixelTieredGuildAchievement.ts";
import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelGuildAchievements extends HypixelEntity {
    public one_time?: Record<string, unknown>;
    public tiered?: Record<string, HypixelTieredGuildAchievement>;

    public constructor(root: HypixelAPI, parent: HypixelResources, input: HypixelAPIValue<HypixelGuildAchievements>) {
        super(root, parent);
        Object.assign(this, input); // Copy undocumented and non-required properties
        // One-time guild achievements are defined in the API, but currently none exist
        this.one_time = input.one_time;

        this.tiered = {}
        for(const [key, value] of Object.entries(input.tiered ?? {})) {
            if(!value) {
                continue;
            }
            this.tiered[key] = new HypixelTieredGuildAchievement(root, parent, value)
        }
    }
}

export type HypixelGuildAchievementsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    one_time: Record<string, unknown>,
    tiered: Record<string, HypixelTieredGuildAchievement>;
}>
