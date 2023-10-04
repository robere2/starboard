import {HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";

export type HypixelChallengeReward = {
    type: string;
    amount: number;
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
        this.rewards.push(...input.rewards.reduce<HypixelChallengeReward[]>((acc, reward) => {
            if(reward && reward.type && reward.amount) {
                acc.push(reward as HypixelChallengeReward)
            }
            return acc;
        }, []))
    }
}

export type HypixelChallengeResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    challenges: Record<string, HypixelChallenge[]>;
}>
