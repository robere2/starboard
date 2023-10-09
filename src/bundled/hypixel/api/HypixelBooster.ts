import {HypixelEntity} from "./HypixelEntity.ts";
import {HypixelResources} from "./resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "./HypixelAPI.ts";
import {HypixelParseError} from "./HypixelParseError.ts";

export class HypixelBooster extends HypixelEntity {
    _id: string;
    purchaserUuid?: string;
    amount?: number;
    originalLength?: number;
    length?: number;
    gameType?: number;
    dateActivated?: number;
    stacked?: string[];

    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelBooster>) {
        super(root, resources);
        Object.assign(this, input);

        if(!input._id) {
            throw new HypixelParseError("Property \"_id\" is required by HypixelBooster", input);
        }
        this._id = input._id;
    }
}
export type HypixelBoostersResponse = HypixelAPIResponse<{
    boosters: HypixelBooster[];
    boosterState: {
        decrementing: boolean
    }
}>
