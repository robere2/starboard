import {HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";

export class HypixelParseError extends Error {
    constructor(message: string, response: HypixelAPIResponse<unknown> | HypixelAPIValue<unknown>) {
        super(`Unexpected response from Hypixel API: ${message}\n\nResponse:\n${JSON.stringify(response, null, 2)}\n`);
    }
}
