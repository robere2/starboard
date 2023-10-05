import {HypixelAPIResponse, HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";
import {HypixelResource} from "../HypixelResource.ts";
import {HypixelResources} from "../HypixelResources.ts";

export class HypixelSkyBlockBingoGoal extends HypixelResource {
    id: string;
    name: string;
    lore?: string;
    requiredAmount?: number;
    tiers?: number[];
    progress?: number

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockBingoGoal>) {
        super(parent, input);
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

export class HypixelSkyBlockBingo extends HypixelResource {
    id: number;
    goals: HypixelSkyBlockBingoGoal[];

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockBingo>) {
        super(parent, input);
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

