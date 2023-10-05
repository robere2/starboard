import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export class HypixelQuestReward {
    public type: string;
    public amount?: number;
    public package?: string;
    [undocumentedProperties: string]: any

    constructor(input: HypixelAPIValue<HypixelQuestReward>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input.type) {
            throw new HypixelParseError("Reward type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelQuestObjective {
    public id: string;
    public type: string;
    public integer?: number;
    [undocumentedProperties: string]: any

    constructor(input: HypixelAPIValue<HypixelQuestObjective>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input.id) {
            throw new HypixelParseError("Objective ID cannot be null", input)
        }
        this.id = input.id;
        if(!input.type) {
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
        if(!input.type) {
            throw new HypixelParseError("Requirement type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelQuest {
    public id: string;
    public name: string;
    public description?: string;
    public rewards: HypixelQuestReward[];
    public objectives: HypixelQuestObjective[];
    public requirements: HypixelQuestRequirement[];
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelQuest>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input.id) {
            throw new HypixelParseError("Challenge ID cannot be null", input)
        }
        this.id = input.id;

        if(!input.name) {
            throw new HypixelParseError("Challenge name cannot be null", input)
        }
        this.name = input.name;

        if(!input.rewards) {
            throw new HypixelParseError("Challenge rewards cannot be null", input)
        }
        this.rewards = [];
        for(const reward of input.rewards) {
            if(!reward) {
                continue;
            }
            this.rewards.push(new HypixelQuestReward(reward));
        }

        if(!input.objectives) {
            throw new HypixelParseError("Challenge objectives cannot be null", input)
        }
        this.objectives = [];
        for(const objective of input.objectives) {
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

export type HypixelQuestResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    quests: Record<string, HypixelQuest[]>;
}>
