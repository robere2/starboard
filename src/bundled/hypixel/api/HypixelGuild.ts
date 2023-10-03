import {HypixelAPIErrorDef} from "./HypixelAPI.ts";

export class HypixelGuild {
    _id: string; // Not documented, but pretty safe to assume this will always be present.
    [undocumentedProperties: string]: any

    public constructor(id: string) {
        this._id = id;
    }
}

export type HypixelGuildResponse = {
    success: true;
    guild: HypixelGuild;
} | HypixelAPIErrorDef
