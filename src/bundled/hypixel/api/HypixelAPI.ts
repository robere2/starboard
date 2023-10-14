import {MojangAPI} from "../../MojangAPI.ts";
import {MONGODB_ID_REGEX, ParsedOptions, UUID_REGEX} from "../../../util.ts";
import {APIOptions, BaseAPI} from "../../BaseAPI.ts";
import {HypixelResources} from "./HypixelResources.ts";
import crypto from "crypto";
import z from "zod";
import {BaseResponse, BaseSchema} from "./schemas";
import {HypixelEntity} from "./HypixelEntity.ts";
import {
    generateBoosterSchema,
    HypixelBooster,
    BoosterSchema
} from "./schemas";
import {generateGuildSchema, HypixelGuild, GuildSchema} from "./schemas";
import {generateLeaderboardsSchema, HypixelLeaderboards, LeaderboardsSchema} from "./schemas";
import {
    generatePlayerCountsSchema,
    HypixelPlayerCounts,
    PlayerCountsSchema
} from "./schemas";
import {
    generatePunishmentStatisticsSchema,
    HypixelPunishmentStatistics,
    PunishmentStatisticsSchema
} from "./schemas";
import {
    generateRecentGamesSchema,
    HypixelRecentGame,
    RecentGamesSchema
} from "./schemas";
import {generateStatusSchema, HypixelSession, StatusSchema} from "./schemas";
import {
    generateSkyBlockAuctionSchema,
    generateSkyBlockAuctionsSchema, generateSkyBlockEndedAuctionsSchema,
    HypixelSkyBlockAuction,
    HypixelSkyBlockAuctions, HypixelSkyBlockEndedAuction, SkyBlockAuctionSchema,
    SkyBlockAuctionsSchema, SkyBlockEndedAuctionsSchema
} from "./schemas";
import {generatePlayerSchema, HypixelPlayer, PlayerSchema} from "./schemas";
import {
    generateSkyBlockNewsSchema,
    HypixelSkyBlockNews,
    SkyBlockNewsSchema
} from "./schemas";
import {
    generateSkyBlockBazaarSchema,
    HypixelSkyBlockBazaarProduct,
    SkyBlockBazaarSchema
} from "./schemas";
import {
    generateSkyBlockBingoSchema,
    HypixelSkyBlockBingoProfile,
    SkyBlockBingoSchema
} from "./schemas";
import {
    generateSkyBlockFiresalesSchema,
    HypixelSkyBlockFiresale,
    SkyBlockFiresalesSchema
} from "./schemas";
import {
    generateSkyBlockMuseumSchema,
    HypixelSkyBlockMuseum,
    SkyBlockMuseumSchema
} from "./schemas";
import {
    generateSkyBlockProfileSchema, generateSkyBlockProfilesSchema,
    HypixelSkyBlockProfile,
    SkyBlockProfileSchema,
    SkyBlockProfilesSchema
} from "./schemas";

export type HypixelAPIOptions = APIOptions & {
    /**
     * API key to use in requests to the Hypixel API. Should be a valid UUID with or without dashes retrieved from
     *   https://developer.hypixel.net/dashboard. An invalid UUID will result in 403 error responses from the API.
     */
    apiKey: string;
}

/**
 * Interface for requesting data from the Hypixel API. Caching is not built-in.
 */
export class HypixelAPI extends BaseAPI<HypixelAPIOptions> {

    private readonly recentGamesSchema: RecentGamesSchema;
    private readonly statusSchema: StatusSchema
    private readonly guildSchema: GuildSchema;
    private readonly boosterSchema: BoosterSchema;
    private readonly playerCountsSchema: PlayerCountsSchema;
    private readonly punishmentStatisticsSchema: PunishmentStatisticsSchema;
    private readonly leaderboardsSchema: LeaderboardsSchema;
    private readonly playerSchema: PlayerSchema;
    private readonly skyBlockNewsSchema: SkyBlockNewsSchema;
    private readonly skyBlockAuctionsSchema: SkyBlockAuctionsSchema;
    private readonly skyBlockEndedAuctionsSchema: SkyBlockEndedAuctionsSchema;
    private readonly skyBlockAuctionSchema: SkyBlockAuctionSchema;
    private readonly skyBlockBazaarSchema: SkyBlockBazaarSchema;
    private readonly skyBlockProfileSchema: SkyBlockProfileSchema;
    private readonly skyBlockProfilesSchema: SkyBlockProfilesSchema;
    private readonly skyBlockMuseumSchema: SkyBlockMuseumSchema;
    private readonly skyBlockBingoProfileSchema: SkyBlockBingoSchema;
    private readonly skyBlockFiresalesSchema: SkyBlockFiresalesSchema;

