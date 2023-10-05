import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelReward} from "./HypixelReward.ts";
import {HypixelResource} from "./HypixelResource.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelQuestObjective extends HypixelResource {
    public id: string;
    public type: string;
    public integer?: number;

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelQuestObjective>) {
        super(parent, input);
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

export class HypixelQuestRequirement extends HypixelResource {
    public type: string;

    constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelQuestRequirement>) {
        super(parent, input);
        if(input.type == null) {
            throw new HypixelParseError("Requirement type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelQuest extends HypixelResource {
    public id: string;
    public name: string;
    public description?: string;
    public rewards: HypixelReward[];
    public objectives: HypixelQuestObjective[];
    public requirements: HypixelQuestRequirement[];

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelQuest>) {
        super(parent, input);
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
            this.rewards.push(new HypixelReward(parent, reward));
        }

        this.objectives = [];
        for(const objective of input.objectives ?? []) {
            if(!objective) {
                continue;
            }
            this.objectives.push(new HypixelQuestObjective(parent, objective));
        }

        this.requirements = [];
        for(const requirements of input.requirements ?? []) {
            if(!requirements) {
                continue;
            }
            this.rewards.push(new HypixelQuestRequirement(parent, requirements));
        }
    }
}

export type HypixelQuestsResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    quests: Record<string, HypixelQuest[]>;
}>
