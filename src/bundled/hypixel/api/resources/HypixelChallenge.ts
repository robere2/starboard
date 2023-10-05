import {HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelReward} from "./HypixelReward.ts";
import {HypixelResource} from "./HypixelResource.ts";
import {HypixelResources} from "./HypixelResources.ts";

export class HypixelChallenge extends HypixelResource {
    public id: string;
    public name: string;
    public rewards: HypixelReward[];

    public constructor(parent: HypixelResources, input: HypixelAPIValue<HypixelChallenge>) {
        super(parent, input);
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
            this.rewards.push(new HypixelReward(parent, reward));
        }
    }
}

export type HypixelChallengeResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    challenges: Record<string, HypixelChallenge[]>;
}>
