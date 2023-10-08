import {HypixelPlayer, HypixelPlayerResponse} from "./HypixelPlayer.ts";
import {MojangAPI} from "../../MojangAPI.ts";
import {ParsedOptions, UUID_REGEX} from "../../../util.ts";
import {APIOptions, BaseAPI} from "../../BaseAPI.ts";
import {HypixelRecentGame, HypixelRecentGamesResponse} from "./HypixelRecentGame.ts";
import {HypixelSession, HypixelStatusResponse} from "./HypixelSession.ts";
import {HypixelGuild, HypixelGuildResponse} from "./HypixelGuild.ts";
import {HypixelResources} from "./resources";
import {HypixelSkyBlockNewsItem, HypixelSkyBlockNewsResponse} from "./skyblock";
import crypto from "crypto";
import {HypixelEntity} from "./HypixelEntity.ts";
import {
    HypixelSkyBlockAuction, HypixelSkyBlockAuctionResponse,
} from "./skyblock/HypixelSkyBlockAuction.ts";
import {HypixelSkyBlockAuctions, HypixelSkyBlockAuctionsResponse} from "./skyblock/HypixelSkyBlockAuctions.ts";
import {
    HypixelSkyBlockProfile,
    HypixelSkyBlockProfileResponse,
    HypixelSkyBlockProfilesResponse
} from "./skyblock/HypixelSkyBlockProfile.ts";
import {
    HypixelSkyBlockEndedAuction,
    HypixelSkyBlockEndedAuctionsResponse
} from "./skyblock/HypixelSkyBlockEndedAuction.ts";
import {HypixelSkyBlockBazaarProduct, HypixelSkyBlockBazaarResponse} from "./skyblock/HypixelSkyBlockBazaarProduct.ts";
import {HypixelSkyBlockMuseumResponse, HypixelSkyBlockProfileMuseum} from "./skyblock/HypixelSkyBlockProfileMuseum.ts";
import {
    HypixelSkyBlockBingoProfile,
    HypixelSkyBlockBingoProfilesResponse
} from "./skyblock/HypixelSkyBlockBingoProfile.ts";
import {HypixelSkyBlockFiresale, HypixelSkyBlockFiresalesResponse} from "./skyblock/HypixelSkyBlockFiresale.ts";
import {HypixelBooster, HypixelBoostersResponse} from "./HypixelBooster.ts";
import {HypixelCountsResponse, HypixelPlayerCount} from "./HypixelPlayerCount.ts";
import {HypixelPunishmentStatistics, HypixelPunishmentStatisticsResponse} from "./HypixelPunishmentStatistics.ts";
import {HypixelLeaderboards, HypixelLeaderboardsResponse} from "./HypixelLeaderboards.ts";
import {HypixelParseError} from "./HypixelParseError.ts";


const HYPIXEL_API_URL = "https://api.hypixel.net";
const MONGODB_ID_REGEX = /^[0-9a-f]{24}$/i;

export type HypixelAPIOptions = APIOptions & {
    /**
     * API key to use in requests to the Hypixel API. Should be a valid UUID with or without dashes retrieved from
     *   https://developer.hypixel.net/dashboard. An invalid UUID will result in 403 error responses from the API.
     */
    apiKey: string;
}

export type HypixelAPIErrorDef = {
    success: false,
    cause: string,
    throttle?: boolean,
    global?: boolean
}

export type HypixelAPIValue<T> = T extends object ? {
    readonly [P in keyof T]?: HypixelAPIValue<T[P]>;
} : T | undefined

export type HypixelAPIResponse<T> = ({ success: true; } | HypixelAPIErrorDef) & HypixelAPIValue<T>;

/**
 * Interface for requesting data from the Hypixel API. Caching is not built-in.
 */
export class HypixelAPI extends BaseAPI<HypixelAPIOptions> {

    // Resources get their own ID so children entities can reference them later without having to store them as a
    //   property. This prevents circular references, allowing you to log/serialize child values.
    public readonly id: string = crypto.randomUUID();
    private resources?: HypixelResources;
    private resourcesPromise: Promise<HypixelResources> | null;
    private readonly mojangApi: MojangAPI;

