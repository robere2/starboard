import {HypixelAPIErrorDef} from "./HypixelAPI.ts";

export class HypixelGame {
    public id: number;
    public name: string;
    public databaseName: string;
    public modeNames?: Record<string, string>;
    public retired?: boolean;
    public legacy?: boolean;

    public constructor(id: number, name: string, databaseName: string) {
        this.id = id;
        this.name = name;
        this.databaseName = databaseName;
    }
}

export type HypixelGamesResponse = {
    success: true;
    lastUpdated: number;
    games?: Record<string, HypixelGame>;
} | HypixelAPIErrorDef
