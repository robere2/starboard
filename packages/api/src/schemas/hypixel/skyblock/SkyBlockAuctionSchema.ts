import * as z from "zod";
import {UUID_REGEX} from "../../../util";
import {HypixelBaseSchema} from "../HypixelBaseSchema";
import {ZodUnixDate} from "../../ZodUnixDate";

export type SkyBlockEndedAuctionsSchema = ReturnType<typeof generateSkyBlockEndedAuctionsSchema>;
export type SkyBlockAuctionsSchema = ReturnType<typeof generateSkyBlockAuctionsSchema>;
export type SkyBlockAuctionSchema = ReturnType<typeof generateSkyBlockAuctionSchema>;
export type HypixelSkyBlockAuctions = Exclude<z.infer<SkyBlockAuctionsSchema>, undefined | null>;
export type HypixelSkyBlockAuction = Exclude<z.infer<SkyBlockAuctionSchema>["auctions"], undefined | null>[number];
export type HypixelSkyBlockEndedAuction = Exclude<z.infer<SkyBlockEndedAuctionsSchema>["auctions"], undefined | null>[number];

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
    bids: z.array(z.object({
        auction_id: z.string().regex(UUID_REGEX),
        bidder: z.string().regex(UUID_REGEX),
        profile_id: z.string().regex(UUID_REGEX),
        amount: z.number().nonnegative().nullish(),
        timestamp: ZodUnixDate.readonly()
    }).readonly()).default([]).readonly()
})

export function generateSkyBlockAuctionsSchema() {

    return HypixelBaseSchema.extend({
        page: z.number().nonnegative(),
        totalPages: z.number().nonnegative(),
        totalAuctions: z.number().nonnegative(),
        lastUpdated: ZodUnixDate.nullish().readonly(),
        auctions: z.array(baseAuctionSchema).default([]).readonly()
    })
}

export function generateSkyBlockEndedAuctionsSchema() {
    return HypixelBaseSchema.extend({
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
            })
        ).default([])
    })
}

export function generateSkyBlockAuctionSchema() {
    return HypixelBaseSchema.extend({
        auctions: z.array(baseAuctionSchema).default([])
    })
}
