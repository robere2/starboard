import {HypixelAPIErrorDef} from "./HypixelAPI.ts";

export class HypixelStatus {
    online: boolean;
    gameType: string;
    mode: string;
    map: string;
    [undocumentedProperties: string]: any

    public constructor(data: HypixelStatus) {
        this.online = data.online;
        this.gameType = data.gameType;
        this.mode = data.mode;
        this.map = data.map;
        Object.assign(this, data); // Copy all undocumented properties
    }
}

export type HypixelStatusResponse = {
    success: true;
    uuid: string;
    session: HypixelStatus;
} | HypixelAPIErrorDef
