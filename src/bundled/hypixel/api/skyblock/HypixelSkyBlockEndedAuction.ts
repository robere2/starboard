import {HypixelEntity} from "../HypixelEntity.ts";
import {HypixelResources} from "../resources";
import {HypixelAPI, HypixelAPIResponse, HypixelAPIValue} from "../HypixelAPI.ts";
import {HypixelParseError} from "../HypixelParseError.ts";
import {HypixelPlayer} from "../HypixelPlayer.ts";
import {HypixelSkyBlockProfile} from "./HypixelSkyBlockProfile.ts";
import {HypixelSkyBlockAuction} from "./HypixelSkyBlockAuction.ts";

export class HypixelSkyBlockEndedAuction extends HypixelEntity {

    public readonly auction_id: string;
    public readonly seller: string;
    public readonly seller_profile: string;
    public readonly buyer: string;
    public readonly timestamp: number;
    public readonly price: number;
    public readonly bin?: boolean;
    public readonly item_bytes?: string;
    [undocumentedProperties: string]: any;

    public constructor(root: HypixelAPI, resources: HypixelResources, input: HypixelAPIValue<HypixelSkyBlockEndedAuction>) {
        super(root, resources);
        Object.assign(this, input);

        if(input.auction_id == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"auction_id\" property", input);
        }
        this.auction_id = input.auction_id;
        if(input.seller == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"sller\" property", input);
        }
        this.seller = input.seller;
        if(input.seller_profile == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"seller_profile\" property", input);
        }
        this.seller_profile = input.seller_profile;
        if(input.buyer == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"buyer\" property", input);
        }
        this.buyer = input.buyer;
        if(input.timestamp == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"timestamp\" property", input);
        }
        this.timestamp = input.timestamp;
        if(input.price == null) {
            throw new HypixelParseError("SkyBlock auction must have the \"price\" property", input);
        }
        this.price = input.price;
    }

    public async getAuction(): Promise<HypixelSkyBlockAuction | null> {
        return this.getRoot().getSkyBlockAuctionById(this.auction_id);
    }

    public async getSeller(): Promise<HypixelPlayer | null> {
        return this.getRoot().getPlayer(this.seller);
    }

    public async getSellerProfile(): Promise<HypixelSkyBlockProfile | null> {
        return this.getRoot().getSkyBlockProfile(this.seller_profile);
    }

    public async getBuyer(): Promise<HypixelPlayer | null> {
        return this.getRoot().getPlayer(this.buyer);
    }
}

export type HypixelSkyBlockEndedAuctionsResponse = HypixelAPIResponse<{
    auctions: HypixelSkyBlockEndedAuction[]
}>;
