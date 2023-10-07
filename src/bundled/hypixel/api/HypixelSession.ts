import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelEntity} from "./HypixelEntity.ts";
import { HypixelResources } from "./resources";

export class HypixelSession extends HypixelEntity {
    online?: boolean;
    gameType?: string;
    mode?: string;
    map?: string;
    [undocumentedProperties: string]: any

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSession>) {
        super(root, resources);
        Object.assign(this, input); // Copy undocumented and non-required properties
    }
}

export type HypixelStatusResponse = HypixelAPIResponse<{
    uuid: string;
    session: HypixelSession;
}>;
