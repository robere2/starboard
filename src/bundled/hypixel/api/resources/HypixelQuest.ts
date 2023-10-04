import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export type HypixelQuestReward = {
    type: string;
    amount?: number;
    package?: string;
}

export type HypixelQuestObjective = {
    id: string;
    type: string;
    integer?: number;
}

export type HypixelQuestRequirement = {
    type: string;
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
        this.rewards.push(...input.rewards.reduce<HypixelQuestReward[]>((acc, reward) => {
            if(reward && reward.type) {
                acc.push(reward as HypixelQuestReward)
            }
            return acc;
        }, []))

        if(!input.objectives) {
            throw new HypixelParseError("Challenge objectives cannot be null", input)
        }
        this.objectives = [];
        this.objectives.push(...input.objectives.reduce<HypixelQuestObjective[]>((acc, objective) => {
            if(objective && objective.type && objective.id) {
                acc.push(objective as HypixelQuestObjective)
            }
            return acc;
        }, []))

        this.requirements = [];
        if(input.requirements) {
            this.requirements.push(...input.requirements.reduce<HypixelQuestRequirement[]>((acc, requirement) => {
                if(requirement && requirement.type) {
                    acc.push(requirement as HypixelQuestRequirement)
                }
                return acc;
            }, []))
        }
    }
}

export type HypixelQuestResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    quests: Record<string, HypixelQuest[]>;
}>