    /**
     * Construct an interface to connect to the Hypixel API with your preferred settings
     * @param options Options to use in Hypixel API requests. An API key is required, but all other options are
     *   optional.
     */
    public constructor(options: HypixelAPIOptions) {
        super(options);
        this.mojangApi = new MojangAPI(options)
        this.resourcesPromise = HypixelResources.create(this, this.options).then((resources) => {
            this.resourcesPromise = null;
            return this.resources = resources
        })
        HypixelEntity.registerAPI(this);
    }

    public async getResources(): Promise<HypixelResources> {
        if(this.resourcesPromise) {
            return this.resourcesPromise;
        }
        // Resources won't be null after creation promise resolves. resourcesPromise is set to null after it's resolved.
        return this.resources as HypixelResources;
    }

    /**
     * Retrieve data of a specific player, including game stats. If the player is not found, null is returned. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param name The username of the player. If the username is not found, null is returned.
     * @param direct Whether to directly fetch the data from the Hypixel API without converting the username into
     *   a UUID first (default: false). This is a feature of the Hypixel API that is deprecated and no longer
     *   recommended due to the ability to change Minecraft usernames. The "name" property is based on the last name
     *   that a player connected to the Hypixel Network with. If the player "Steve" changes their name to "NotSteve",
     *   the name lookup for "NotSteve" will not Steve's data until Steve reconnects. Further, if another player
     *   previously had the username "NotSteve" but also has not connected to Hypixel since changing their name, then
     *   their data may be returned instead. If this is not what you want, set this option to false and their username
     *   will be converted to a UUID via {@link MojangAPI|The Mojang API}. Looking up data for a username directly is
     *   heavily rate limited per player. Attempts to call this method more than once per name approximately every five
     *   minutes will result in a 429 response.
     * @param raw Whether to return the raw {@link HypixelPlayerResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(name: string, direct?: boolean, raw?: false): Promise<HypixelPlayer | null>;
    /**
     * Retrieve data of a specific player, including game stats. If the player is not found, null is returned. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param uuid The UUID of the player. If the UUID is not found, null is returned.
     * @param raw Whether to return the raw {@link HypixelPlayerResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(uuid: string, raw?: false): Promise<HypixelPlayer | null>;
    /**
     * Retrieve up-to-date data of a specific player, including game stats. If the player is not found, null is
     *   returned, however this should never happen unless you constructed the HypixelPlayer object yourself. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param player HypixelPlayer instance with the UUID of the player you're looking for data for.
     * @param raw Whether to return the raw {@link HypixelPlayerResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(player: HypixelPlayer, raw?: false): Promise<HypixelPlayer | null>;
    /**
     * Retrieve data of a specific player, including game stats. If the player is not found, null is returned. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param name The username of the player. If the username is not found, null is returned.
     * @param direct Whether to directly fetch the data from the Hypixel API without converting the username into
     *   a UUID first (default: false). This is a feature of the Hypixel API that is deprecated and no longer
     *   recommended due to the ability to change Minecraft usernames. The "name" property is based on the last name
     *   that a player connected to the Hypixel Network with. If the player "Steve" changes their name to "NotSteve",
     *   the name lookup for "NotSteve" will not Steve's data until Steve reconnects. Further, if another player
     *   previously had the username "NotSteve" but also has not connected to Hypixel since changing their name, then
     *   their data may be returned instead. If this is not what you want, set this option to false and their username
     *   will be converted to a UUID via {@link MojangAPI|The Mojang API}. Looking up data for a username directly is
     *   heavily rate limited per player. Attempts to call this method more than once per name approximately every five
     *   minutes will result in a 429 response.
     * @param raw Whether to return the raw {@link HypixelPlayerResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(name: string, direct?: boolean, raw?: true): Promise<HypixelPlayerResponse>;
    /**
     * Retrieve data of a specific player, including game stats. If the player is not found, null is returned. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param uuid The UUID of the player. If the UUID is not found, null is returned.
     * @param raw Whether to return the raw {@link HypixelPlayerResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(uuid: string, raw?: true): Promise<HypixelPlayerResponse>;
    /**
     * Retrieve up-to-date data of a specific player, including game stats. If the player is not found, null is
     *   returned, however this should never happen unless you constructed the HypixelPlayer object yourself. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param player HypixelPlayer instance with the UUID of the player you're looking for data for.
     * @param raw Whether to return the raw {@link HypixelPlayerResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(player: HypixelPlayer, raw?: true): Promise<HypixelPlayerResponse>;
    public async getPlayer(player: string | HypixelPlayer, direct = false, raw = false): Promise<HypixelPlayer | HypixelPlayerResponse | null> {
        // Hypixel API request is generated based on the two provided inputs
        let hypixelRequest: Request;
        if(player instanceof HypixelPlayer || UUID_REGEX.test(player)) {
            const uuid = player instanceof HypixelPlayer ? player.uuid : player;
            hypixelRequest = new Request(`${HYPIXEL_API_URL}/player?uuid=${uuid}`, {
                headers: this.genHeaders()
            });
        } else {
            const name = player; // Rename variable to make code clearer
            if(!direct) {
                const uuid = await this.mojangApi.getUuid(name);
                if(uuid === null) {
                    return null;
                } else {
                    return this.getPlayer(uuid);
                }
            }

            // Direct is true, so we should fetch from the Hypixel API directly via the "name" parameter.
            hypixelRequest = new Request(`${HYPIXEL_API_URL}/player?name=${name}`, {
                headers: this.genHeaders()
            });
        }

        // Request is sent to the Hypixel API
        const res = await this.options.httpClient.fetch(hypixelRequest);
        const json: HypixelPlayerResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            return json.player ? new HypixelPlayer(this, await this.getResources(), json.player) : null;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            })
        }
    }

    public async getRecentGames(uuid: string, raw?: false): Promise<HypixelRecentGame[]>;
    public async getRecentGames(player: HypixelPlayer, raw?: false): Promise<HypixelRecentGame[]>;
    public async getRecentGames(uuid: string, raw?: true): Promise<HypixelRecentGamesResponse>;
    public async getRecentGames(player: HypixelPlayer, raw?: true): Promise<HypixelRecentGamesResponse>;
    public async getRecentGames(player: string | HypixelPlayer, raw = false): Promise<HypixelRecentGame[] | HypixelRecentGamesResponse> {
        const uuid = player instanceof HypixelPlayer ? player.uuid : player;
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/recentgames?uuid=${uuid}`, {
            headers: this.genHeaders()
        })
        const json: HypixelRecentGamesResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.games) {
                return [];
            }


            const games: HypixelSkyBlockNewsItem[] = [];
            for(const game of json.games) {
                if(!game) {
                    continue;
                }
                games.push(new HypixelSkyBlockNewsItem(this, await this.getResources(), game));
            }
            return games;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            })
        }
    }

    public async getStatus(uuid: string, raw?: false): Promise<HypixelSession | null>;
    public async getStatus(player: HypixelPlayer, raw?: false): Promise<HypixelSession | null>;
    public async getStatus(uuid: string, raw?: true): Promise<HypixelStatusResponse>;
    public async getStatus(player: HypixelPlayer, raw?: true): Promise<HypixelStatusResponse>;
    public async getStatus(player: string | HypixelPlayer, raw = false): Promise<HypixelSession | HypixelStatusResponse | null> {
        const uuid = player instanceof HypixelPlayer ? player.uuid : player;
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/status?uuid=${uuid}`, {
            headers: this.genHeaders()
        })
        const json: HypixelStatusResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            return json.session ? new HypixelSession(this, await this.getResources(), json.session) : null;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            })
        }
    }

    public async getGuild(id: string, raw?: false): Promise<HypixelGuild | null>;
    public async getGuild(name: string, raw?: false): Promise<HypixelGuild | null>;
    public async getGuild(player: HypixelPlayer, raw?: false): Promise<HypixelGuild | null>;
    public async getGuild(playerUuid: string, raw?: false): Promise<HypixelGuild | null>;
    public async getGuild(id: string, raw?: true): Promise<HypixelGuildResponse>;
    public async getGuild(name: string, raw?: true): Promise<HypixelGuildResponse>;
    public async getGuild(player: HypixelPlayer, raw?: true): Promise<HypixelGuildResponse>;
    public async getGuild(playerUuid: string, raw?: true): Promise<HypixelGuildResponse>;
    public async getGuild(input: string | HypixelPlayer, raw = false): Promise<HypixelGuild | HypixelGuildResponse | null> {
        // Guilds can be searched by ID, name, or member UUID. All three of these are strings, but we can pretty safely
        //   (although not definitively) assume which format is being used based on the contents of the string.
        let paramType: "id" | "name" | "player";
        if(input instanceof HypixelPlayer || UUID_REGEX.test(input)) {
            paramType = "player";
            input = input instanceof HypixelPlayer ? input.uuid : input;
        } else if(MONGODB_ID_REGEX.test(input)) {
            paramType = "id";
        } else {
            paramType = "name";
        }


        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/guild?${paramType}=${input}`, {
            headers: this.genHeaders()
        })
        const json: HypixelGuildResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            return json.guild ? new HypixelGuild(this, await this.getResources(), json.guild) : null;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            })
        }
    }

    public async getSkyBlockNews(raw?: false): Promise<HypixelSkyBlockNewsItem[] >;
    public async getSkyBlockNews(raw?: true): Promise<HypixelSkyBlockNewsResponse>;
    public async getSkyBlockNews(raw = false): Promise<HypixelSkyBlockNewsItem[] | HypixelSkyBlockNewsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/news`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockNewsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.items) {
                return [];
            }

            const items: HypixelSkyBlockNewsItem[] = [];
            for(const item of json.items) {
                if(!item) {
                    continue;
                }
                items.push(new HypixelSkyBlockNewsItem(this, await this.getResources(), item));
            }
            return items;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockAuctions(page?: number, raw?: false): Promise<HypixelSkyBlockAuctions>;
    public async getSkyBlockAuctions(page?: number, raw?: true): Promise<HypixelSkyBlockAuctionsResponse>;
    public async getSkyBlockAuctions(page?: number, raw = false): Promise<HypixelSkyBlockAuctions | HypixelSkyBlockAuctionsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/auctions?page=${page ?? 0}`);
        const json: HypixelSkyBlockAuctionsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            return new HypixelSkyBlockAuctions(this, await this.getResources(), {
                page: json.page,
                totalPages: json.totalPages,
                totalAuctions: json.totalAuctions,
                lastUpdated: json.lastUpdated,
                auctions: json.auctions
            })
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockAuctionById(id: string, raw?: false): Promise<HypixelSkyBlockAuction | null>;
    public async getSkyBlockAuctionById(id: string, raw?: true): Promise<HypixelSkyBlockAuctionResponse>;
    public async getSkyBlockAuctionById(id: string, raw = false): Promise<HypixelSkyBlockAuction | null | HypixelSkyBlockAuctionResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/auctions?uuid=${id}`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockAuctionResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            const firstAuction = json.auctions?.[0] ?? null;
            if(!firstAuction) {
                return null;
            }
            return new HypixelSkyBlockAuction(this, await this.getResources(), firstAuction)
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockAuctionsByPlayer(playerUuid: string, raw?: false): Promise<HypixelSkyBlockAuction[]>;
    public async getSkyBlockAuctionsByPlayer(playerUuid: string, raw?: true): Promise<HypixelSkyBlockAuctionResponse>;
    public async getSkyBlockAuctionsByPlayer(playerUuid: string, raw = false): Promise<HypixelSkyBlockAuction[] | HypixelSkyBlockAuctionResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/auctions?player=${playerUuid}`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockAuctionResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            const auctions: HypixelSkyBlockAuction[] = [];
            for(const auction of json.auctions ?? []) {
                if(!auction) {
                    continue;
                }
                auctions.push(new HypixelSkyBlockAuction(this, await this.getResources(), auction));
            }
            return auctions;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockAuctionsByProfile(profileId: string, raw?: false): Promise<HypixelSkyBlockAuction[]>;
    public async getSkyBlockAuctionsByProfile(profileId: string, raw?: true): Promise<HypixelSkyBlockAuctionResponse>;
    public async getSkyBlockAuctionsByProfile(profileId: string, raw = false): Promise<HypixelSkyBlockAuction[] | HypixelSkyBlockAuctionResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/auctions?profile=${profileId}`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockAuctionResponse = await res.json();

        if (raw) {
            return json;
        }

        if (json.success) {
            const auctions: HypixelSkyBlockAuction[] = [];
            for (const auction of json.auctions ?? []) {
                if (!auction) {
                    continue;
                }
                auctions.push(new HypixelSkyBlockAuction(this, await this.getResources(), auction));
            }
            return auctions;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockEndedAuctions(raw?: false): Promise<HypixelSkyBlockEndedAuction[]>;
    public async getSkyBlockEndedAuctions(raw?: true): Promise<HypixelSkyBlockAuctionResponse>;
    public async getSkyBlockEndedAuctions(raw = false): Promise<HypixelSkyBlockEndedAuction[] | HypixelSkyBlockAuctionResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/auctions_ended`);
        const json: HypixelSkyBlockEndedAuctionsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            const auctions: HypixelSkyBlockEndedAuction[] = [];
            for(const auction of json.auctions ?? []) {
                if(!auction) {
                    continue;
                }
                auctions.push(new HypixelSkyBlockEndedAuction(this, await this.getResources(), auction));
            }
            return auctions;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockBazaarProducts(raw?: false): Promise<Record<string, HypixelSkyBlockBazaarProduct>>;
    public async getSkyBlockBazaarProducts(raw?: true): Promise<HypixelSkyBlockBazaarResponse>;
    public async getSkyBlockBazaarProducts(raw = false): Promise<Record<string, HypixelSkyBlockBazaarProduct> | HypixelSkyBlockBazaarResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/bazaar`);
        const json: HypixelSkyBlockBazaarResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            const products: Record<string, HypixelSkyBlockBazaarProduct> = {};
            for(const product in json.products ?? {}) {
                if(!product || !json.products?.[product]) {
                    continue;
                }
                products[json.products[product]?.product_id] = new HypixelSkyBlockBazaarProduct(this, await this.getResources(), json.products[product] as HypixelSkyBlockBazaarProduct);
            }
            return products;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockProfile(profileId: string, raw?: false): Promise<HypixelSkyBlockProfile | null>;
    public async getSkyBlockProfile(profileId: string, raw?: true): Promise<HypixelSkyBlockProfileResponse>;
    public async getSkyBlockProfile(profileId: string, raw = false): Promise<HypixelSkyBlockProfile | null | HypixelSkyBlockProfileResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/profile?profile=${profileId}`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockProfileResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.profile) {
                return null;
            }

            return new HypixelSkyBlockProfile(this, await this.getResources(), json.profile);
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockProfiles(playerUuid: string, raw?: false): Promise<HypixelSkyBlockProfile[]>;
    public async getSkyBlockProfiles(playerUuid: string, raw?: true): Promise<HypixelSkyBlockProfilesResponse>;
    public async getSkyBlockProfiles(playerUuid: string, raw = false): Promise<HypixelSkyBlockProfile[] | HypixelSkyBlockProfilesResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/profiles?uuid=${playerUuid}`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockProfilesResponse = await res.json();

        if (raw) {
            return json;
        }

        if (json.success) {
            if (!json.profiles) {
                return [];
            }

            const profiles: HypixelSkyBlockProfile[] = [];
            for (const profile of json.profiles ?? []) {
                if (!profile) {
                    continue;
                }
                profiles.push(new HypixelSkyBlockProfile(this, await this.getResources(), profile));
            }
            return profiles;
        } else {
            console.error(json.cause);
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });

        }
    }

    public async getSkyBlockMuseums(profileId: string, raw?: false): Promise<Record<string, HypixelSkyBlockProfileMuseum>>;
    public async getSkyBlockMuseums(profileId: string, raw?: true): Promise<HypixelSkyBlockMuseumResponse>;
    public async getSkyBlockMuseums(profileId: string, raw = false): Promise<Record<string, HypixelSkyBlockProfileMuseum> | HypixelSkyBlockMuseumResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/museum?profile=${profileId}`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockMuseumResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            const museums: Record<string, HypixelSkyBlockProfileMuseum> = {};
            for(const member in json.members ?? {}) {
                if(!member || !json.members?.[member]) {
                    continue;
                }
                museums[member] = new HypixelSkyBlockProfileMuseum(this, await this.getResources(), json.members[member] as HypixelSkyBlockProfileMuseum);
            }
            return museums;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockBingoProfiles(playerUuid: string, raw?: false): Promise<HypixelSkyBlockBingoProfile[]>;
    public async getSkyBlockBingoProfiles(playerUuid: string, raw?: true): Promise<HypixelSkyBlockBingoProfilesResponse>;
    public async getSkyBlockBingoProfiles(playerUuid: string, raw = false): Promise<HypixelSkyBlockBingoProfile[] | HypixelSkyBlockBingoProfilesResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/bingo?uuid=${playerUuid}`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockBingoProfilesResponse = await res.json();

        if (raw) {
            return json;
        }

        if (json.success) {
            if (!json.events) {
                return [];
            }

            const profiles: HypixelSkyBlockBingoProfile[] = [];
            for (const profile of json.events ?? []) {
                if (!profile) {
                    continue;
                }
                profiles.push(new HypixelSkyBlockBingoProfile(this, await this.getResources(), profile));
            }
            return profiles;
        } else {
            console.error(json.cause);
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });

        }
    }

    public async getSkyBlockFiresales(raw?: false): Promise<HypixelSkyBlockFiresale[]>;
    public async getSkyBlockFiresales(raw?: true): Promise<HypixelSkyBlockFiresalesResponse>;
    public async getSkyBlockFiresales(raw = false): Promise<HypixelSkyBlockFiresale[] | HypixelSkyBlockFiresalesResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/skyblock/firesales`);
        const json: HypixelSkyBlockFiresalesResponse = await res.json();

        if (raw) {
            return json;
        }

        if (json.success) {
            if (!json.sales) {
                return [];
            }

            const sales: HypixelSkyBlockFiresale[] = [];
            for (const sale of json.sales ?? []) {
                if (!sale) {
                    continue;
                }
                sales.push(new HypixelSkyBlockFiresale(this, await this.getResources(), sale));
            }
            return sales;
        } else {
            console.error(json.cause);
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });

        }
    }

    public async areBoostersActive(): Promise<boolean> {
        const boostersRes = await this.getBoosters(true);
        return boostersRes.boosterState?.decrementing ?? false;
    }

    public async getBoosters(raw?: false): Promise<HypixelBooster[]>;
    public async getBoosters(raw?: true): Promise<HypixelBoostersResponse>;
    public async getBoosters(raw = false): Promise<HypixelBooster[] | HypixelBoostersResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/boosters`, {
            headers: this.genHeaders()
        });
        const json: HypixelBoostersResponse = await res.json();

        if (raw) {
            return json;
        }

        if (json.success) {
            if (!json.boosters) {
                return [];
            }

            const boosters: HypixelBooster[] = [];
            for (const booster of json.boosters ?? []) {
                if (!booster) {
                    continue;
                }
                boosters.push(new HypixelBooster(this, await this.getResources(), booster));
            }
            return boosters;
        } else {
            console.error(json.cause);
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });

        }
    }

    public async getPlayerCounts(raw?: false): Promise<HypixelPlayerCount>;
    public async getPlayerCounts(raw?: true): Promise<HypixelCountsResponse>;
    public async getPlayerCounts(raw = false): Promise<HypixelPlayerCount | HypixelCountsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/counts`, {
            headers: this.genHeaders()
        });
        const json: HypixelCountsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            return new HypixelPlayerCount(this, await this.getResources(), {
                games: json.games,
                playerCount: json.playerCount
            });
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getPunishmentStatistics(raw?: false): Promise<HypixelPunishmentStatistics>;
    public async getPunishmentStatistics(raw?: true): Promise<HypixelPunishmentStatisticsResponse>;
    public async getPunishmentStatistics(raw = false): Promise<HypixelPunishmentStatistics | HypixelPunishmentStatisticsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/punishmentstats`, {
            headers: this.genHeaders()
        });
        const json: HypixelPunishmentStatisticsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            return new HypixelPunishmentStatistics(this, await this.getResources(), {
                watchdog_lastMinute: json.watchdog_lastMinute,
                watchdog_rollingDaily: json.watchdog_rollingDaily,
                staff_rollingDaily: json.staff_rollingDaily,
                watchdog_total: json.watchdog_total,
                staff_total: json.staff_total
            });
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getLeaderboards(raw?: false): Promise<HypixelLeaderboards>;
    public async getLeaderboards(raw?: true): Promise<HypixelLeaderboardsResponse>;
    public async getLeaderboards(raw = false): Promise<HypixelLeaderboards | HypixelLeaderboardsResponse> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/leaderboards`, {
            headers: this.genHeaders()
        });
        const json: HypixelLeaderboardsResponse = await res.json();

        if(raw) {
            return json;
        }

        if(json.success) {
            if(!json.leaderboards) {
                throw new HypixelParseError("Leaderboards not found", json);
            }
            return new HypixelLeaderboards(this, await this.getResources(), json.leaderboards);
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    protected genHeaders(): Headers {
        const headers = new Headers();
        headers.set("API-Key", this.options.apiKey);
        return headers;
    }

    protected parseOptions(options: HypixelAPIOptions): ParsedOptions<HypixelAPIOptions> {
        return Object.freeze({
            ...this.parseDefaultOptions(options),
            apiKey: options.apiKey
        })
    }
}
