import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";
import {HypixelEntity} from "./resources/HypixelEntity.ts";

export class HypixelPlayer extends HypixelEntity {
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

    public constructor(root: HypixelAPI, input: HypixelAPIValue<HypixelPlayer>) {
        super(root);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input.uuid) {
            throw new HypixelParseError("Player UUID cannot be null", input)
        }
        this.uuid = input.uuid;
    }
}

export type HypixelPlayerResponse = HypixelAPIResponse<{
    player: HypixelPlayer;
}>
