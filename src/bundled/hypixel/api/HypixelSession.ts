import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelEntity} from "./resources/HypixelEntity.ts";

export class HypixelSession extends HypixelEntity {
    online?: boolean;
    gameType?: string;
    mode?: string;
    map?: string;
    [undocumentedProperties: string]: any

    public constructor(root: HypixelAPI, input: HypixelAPIValue<HypixelSession>) {
        super(root);
        Object.assign(this, input); // Copy undocumented and non-required properties
    }
}

export type HypixelStatusResponse = HypixelAPIResponse<{
    uuid: string;
    session: HypixelSession;
}>;
