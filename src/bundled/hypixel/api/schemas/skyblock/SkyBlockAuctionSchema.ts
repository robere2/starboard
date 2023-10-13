import type {HypixelAPI} from "../../HypixelAPI.ts";
import z from "zod";
import {UUID_REGEX} from "../../../../../util.ts";
import {HypixelEntity} from "../../HypixelEntity.ts";
import {BaseSchema} from "../BaseSchema.ts";
import {ZodUnixDate} from "../ZodUnixDate.ts";
import {HypixelPlayer} from "../PlayerSchema.ts";
import {HypixelSkyBlockProfile} from "./SkyBlockProfileSchema.ts";

export type SkyBlockEndedAuctionsSchema = ReturnType<typeof generateSkyBlockEndedAuctionsSchema>;
export type SkyBlockAuctionsSchema = ReturnType<typeof generateSkyBlockAuctionsSchema>;
export type SkyBlockAuctionSchema = ReturnType<typeof generateSkyBlockAuctionSchema>;
export type HypixelSkyBlockAuctions = Exclude<z.infer<SkyBlockAuctionsSchema>, undefined | null>;
export type HypixelSkyBlockAuction = Exclude<z.infer<SkyBlockAuctionSchema>["auctions"], undefined | null>[number];
export type HypixelSkyBlockEndedAuction = Exclude<z.infer<SkyBlockEndedAuctionsSchema>["auctions"], undefined | null>[number];

const baseBidSchema = z.object({
    auction_id: z.string().regex(UUID_REGEX),
    bidder: z.string().regex(UUID_REGEX),
    profile_id: z.string().regex(UUID_REGEX),
    amount: z.number().nonnegative().nullish(),
    timestamp: ZodUnixDate.readonly()
});
const baseAuctionSchema = z.object({
    uuid: z.string().regex(UUID_REGEX),
    auctioneer: z.string().regex(UUID_REGEX),
    profile_id: z.string().regex(UUID_REGEX),
    coop: z.array(z.string()).default([]).readonly(), // TODO is this player UUIDs? profiles?
    start: ZodUnixDate.readonly(),
    end: ZodUnixDate.readonly(),
    item_name: z.string(),
    item_lore: z.string().nullish(),
    extra: z.string().nullish(),
    category: z.string().nullish(),
    tier: z.string().nullish(),
    starting_bid: z.number().nonnegative().nullish(),
    item_bytes: z.string().nullish(), // TODO decoder
    claimed: z.boolean().nullish(),
    claimed_bidders: z.array(z.string().regex(UUID_REGEX)).default([]).readonly(), // TODO is this player UUIDs? profiles?
    highest_bid_amount: z.number().nonnegative().nullish(),
    last_updated: ZodUnixDate.readonly(),
    bin: z.boolean().nullish(),
    item_uuid: z.string().nullish(),
})

function getFullBidSchema(api: HypixelAPI) {
    const bidSchema: z.ZodType<
        z.infer<typeof baseBidSchema> &
        HypixelEntity &
        {
            getAuction(): Promise<HypixelSkyBlockAuction | null>,
            getBidder(): Promise<HypixelPlayer | null>,
            getBidderProfile(): Promise<HypixelSkyBlockProfile | null>
        }
    > = baseBidSchema.transform((bid) => {
        return Object.assign(new HypixelEntity(api), {
            ...bid,

            /**
             *
             */
            async getAuction(this: HypixelEntity & typeof bid): Promise<HypixelSkyBlockAuction[] | null> {
                return await api.getSkyBlockAuctionById(this.auction_id)
            },

            /**
             *
             */
            async getBidder(this: HypixelEntity & typeof bid): Promise<HypixelPlayer | null> {
                return await api.getPlayer(this.bidder);
            },

            /**
             *
             */
            async getBidderProfile(this: HypixelEntity & typeof bid): Promise<HypixelSkyBlockProfile | null> {
                return await api.getSkyBlockProfile(this.profile_id)
            }
        })
    }) as any; // Not sure why cast is necessary

    return bidSchema;
}

