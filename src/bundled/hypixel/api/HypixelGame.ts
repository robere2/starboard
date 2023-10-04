import {HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";

export class HypixelGame {
    public id: number;
    public name: string;
    public databaseName: string;
    public modeNames?: Record<string, string>;
    public retired?: boolean;
    public legacy?: boolean;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelGame>) {
        if(!input.id) {
            throw new HypixelParseError("Game ID cannot be null", input)
        }
        if(!input.name) {
            throw new HypixelParseError("Game name cannot be null", input)
        }
        if(!input.databaseName) {
            throw new HypixelParseError("Game database name cannot be null", input)
        }
        this.id = input.id;
        this.name = input.name;
        this.databaseName = input.databaseName;
        Object.assign(this, input); // Copy undocumented and non-required properties
    }
}

export type HypixelGamesResponse = HypixelAPIResponse<{
    success: true;
    lastUpdated: number;
    games: Record<string, HypixelGame>;
}>
