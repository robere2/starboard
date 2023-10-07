import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelResources} from "../resources";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelSkyBlockAuction} from "./HypixelSkyBlockAuction.ts";

export class HypixelSkyBlockAuctions extends HypixelEntity {
    public readonly page: number;
    public readonly totalPages: number;
    public readonly totalAuctions: number;
    public readonly lastUpdated: number;
    public readonly auctions: HypixelSkyBlockAuction[];

    constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockAuctions>) {
        super(root, resources);
        Object.assign(this, input);

        if(input.page == null) {
            throw new HypixelParseError("SkyBlock auctions must have the \"page\" property", input);
        }
        if(input.totalPages == null) {
            throw new HypixelParseError("SkyBlock auctions must have the \"totalPages\" property", input);
        }
        if(input.totalAuctions == null) {
            throw new HypixelParseError("SkyBlock auctions must have the \"totalAuctions\" property", input);
        }
        if(input.lastUpdated == null) {
            throw new HypixelParseError("SkyBlock auctions must have the \"lastUpdated\" property", input);
        }
        if(input.auctions == null) {
            throw new HypixelParseError("SkyBlock auctions must have the \"auctions\" property", input);
        }
        this.page = input.page;
        this.totalPages = input.totalPages;
        this.totalAuctions = input.totalAuctions;
        this.lastUpdated = input.lastUpdated;
        this.auctions = [];
        for(const auction of input.auctions ?? []) {
            if (!auction) {
                continue;
            }
            this.auctions.push(new HypixelSkyBlockAuction(root, resources, auction));
        }

    }
}

export type HypixelSkyBlockAuctionsResponse = HypixelAPIResponse<HypixelSkyBlockAuctions>;
