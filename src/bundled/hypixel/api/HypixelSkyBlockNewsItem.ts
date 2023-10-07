import {HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";

export class HypixelSkyBlockNewsItem {
    item?: {
        material?: string
    }
    link: string
    text: string
    title: string
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelSkyBlockNewsItem>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
        if(!input.link) {
            throw new HypixelParseError("SkyBlock news item must have the \"link\" property", input);
        }
        this.link = input.link;
        if(!input.text) {
            throw new HypixelParseError("SkyBlock news item must have the \"text\" property", input);
        }
        this.text = input.text;
        if(!input.title) {
            throw new HypixelParseError("SkyBlock news item must have the \"title\" property", input);
        }
        this.title = input.title;
    }
}

export type HypixelSkyBlockNewsResponse = HypixelAPIResponse<{
    items: HypixelSkyBlockNewsItem[]
}>;
