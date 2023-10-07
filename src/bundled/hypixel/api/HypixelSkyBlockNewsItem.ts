import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";
import {HypixelEntity} from "./HypixelEntity.ts";
import { HypixelResources } from "./resources";

export class HypixelSkyBlockNewsItem extends HypixelEntity {
    item?: {
        material?: string
    }
    link: string
    text: string
    title: string
    [undocumentedProperties: string]: any

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockNewsItem>) {
        super(root, resources);
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
