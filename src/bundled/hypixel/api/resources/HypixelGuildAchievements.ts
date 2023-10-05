import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelTieredGuildAchievement} from "./HypixelTieredGuildAchievement.ts";

export class HypixelGuildAchievements {
    public one_time?: Record<string, unknown>;
    public tiered?: Record<string, HypixelTieredGuildAchievement>;

    public constructor(input: HypixelAPIValue<HypixelGuildAchievements>) {
        // One-time guild achievements are defined in the API, but currently none exist
        this.one_time = input.one_time;

        this.tiered = {}
        for(const [key, value] of Object.entries(input.tiered ?? {})) {
            if(!value) {
                continue;
            }
            this.tiered[key] = new HypixelTieredGuildAchievement(value)
        }
    }
}

export type HypixelGuildAchievementsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    one_time: Record<string, unknown>,
    tiered: Record<string, HypixelTieredGuildAchievement>;
}>
