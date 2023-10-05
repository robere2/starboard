import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelTieredGuildAchievement} from "./HypixelTieredGuildAchievement.ts";
import {HypixelResource} from "./HypixelResource.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelGuildAchievements extends HypixelResource {
    public one_time?: Record<string, unknown>;
    public tiered?: Record<string, HypixelTieredGuildAchievement>;

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelGuildAchievements>) {
        super(parent, input);
        // One-time guild achievements are defined in the API, but currently none exist
        this.one_time = input.one_time;

        this.tiered = {}
        for(const [key, value] of Object.entries(input.tiered ?? {})) {
            if(!value) {
                continue;
            }
            this.tiered[key] = new HypixelTieredGuildAchievement(parent, value)
        }
    }
}

export type HypixelGuildAchievementsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    one_time: Record<string, unknown>,
    tiered: Record<string, HypixelTieredGuildAchievement>;
}>
