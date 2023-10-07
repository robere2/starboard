import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";
import {HypixelEntity} from "./resources/HypixelEntity.ts";

export class HypixelGuild extends HypixelEntity {
    _id: string; // Not documented, but pretty safe to assume this will always be present.
    [undocumentedProperties: string]: any

    public constructor(root: HypixelAPI, input: HypixelAPIValue<HypixelGuild>) {
        super(root);
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input._id) {
            throw new HypixelParseError("Guild ID is required", input)
        }
        this._id = input._id;
    }
}

export type HypixelGuildResponse = HypixelAPIResponse<{ guild: HypixelGuild | null }>
