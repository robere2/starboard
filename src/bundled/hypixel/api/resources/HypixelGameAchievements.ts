import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelTieredAchievement} from "./HypixelTieredAchievement.ts";
import {HypixelOneTimeAchievement} from "./HypixelOneTimeAchievement.ts";
import {HypixelResource} from "./HypixelResource.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelGameAchievements extends HypixelResource {
    public one_time?: Record<string, HypixelOneTimeAchievement>;
    public tiered?: Record<string, HypixelTieredAchievement>;
    public total_points?: number;
    public total_legacy_points?: number;

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelGameAchievements>) {
        super(parent, input);

        this.one_time = {}
        for(const [key, value] of Object.entries(input.one_time ?? {})) {
            if(!value) {
                continue;
            }
            this.one_time[key] = new HypixelOneTimeAchievement(parent, value)
        }

        this.tiered = {}
        for(const [key, value] of Object.entries(input.tiered ?? {})) {
            if(!value) {
                continue;
            }
            this.tiered[key] = new HypixelTieredAchievement(parent, value)
        }
    }
}

export type HypixelAchievementsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    achievements: Record<string, HypixelGameAchievements>;
}>
