import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelReward} from "./HypixelReward.ts";

export class HypixelQuestObjective {
    public id: string;
    public type: string;
    public integer?: number;
    [undocumentedProperties: string]: any

    constructor(input: HypixelAPIValue<HypixelQuestObjective>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.id == null) {
            throw new HypixelParseError("Objective ID cannot be null", input)
        }
        this.id = input.id;
        if(input.type == null) {
            throw new HypixelParseError("Objective type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelQuestRequirement {
    public type: string;
    [undocumentedProperties: string]: any

    constructor(input: HypixelAPIValue<HypixelQuestRequirement>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.type == null) {
            throw new HypixelParseError("Requirement type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelQuest {
    public id: string;
    public name: string;
    public description?: string;
    public rewards: HypixelReward[];
    public objectives: HypixelQuestObjective[];
    public requirements: HypixelQuestRequirement[];
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelQuest>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.id == null) {
            throw new HypixelParseError("Challenge ID cannot be null", input)
        }
        this.id = input.id;

        if(input.name == null) {
            throw new HypixelParseError("Challenge name cannot be null", input)
        }
        this.name = input.name;

        this.rewards = [];
        for(const reward of input.rewards ?? []) {
            if(!reward) {
                continue;
            }
            this.rewards.push(new HypixelReward(reward));
        }

        this.objectives = [];
        for(const objective of input.objectives ?? []) {
            if(!objective) {
                continue;
            }
            this.objectives.push(new HypixelQuestObjective(objective));
        }

        this.requirements = [];
        for(const requirements of input.requirements ?? []) {
            if(!requirements) {
                continue;
            }
            this.rewards.push(new HypixelQuestRequirement(requirements));
        }
    }
}

export type HypixelQuestsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    quests: Record<string, HypixelQuest[]>;
}>
