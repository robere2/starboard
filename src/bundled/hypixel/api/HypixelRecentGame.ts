import {HypixelAPIErrorDef} from "./HypixelAPI.ts";

export class HypixelRecentGame {
    date: number;
    gameType: string;
    mode: string;
    map: string;
    ended: number;
    [undocumentedProperties: string]: any

    public constructor(data: HypixelRecentGame) {
        this.date = data.date;
        this.gameType = data.gameType;
        this.mode = data.mode;
        this.map = data.map;
        this.ended = data.ended;
        Object.assign(this, data); // Copy all undocumented properties
    }
}

export type HypixelRecentGamesResponse = {
    success: true;
    uuid: string;
    games: HypixelRecentGame[];
} | HypixelAPIErrorDef