function getFullAuctionSchema(api: HypixelAPI) {
    const auctionSchema: z.ZodType<
        z.infer<typeof baseAuctionSchema> &
        HypixelEntity &
        {
            getAuctioneer(): Promise<HypixelPlayer | null>,
            getAuctioneerProfile(): Promise<HypixelSkyBlockProfile | null>,
            coopMembersIterator(): AsyncGenerator<HypixelPlayer | null>,
            claimedBiddersIterator(): AsyncGenerator<HypixelPlayer | null>
        }
    > = baseAuctionSchema.extend({
        bids: z.array(getFullBidSchema(api).readonly()).default([]).readonly(),
    }).readonly().transform((auction) => {
        return Object.assign(new HypixelEntity(api), {
            ...auction,

            /**
             *
             */
            async getAuctioneer(this: HypixelEntity & typeof auction): Promise<HypixelPlayer | null> {
                return await api.getPlayer(this.auctioneer);
            },

            /**
             *
             */
            async getAuctioneerProfile(this: HypixelEntity & typeof auction): Promise<HypixelSkyBlockProfile | null> {
                return await api.getSkyBlockProfile(this.profile_id)
            },

            /**
             *
             */
            async *coopMembersIterator(this: HypixelEntity & typeof auction): AsyncIterableIterator<HypixelPlayer | null> {
                for(const uuid of this.coop ?? []) {
                    yield await api.getPlayer(uuid)
                }
            },

            /**
             *
             */
            async *claimedBiddersIterator(this: HypixelEntity & typeof auction): AsyncIterableIterator<HypixelPlayer | null> {
                for(const uuid of this.claimed_bidders ?? []) {
                    yield await api.getPlayer(uuid)
                }
            },

            // /**
            //  * TODO
            //  */
            // decodeItem(): unknown {}

        })
    }) as any;

    return auctionSchema;
}

export function generateSkyBlockAuctionsSchema(api: HypixelAPI) {
    const auctionSchema = getFullAuctionSchema(api);

    return BaseSchema.extend({
        page: z.number().nonnegative(),
        totalPages: z.number().nonnegative(),
        totalAuctions: z.number().nonnegative(),
        lastUpdated: ZodUnixDate.nullish().readonly(),
        auctions: z.array(auctionSchema).default([]).readonly()
    })
}

export function generateSkyBlockEndedAuctionsSchema(api: HypixelAPI) {
    return BaseSchema.extend({
        lastUpdated: ZodUnixDate.readonly(),
        auctions: z.array(
            z.object({
                auction_id: z.string(),
                seller: z.string().regex(UUID_REGEX),
                seller_profile: z.string().regex(UUID_REGEX),
                buyer: z.string().regex(UUID_REGEX),
                timestamp: ZodUnixDate,
                price: z.number(),
                bin: z.boolean().optional(),
                item_bytes: z.string().optional()
            }).transform((bid) => {
                return Object.assign(new HypixelEntity(api), {
                    ...bid,

                    /**
                     *
                     */
                    async getAuction(this: HypixelEntity & typeof bid): Promise<HypixelSkyBlockAuction[] | null> {
                        return await api.getSkyBlockAuctionById(this.auction_id)
                    },

                    /**
                     *
                     */
                    async getSeller(this: HypixelEntity & typeof bid): Promise<HypixelPlayer | null> {
                        return await api.getPlayer(this.seller);
                    },

                    /**
                     *
                     */
                    async getSellerProfile(this: HypixelEntity & typeof bid): Promise<HypixelSkyBlockProfile | null> {
                        return await api.getSkyBlockProfile(this.seller_profile)
                    },

                    /**
                     *
                     */
                    async getBuyer(this: HypixelEntity & typeof bid): Promise<HypixelPlayer | null> {
                        return this.buyer ? await api.getPlayer(this.buyer) : null;
                    }
                })
            })
        ).default([])
    })
}

export function generateSkyBlockAuctionSchema(api: HypixelAPI) {
    const auctionSchema = getFullAuctionSchema(api);
    return BaseSchema.extend({
        auctions: z.array(auctionSchema).default([])
    })
}
