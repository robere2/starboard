import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelEntity} from "./resources/HypixelEntity.ts";

export class HypixelRecentGame extends HypixelEntity {
    date?: number;
    gameType?: string;
    mode?: string | null;
    map?: string | null;
    ended?: number;
    [undocumentedProperties: string]: any

    public constructor(root: HypixelAPI, input: HypixelAPIValue<HypixelRecentGame>) {
        super(root);
        Object.assign(this, input); // Copy undocumented and non-required properties
    }
}

export type HypixelRecentGamesResponse = HypixelAPIResponse<{
    uuid: string;
    games: HypixelRecentGame[];
}>
