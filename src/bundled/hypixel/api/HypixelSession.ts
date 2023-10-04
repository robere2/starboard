import {HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";

export class HypixelSession {
    online?: boolean;
    gameType?: string;
    mode?: string;
    map?: string;
    [undocumentedProperties: string]: any

    public constructor(input: HypixelAPIValue<HypixelSession>) {
        Object.assign(this, input); // Copy undocumented and non-required properties
    }
}

export type HypixelStatusResponse = HypixelAPIResponse<{
    uuid: string;
    session: HypixelSession;
}>;