    // --------------------------------------------------

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
    private constructor(options: HypixelAPIOptions) {
        super(options);
        this.mojangApi = new MojangAPI(options)
        this.resourcesPromise = HypixelResources.create(this, this.options).then((resources) => {
            this.resourcesPromise = null;
            return this.resources = resources
        })

        this.recentGamesSchema = generateRecentGamesSchema(this);
        this.statusSchema = generateStatusSchema();
        this.guildSchema = generateGuildSchema(this);
        this.boosterSchema = generateBoosterSchema(this);
        this.playerCountsSchema = generatePlayerCountsSchema(this);
        this.punishmentStatisticsSchema = generatePunishmentStatisticsSchema();
        this.leaderboardsSchema = generateLeaderboardsSchema(this);
        this.playerSchema = generatePlayerSchema(this);
        this.skyBlockNewsSchema = generateSkyBlockNewsSchema();
        this.skyBlockAuctionsSchema = generateSkyBlockAuctionsSchema(this);
        this.skyBlockEndedAuctionsSchema = generateSkyBlockEndedAuctionsSchema(this);
        this.skyBlockAuctionSchema = generateSkyBlockAuctionSchema(this);
        this.skyBlockBazaarSchema = generateSkyBlockBazaarSchema(this);
        this.skyBlockProfileSchema = generateSkyBlockProfileSchema(this);
        this.skyBlockProfilesSchema = generateSkyBlockProfilesSchema(this);
        this.skyBlockMuseumSchema = generateSkyBlockMuseumSchema();
        this.skyBlockBingoProfileSchema = generateSkyBlockBingoSchema();
        this.skyBlockFiresalesSchema = generateSkyBlockFiresalesSchema();

        HypixelEntity.registerAPI(this);
    }

    public static async create(options: HypixelAPIOptions): Promise<HypixelAPI> {
        const api = new HypixelAPI(options);
        await api.resourcesPromise;
        return api;
    }

    public getResources(): HypixelResources {
        // Resources won't be null as long as we don't use them somewhere in the initialization of this class. The
        //   HypixelAPI object isn't returned from create() until resources have been fetched.
        return this.resources as HypixelResources;
    }

