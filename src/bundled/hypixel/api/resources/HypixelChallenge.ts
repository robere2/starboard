import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelReward} from "./HypixelReward.ts";

export class HypixelChallenge {
    public id: string;
    public name: string;
    public rewards: HypixelReward[];
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

        this.rewards = [];
        for(const reward of input.rewards ?? []) {
            if(!reward) {
                continue;
            }
            this.rewards.push(new HypixelReward(reward));
        }
    }
}

export type HypixelChallengeResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    challenges: Record<string, HypixelChallenge[]>;
}>
