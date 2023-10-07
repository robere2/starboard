import {HypixelAPIResponse, HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";
import {HypixelResourceEntity} from "../HypixelResourceEntity.ts";
import {HypixelResources} from "../HypixelResources.ts";

export class HypixelSkyBlockBingoGoal extends HypixelResourceEntity {
    id: string;
    name: string;
    lore?: string;
    requiredAmount?: number;
    tiers?: number[];
    progress?: number

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockBingoGoal>) {
        super(parent);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.name == null) {
            throw new HypixelParseError("Bingo goal name cannot be null", input)
        }
        this.name = input.name;
        if(input.id == null) {
            throw new HypixelParseError("Bingo goal id cannot be null", input)
        }
        this.id = input.id;
    }
}

export class HypixelSkyBlockBingo extends HypixelResourceEntity {
    id: number;
    goals: HypixelSkyBlockBingoGoal[];

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockBingo>) {
        super(parent);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.id == null) {
            throw new HypixelParseError("Bingo ID cannot be null", input)
        }
        this.id = input.id;

        this.goals = [];
        for(const goal of input.goals ?? []) {
            if(!goal) {
                continue;
            }
            this.goals.push(new HypixelSkyBlockBingoGoal(parent, goal));
        }
    }
}

export type HypixelSkyBlockBingoResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    id: number;
    goals: HypixelSkyBlockBingoGoal[];
}>

