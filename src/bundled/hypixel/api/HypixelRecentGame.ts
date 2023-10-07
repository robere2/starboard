import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelEntity} from "./HypixelEntity.ts";
import { HypixelResources } from "./resources";

export class HypixelRecentGame extends HypixelEntity {
    date?: number;
    gameType?: string;
    mode?: string | null;
    map?: string | null;
    ended?: number;
    [undocumentedProperties: string]: any

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelRecentGame>) {
        super(root, resources);
        Object.assign(this, input); // Copy undocumented and non-required properties
    }
}

export type HypixelRecentGamesResponse = HypixelAPIResponse<{
    uuid: string;
    games: HypixelRecentGame[];
}>
