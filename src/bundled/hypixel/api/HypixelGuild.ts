import {HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";

export class HypixelGuild {
    _id: string; // Not documented, but pretty safe to assume this will always be present.
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelGuild>) {
        if(!input._id) {
            throw new HypixelParseError("Guild ID is required", input)
        }
        this._id = input._id;
        Object.assign(this, input); // Copy undocumented and non-required properties
    }
}

export type HypixelGuildResponse = HypixelAPIResponse<{ guild: HypixelGuild | null }>
