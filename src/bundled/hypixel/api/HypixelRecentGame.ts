import {HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";

export class HypixelRecentGame {
    date?: number;
    gameType?: string;
    mode?: string;
    map?: string;
    ended?: number;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelRecentGame>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
    }
}

export type HypixelRecentGamesResponse = HypixelAPIResponse<{
    uuid: string;
    games: HypixelRecentGame[];
}>
