import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";

export class HypixelChallengeReward {
    public type: string;
    public amount?: number;
    public package?: string;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelChallengeReward>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(input.type == null) {
            throw new HypixelParseError("Challenge reward type cannot be null", input)
        }
        this.type = input.type;
    }
}

export class HypixelChallenge {
    public id: string;
    public name: string;
    public rewards: HypixelChallengeReward[];
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelChallenge>) {
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
            this.rewards.push(new HypixelChallengeReward(reward));
        }
    }
}

export type HypixelChallengeResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    challenges: Record<string, HypixelChallenge[]>;
}>
