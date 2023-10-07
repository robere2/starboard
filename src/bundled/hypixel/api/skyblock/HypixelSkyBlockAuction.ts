import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelPlayer} from "../HypixelPlayer.ts";
import {HypixelSkyBlockProfile} from "./HypixelSkyBlockProfile.ts";

export class HypixelSkyBlockAuctionBid extends HypixelEntity {
    public readonly auction_id: string;
    public readonly bidder: string;
    public readonly profile_id: string;
    public readonly amount: number;
    public readonly timestamp: number;
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockAuctionBid>) {
        super(root, resources);
        Object.assign(this, input);

        if(input.amount == null) {
            throw new HypixelParseError("SkyBlock auction bid must have the \"amount\" property", input);
        }
        if(input.timestamp == null) {
            throw new HypixelParseError("SkyBlock auction bid must have the \"timestamp\" property", input);
        }
        if(input.bidder == null) {
            throw new HypixelParseError("SkyBlock auction bid must have the \"bidder\" property", input);
        }
        if(input.auction_id == null) {
            throw new HypixelParseError("SkyBlock auction bid must have the \"auction_id\" property", input);
        }
        if(input.profile_id == null) {
            throw new HypixelParseError("SkyBlock auction bid must have the \"profile_id\" property", input);
        }
        this.auction_id = input.auction_id;
        this.bidder = input.bidder;
        this.profile_id = input.profile_id;
        this.amount = input.amount;
        this.timestamp = input.timestamp;
    }

    public async getAuction(): Promise<HypixelSkyBlockAuction | null> {
        return this.getRoot().getSkyBlockAuctionById(this.auction_id);
    }

    public async getBidder(): Promise<HypixelPlayer | null> {
        return this.getRoot().getPlayer(this.bidder);
    }

    public async getBidderProfile(): Promise<HypixelSkyBlockProfile | null> {
        return this.getRoot().getSkyBlockProfile(this.profile_id)
    }
}

export class HypixelSkyBlockAuction extends HypixelEntity {

    public readonly uuid: string;
    public readonly auctioneer: string;
    public readonly profile_id: string;
    public readonly coop?: string[];
    public readonly start: number;
    public readonly end: number;
    public readonly item_name: string;
    public readonly item_lore?: string;
    public readonly extra?: string;
    public readonly category?: string;
    public readonly tier?: string;
    public readonly starting_bid?: number;
    public readonly item_bytes?: string;
    public readonly claimed?: boolean;
    public readonly claimed_bidders?: string[];
    public readonly highest_bid_amount?: number;
    public readonly last_updated?: number;
    public readonly bin?: boolean;
    public readonly bids?: HypixelSkyBlockAuctionBid[];
    public readonly item_uuid?: string;
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockAuction>) {
        super(root, resources);
        Object.assign(this, input);

        if(input.uuid == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"uuid\" property", input);
        }
        this.uuid = input.uuid;
        if(input.auctioneer == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"auctioneer\" property", input);
        }
        this.auctioneer = input.auctioneer;
        if(input.profile_id == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"profile_id\" property", input);
        }
        this.profile_id = input.profile_id;
        if(input.start == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"start\" property", input);
        }
        this.start = input.start;
        if(input.end == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"end\" property", input);
        }
        this.end = input.end;
        if(input.item_name == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"item_name\" property", input);
        }
        this.item_name = input.item_name;

        this.bids = [];
        for(const bid of input.bids ?? []) {
            if(!bid) {
                continue;
            }
            this.bids.push(new HypixelSkyBlockAuctionBid(root, resources, bid))
        }
    }
}

export type HypixelSkyBlockAuctionResponse = HypixelAPIResponse<{
    auctions: HypixelSkyBlockAuction[]
}>;
