import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export class HypixelSkyBlockBingoProfile extends HypixelEntity {
    public readonly key: number;
    public readonly points: number;
    public readonly completed_goals: string[];
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockBingoProfile>) {
        super(root, resources);
        Object.assign(this, input);

        if(input.key == null) {
            throw new HypixelParseError("SkyBlock bingo profile must have the \"key\" property", input);
        }
        this.key = input.key;
        if(input.points == null) {
            throw new HypixelParseError("SkyBlock bingo profile must have the \"points\" property", input);
        }
        this.points = input.points;
        if(input.completed_goals == null) {
            throw new HypixelParseError("SkyBlock bingo profile must have the \"completed_goals\" property", input);
        }
        this.completed_goals = [];
        for(const goal of input.completed_goals ?? []) {
            if(goal == null) {
                continue;
            }
            this.completed_goals.push(goal);
        }
    }
}

export type HypixelSkyBlockBingoProfilesResponse = HypixelAPIResponse<{
    events: HypixelSkyBlockBingoProfile[];
}>
