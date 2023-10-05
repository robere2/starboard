import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelTieredAchievement} from "./HypixelTieredAchievement.ts";
import {HypixelOneTimeAchievement} from "./HypixelOneTimeAchievement.ts";

export class HypixelGameAchievements {
    public one_time?: Record<string, HypixelOneTimeAchievement>;
    public tiered?: Record<string, HypixelTieredAchievement>;
    public total_points?: number;
    public total_legacy_points?: number;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelGameAchievements>) {
        Object.assign(this, input); // Copy undocumented and non-required properties

        this.one_time = {}
        for(const [key, value] of Object.entries(input.one_time ?? {})) {
            if(!value) {
                continue;
            }
            this.one_time[key] = new HypixelOneTimeAchievement(value)
        }

        this.tiered = {}
        for(const [key, value] of Object.entries(input.tiered ?? {})) {
            if(!value) {
                continue;
            }
            this.tiered[key] = new HypixelTieredAchievement(value)
        }
    }
}

export type HypixelAchievementsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    achievements: Record<string, HypixelGameAchievements>;
}>
