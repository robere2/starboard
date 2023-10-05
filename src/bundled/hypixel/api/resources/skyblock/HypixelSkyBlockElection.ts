import {HypixelAPIResponse, HypixelAPIValue} from "../../HypixelAPI.ts";
import {HypixelParseError} from "../../HypixelParseError.ts";
import {HypixelSkyBlockMayor} from "./HypixelSkyBlockMayor.ts";

export class HypixelSkyBlockElection {
    public year: number;
    public candidates: (HypixelSkyBlockMayor & {votes: number})[];
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelSkyBlockElection>) {
        Object.assign(this, input); // Copy undocumented and non-required properties

        if(input.year == null) {
            throw new HypixelParseError("Election year cannot be null", input)
        }
        this.year = input.year;

        this.candidates = [];
        for(const candidate of input.candidates ?? []) {
            if(!candidate) {
                continue;
            }
            const mayor: HypixelSkyBlockMayor & {votes: number} = new HypixelSkyBlockMayor(candidate) as any;
            mayor.votes = candidate.votes ?? 0;
            this.candidates.push(mayor);
        }
    }
}

export type HypixelSkyBlockElectionResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    mayor: HypixelSkyBlockMayor,
    current: HypixelSkyBlockElection
}>
