import {HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";

export class HypixelPlayer {
    public readonly uuid: string;
    public readonly displayname?: string | null = null;
    public readonly rank?: string | null = null;
    public readonly packageRank?: string | null = null;
    public readonly newPackageRank?: string | null = null;
    public readonly monthlyPackageRank?: string | null = null;
    public readonly firstLogin?: number | null = null;
    public readonly lastLogin?: number | null = null;
    public readonly lastLogout?: number | null = null;
    public readonly stats?: Record<string, any> | null = null;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelPlayer>) {

        if(!input.uuid) {
            throw new HypixelParseError("Player UUID cannot be null", input)
        }
        this.uuid = input.uuid;
        Object.assign(this, input); // Copy undocumented and non-required properties
    }
}

export type HypixelPlayerResponse = HypixelAPIResponse<{
    player: HypixelPlayer;
}>