    private async request<T extends typeof BaseSchema, U>(path: string, raw: boolean, schema: T, mutator?: (input: z.infer<T>) => U): Promise<BaseResponse | U> {
        const res = await this.options.httpClient.fetch(`https://api.hypixel.net/${path}`, {
            headers: this.genHeaders()
        });
        const json = BaseSchema.readonly().parse(await res.json());

        if(raw) {
            return json;
        } else if(!json.success) {
            throw new Error(`Hypixel API Error: ${json.cause}`, {
                cause: json.cause
            });
        } else {
            if(mutator) {
                try {
                    return mutator(schema.readonly().parse(json))
                } catch(e) {
                    console.log(e);
                    throw e;
                }
            } else {
                return schema.readonly().parse(json);
            }
        }
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
     * @param raw Whether to return the raw {@link BaseResponse} instead of a {@link HypixelPlayer} object.
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
     * @param raw Whether to return the raw {@link BaseResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @throws Error if the player's `uuid` property is not a valid UUID.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(uuid: string, raw?: false): Promise<HypixelPlayer | null>;
    /**
     * Retrieve up-to-date data of a specific player, including game stats. If the player is not found, null is
     *   returned, however this should never happen unless you constructed the HypixelPlayer object yourself. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param player HypixelPlayer instance with the UUID of the player you're looking for data for.
     * @param raw Whether to return the raw {@link BaseResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @throws Error if the player's `uuid` property is not a valid UUID.
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
     * @param raw Whether to return the raw {@link BaseResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(name: string, direct?: boolean, raw?: true): Promise<BaseResponse>;
    /**
     * Retrieve data of a specific player, including game stats. If the player is not found, null is returned. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param uuid The UUID of the player. If the UUID is not found, null is returned.
     * @param raw Whether to return the raw {@link BaseResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(uuid: string, raw?: true): Promise<BaseResponse>;
    /**
     * Retrieve up-to-date data of a specific player, including game stats. If the player is not found, null is
     *   returned, however this should never happen unless you constructed the HypixelPlayer object yourself. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param player HypixelPlayer instance with the UUID of the player you're looking for data for.
     * @param raw Whether to return the raw {@link BaseResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     *   @throws Error if the player's `uuid` property is not a valid UUID.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(player: HypixelPlayer, raw?: true): Promise<BaseResponse>;
    public async getPlayer(player: string | HypixelPlayer, direct = false, raw = false): Promise<HypixelPlayer | BaseResponse | null> {
        if(typeof player === "object" || UUID_REGEX.test(player)) {
            const uuid = typeof player === "object" ? player.uuid : player;
            if(!uuid || !UUID_REGEX.test(uuid)) {
                throw new Error("Invalid UUID provided as input");
            }

            return this.request(`player?uuid=${uuid}`, raw, this.playerSchema, (v) => v.player);
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

            return await this.request(`player?name=${name}`, raw, this.playerSchema);
        }
    }

    public async getRecentGames(uuid: string, raw?: false): Promise<HypixelRecentGame[]>;
    public async getRecentGames(player: HypixelPlayer, raw?: false): Promise<HypixelRecentGame[]>;
    public async getRecentGames(uuid: string, raw?: true): Promise<BaseResponse>;
    public async getRecentGames(player: HypixelPlayer, raw?: true): Promise<BaseResponse>;
    public async getRecentGames(player: string | HypixelPlayer, raw = false): Promise<HypixelRecentGame[] | BaseResponse> {
        const uuid = typeof player === "object" ? player.uuid : player;
        if(!uuid || !UUID_REGEX.test(uuid)) {
            throw new Error("Invalid UUID provided as input");
        }
        return await this.request(`recentgames?uuid=${uuid}`, raw, this.recentGamesSchema, (val) => val.games ?? []);
    }

    public async getStatus(uuid: string, raw?: false): Promise<HypixelSession | null>;
    public async getStatus(player: HypixelPlayer, raw?: false): Promise<HypixelSession | null>;
    public async getStatus(uuid: string, raw?: true): Promise<BaseResponse>;
    public async getStatus(player: HypixelPlayer, raw?: true): Promise<BaseResponse>;
    public async getStatus(player: string | HypixelPlayer, raw = false): Promise<HypixelSession | BaseResponse | null> {
        const uuid = typeof player === "object" ? player.uuid : player;
        if(!uuid || !UUID_REGEX.test(uuid)) {
            throw new Error("Invalid UUID provided as input");
        }
        return await this.request(`status?uuid=${uuid}`, raw, this.statusSchema, (val) => val.session ?? null);
    }

    public async getGuild(id: string, raw?: false): Promise<HypixelGuild | null>;
    public async getGuild(name: string, raw?: false): Promise<HypixelGuild | null>;
    public async getGuild(player: HypixelPlayer, raw?: false): Promise<HypixelGuild | null>;
    public async getGuild(playerUuid: string, raw?: false): Promise<HypixelGuild | null>;
    public async getGuild(id: string, raw?: true): Promise<BaseResponse>;
    public async getGuild(name: string, raw?: true): Promise<BaseResponse>;
    public async getGuild(player: HypixelPlayer, raw?: true): Promise<BaseResponse>;
    public async getGuild(playerUuid: string, raw?: true): Promise<BaseResponse>;
    public async getGuild(input: string | HypixelPlayer, raw = false): Promise<HypixelGuild | null | BaseResponse> {
        // Guilds can be searched by ID, name, or member UUID. All three of these are strings, but we can pretty safely
        //   (although not definitively) assume which format is being used based on the contents of the string.
        let paramType: "id" | "name" | "player";
        if(typeof input === "object" || UUID_REGEX.test(input)) {
            paramType = "player";
            input = (typeof input === "object" ? input.uuid : input) ?? "";
            if(!input || !UUID_REGEX.test(input)) {
                throw new Error("Invalid UUID provided as input");
            }
        } else if(MONGODB_ID_REGEX.test(input)) {
            paramType = "id";
        } else {
            paramType = "name";
        }

        return await this.request(`guild?${paramType}=${input}`, raw, this.guildSchema, (v) => v.guild);
    }

    public async areBoostersActive(): Promise<boolean> {
        const boostersRes = await this.getBoosters(true);
        return boostersRes.boosterState?.decrementing ?? false;
    }

    public async getBoosters(raw?: false): Promise<HypixelBooster[]>;
    public async getBoosters(raw?: true): Promise<BaseResponse>;
    public async getBoosters(raw = false): Promise<HypixelBooster[] | BaseResponse> {
        return await this.request("boosters", raw, this.boosterSchema, (v) => v.boosters);
    }

    public async getPlayerCounts(raw?: false): Promise<HypixelPlayerCounts>;
    public async getPlayerCounts(raw?: true): Promise<BaseResponse>;
    public async getPlayerCounts(raw = false): Promise<HypixelPlayerCounts | BaseResponse> {
        return await this.request("counts", raw, this.playerCountsSchema);
    }

    public async getPunishmentStatistics(raw?: false): Promise<HypixelPunishmentStatistics>;
    public async getPunishmentStatistics(raw?: true): Promise<BaseResponse>;
    public async getPunishmentStatistics(raw = false): Promise<HypixelPunishmentStatistics | BaseResponse> {
        return await this.request("punishmentstats", raw, this.punishmentStatisticsSchema);
    }


    public async getLeaderboards(raw?: false): Promise<HypixelLeaderboards>;
    public async getLeaderboards(raw?: true): Promise<BaseResponse>;
    public async getLeaderboards(raw = false): Promise<HypixelLeaderboards | BaseResponse> {
        return await this.request("leaderboards", raw, this.leaderboardsSchema, (v) => v.leaderboards);
    }

    public async getSkyBlockNews(raw?: false): Promise<HypixelSkyBlockNews[] >;
    public async getSkyBlockNews(raw?: true): Promise<BaseResponse>;
    public async getSkyBlockNews(raw = false): Promise<HypixelSkyBlockNews[] | BaseResponse> {
        return await this.request("skyblock/news", raw, this.skyBlockNewsSchema, (v) => v.items);
    }

    public async getSkyBlockAuctions(page?: number, raw?: false): Promise<HypixelSkyBlockAuctions>;
    public async getSkyBlockAuctions(page?: number, raw?: true): Promise<BaseResponse>;
    public async getSkyBlockAuctions(page?: number, raw = false): Promise<HypixelSkyBlockAuctions | BaseResponse> {
        return await this.request(`skyblock/auctions?page=${page ?? 0}`, raw, this.skyBlockAuctionsSchema)
    }

    public async getSkyBlockAuctionsById(id: string, raw?: false): Promise<HypixelSkyBlockAuction[]>;
    public async getSkyBlockAuctionsById(id: string, raw?: true): Promise<BaseResponse>;
    public async getSkyBlockAuctionsById(id: string, raw = false): Promise<HypixelSkyBlockAuction[] | BaseResponse> {
        return await this.request(`skyblock/auctions?uuid=${id}`, raw, this.skyBlockAuctionSchema, (v) => v.auctions ?? [])
    }

    public async getSkyBlockAuctionsByPlayer(playerUuid: string, raw?: false): Promise<HypixelSkyBlockAuction[]>;
    public async getSkyBlockAuctionsByPlayer(playerUuid: string, raw?: true): Promise<BaseResponse>;
    public async getSkyBlockAuctionsByPlayer(playerUuid: string, raw = false): Promise<HypixelSkyBlockAuction[] | BaseResponse> {
        return await this.request(`skyblock/auctions?player=${playerUuid}`, raw, this.skyBlockAuctionSchema, (v) => v.auctions ?? [])
    }

    public async getSkyBlockAuctionsByProfile(profileId: string, raw?: false): Promise<HypixelSkyBlockAuction[]>;
    public async getSkyBlockAuctionsByProfile(profileId: string, raw?: true): Promise<BaseResponse>;
    public async getSkyBlockAuctionsByProfile(profileId: string, raw = false): Promise<HypixelSkyBlockAuction[] | BaseResponse> {
        return await this.request(`skyblock/auctions?profile=${profileId}`, raw, this.skyBlockAuctionSchema, (v) => v.auctions ?? [])
    }

    public async getSkyBlockEndedAuctions(raw?: false): Promise<HypixelSkyBlockEndedAuction[]>;
    public async getSkyBlockEndedAuctions(raw?: true): Promise<BaseResponse>;
    public async getSkyBlockEndedAuctions(raw = false): Promise<HypixelSkyBlockEndedAuction[] | BaseResponse> {
        return await this.request(`skyblock/auctions_ended`, raw, this.skyBlockEndedAuctionsSchema, (v) => v.auctions ?? [])
    }

    public async getSkyBlockBazaarProducts(raw?: false): Promise<Record<string, HypixelSkyBlockBazaarProduct>>;
    public async getSkyBlockBazaarProducts(raw?: true): Promise<BaseResponse>;
    public async getSkyBlockBazaarProducts(raw = false): Promise<Record<string, HypixelSkyBlockBazaarProduct> | BaseResponse> {
        return await this.request(`skyblock/bazaar`, raw, this.skyBlockBazaarSchema, (v) => v.products ?? {})
    }

    public async getSkyBlockProfile(profileId: string, raw?: false): Promise<HypixelSkyBlockProfile | null>;
    public async getSkyBlockProfile(profileId: string, raw?: true): Promise<BaseResponse>;
    public async getSkyBlockProfile(profileId: string, raw = false): Promise<HypixelSkyBlockProfile | null | BaseResponse> {
        return await this.request(`skyblock/profile?profile=${profileId}`, raw, this.skyBlockProfileSchema, (v) => v.profile ?? null);
    }

    public async getSkyBlockProfiles(playerUuid: string, raw?: false): Promise<HypixelSkyBlockProfile[]>;
    public async getSkyBlockProfiles(playerUuid: string, raw?: true): Promise<BaseResponse>;
    public async getSkyBlockProfiles(playerUuid: string, raw = false): Promise<HypixelSkyBlockProfile[] | BaseResponse> {
        return await this.request(`skyblock/profiles?uuid=${playerUuid}`,  raw, this.skyBlockProfilesSchema, (v) => v.profiles ?? [])
    }

    public async getSkyBlockMuseums(profileId: string, raw?: false): Promise<Record<string, HypixelSkyBlockMuseum>>;
    public async getSkyBlockMuseums(profileId: string, raw?: true): Promise<BaseResponse>;
    public async getSkyBlockMuseums(profileId: string, raw = false): Promise<Record<string, HypixelSkyBlockMuseum> | BaseResponse> {
       return await this.request(`skyblock/museum?profile=${profileId}`, raw, this.skyBlockMuseumSchema, (v) => v.members ?? {})
    }

    public async getSkyBlockBingoProfiles(playerUuid: string, raw?: false): Promise<HypixelSkyBlockBingoProfile[]>;
    public async getSkyBlockBingoProfiles(playerUuid: string, raw?: true): Promise<BaseResponse>;
    public async getSkyBlockBingoProfiles(playerUuid: string, raw = false): Promise<HypixelSkyBlockBingoProfile[] | BaseResponse> {
        return await this.request(`skyblock/bingo?uuid=${playerUuid}`, raw, this.skyBlockBingoProfileSchema, (v) => v.events ?? [])
    }

    public async getSkyBlockFiresales(raw?: false): Promise<HypixelSkyBlockFiresale[]>;
    public async getSkyBlockFiresales(raw?: true): Promise<BaseResponse>;
    public async getSkyBlockFiresales(raw = false): Promise<HypixelSkyBlockFiresale[] | BaseResponse> {
        return await this.request(`skyblock/firesales`, raw, this.skyBlockFiresalesSchema, (v) => v.sales ?? [])
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
