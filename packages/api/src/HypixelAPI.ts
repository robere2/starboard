import {MojangAPI} from "./MojangAPI";
import {MONGODB_ID_REGEX, NonOptional, UUID_REGEX} from "./util";
import {APIOptions, BaseAPI, RawResponse} from "./BaseAPI";
import {HypixelResources} from "./HypixelResources";
import * as crypto from "crypto";
import {
    BoosterSchema,
    generateBoosterSchema,
    generateGuildSchema,
    generateLeaderboardsSchema,
    generatePlayerCountsSchema,
    generatePlayerSchema,
    generatePunishmentStatisticsSchema,
    generateRecentGamesSchema,
    generateSkyBlockAuctionSchema,
    generateSkyBlockAuctionsSchema,
    generateSkyBlockBazaarSchema,
    generateSkyBlockBingoSchema,
    generateSkyBlockEndedAuctionsSchema,
    generateSkyBlockFiresalesSchema,
    generateSkyBlockMuseumSchema,
    generateSkyBlockNewsSchema,
    generateSkyBlockProfileSchema,
    generateSkyBlockProfilesSchema,
    generateStatusSchema,
    GuildSchema,
    HypixelBooster,
    HypixelGuild,
    HypixelLeaderboards,
    HypixelPlayer,
    HypixelPlayerCounts,
    HypixelPunishmentStatistics,
    HypixelRecentGame,
    HypixelSession,
    HypixelSkyBlockAuction,
    HypixelSkyBlockAuctions,
    HypixelSkyBlockBazaarProduct, HypixelSkyBlockBingoProfile,
    HypixelSkyBlockEndedAuction, HypixelSkyBlockFiresale, HypixelSkyBlockMuseum,
    HypixelSkyBlockNews, HypixelSkyBlockProfile,
    LeaderboardsSchema,
    PlayerCountsSchema,
    PlayerSchema,
    PunishmentStatisticsSchema,
    RecentGamesSchema,
    SkyBlockAuctionSchema,
    SkyBlockAuctionsSchema,
    SkyBlockBazaarSchema,
    SkyBlockBingoSchema,
    SkyBlockEndedAuctionsSchema,
    SkyBlockFiresalesSchema,
    SkyBlockMuseumSchema,
    SkyBlockNewsSchema,
    SkyBlockProfileSchema,
    SkyBlockProfilesSchema,
    StatusSchema
} from "./schemas";
import {HypixelEntity} from "./HypixelEntity";
import {RateLimitDeferPolicy} from "./defer";
import {HypixelBaseSchema} from "./schemas/hypixel/HypixelBaseSchema";
import * as z from "zod";

export type HypixelAPIOptions = APIOptions & {
    /**
     * API key to use in requests to the Hypixel API. Should be a valid UUID with or without dashes retrieved from
     *   https://developer.hypixel.net/dashboard. An invalid UUID will result in 403 error responses from the API.
     */
    apiKey: string;
}

/**
 * Interface for requesting data from the Hypixel API.
 *
 * @example
 * const hypixel = await HypixelAPI.create({
 *     apiKey: "98cb0f8d-b14d-4b29-ae84-0a4d2bf35039"
 * })
 *
 * const boosters = await hypixel.getBoosters() // HypixelBooster[]
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

    /**
     * Resources get their own ID so children entities can reference them later without having to store them as a
     *  property. This prevents circular references, allowing you to log/serialize child values.
     * @internal
     */
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

    /**
     * Create a new instance of `HypixelAPI`.
     * @param options Options to use when creating the `HypixelAPI`.
     * @returns A `Promise` that resolves to a new `HypixelAPI` instance. The `Promise` resolves after all resources
     *   have been fetched by {@link HypixelResources}, to avoid a {@link ResourcesNotReadyError}.
     * @see {@link HypixelAPIOptions}
     * @see {@link HypixelResources}
     */
    public static async create(options: HypixelAPIOptions): Promise<HypixelAPI> {
        const api = new HypixelAPI(options);
        await api.resourcesPromise;
        return api;
    }

    /**
     * Get the {@link HypixelResources} instance used by this `HypixelAPI`.
     * @returns The `HypixelResources` instance.
     * @see {@link HypixelResources}
     */
    public getResources(): HypixelResources {
        // Resources won't be null as long as we don't use them somewhere in the initialization of this class. The
        //   HypixelAPI object isn't returned from create() until resources have been fetched.
        return this.resources as HypixelResources;
    }

    /**
     * Generic method for sending requests to the Hypixel API.
     * @internal
     * @param path
     * @param raw
     * @param schema
     * @param mutator
     * @protected
     */
    protected async request<S extends typeof HypixelBaseSchema, V>(path: string, raw: true, schema?: S, mutator?: (input: z.infer<S>) => V): Promise<RawResponse>;
    protected async request<S extends typeof HypixelBaseSchema>(path: string, raw: false, schema: S, mutator: undefined): Promise<z.infer<S>>;
    protected async request<S extends typeof HypixelBaseSchema, V>(path: string, raw: false, schema: S, mutator: (input: z.infer<S>) => V): Promise<V>;
    protected async request<S extends typeof HypixelBaseSchema, V>(path: string, raw: boolean, schema?: S, mutator?: (input: z.infer<S>) => V): Promise<z.infer<S> | V | RawResponse> {
        return await super.request(`https://api.hypixel.net/${path}`, raw as any, HypixelBaseSchema.readonly(), (base) => {
            if(!base.success) {
                throw new Error(`Hypixel API Error: ${base.cause}`, {
                    cause: base.cause
                });
            }

            const parsed = schema!.parse(base);
            if(mutator) {
                return mutator(parsed);
            }
            return parsed;
        });
    }

    /**
     * Retrieve data of the player with the given username from the Hypixel API via the `/player` endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get
     * @see {@link MojangAPI.getUuid}
     * @param name The username of the player.
     * @param direct Whether to directly fetch the data from the Hypixel API without converting the username into
     *   a UUID first (default: `false`). This is a feature of the Hypixel API that is deprecated and no longer
     *   recommended due to the ability to change Minecraft usernames. The "name" property is based on the last name
     *   that a player connected to the Hypixel Network with. If the player "Steve" changes their name to "NotSteve",
     *   the name lookup for "NotSteve" will not Steve's data until Steve reconnects. Further, if another player
     *   previously had the username "NotSteve" but also has not connected to Hypixel since changing their name, then
     *   their data may be returned instead. If this is not what you want, set this option to false and their username
     *   will be converted to a UUID via {@link MojangAPI|The Mojang API}. Looking up data for a username directly is
     *   heavily rate limited per player. Attempts to call this method more than once per name approximately every five
     *   minutes will result in a 429 response.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link HypixelPlayer} object containing all the data of the player, or
     *   `null` if the player is not found.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API or Mojang API fail
     * - `Error` if the Hypixel API or Mojang API rate limit has been reached. {@link APIOptions.deferPolicy} can help
     *   avoid this. Can occur if the API has an emergency global throttle applied as well.
     */
    public async getPlayer(name: string, direct?: boolean, raw?: false): Promise<HypixelPlayer | null>;
    /**
     * Retrieve data of a specific player from the Hypixel API via the `/player` endpoint using a player UUID.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get
     * @param uuid The UUID of the player. If a player with the given UUID is not in Hypixels database, `null` will be
     *   returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link HypixelPlayer} object containing all the data of the player, or
     *   `null` if the player is not found.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getPlayer(uuid: string, raw?: false): Promise<HypixelPlayer | null>;
    /**
     * Retrieve data of the player with the given username from the Hypixel API via the `/player` endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get
     * @see {@link MojangAPI.getUuid}
     * @param name The username of the player.
     * @param direct Whether to directly fetch the data from the Hypixel API without converting the username into
     *   a UUID first (default: `false`). This is a feature of the Hypixel API that is deprecated and no longer
     *   recommended due to the ability to change Minecraft usernames. The "name" property is based on the last name
     *   that a player connected to the Hypixel Network with. If the player "Steve" changes their name to "NotSteve",
     *   the name lookup for "NotSteve" will not Steve's data until Steve reconnects. Further, if another player
     *   previously had the username "NotSteve" but also has not connected to Hypixel since changing their name, then
     *   their data may be returned instead. If this is not what you want, set this option to false and their username
     *   will be converted to a UUID via {@link MojangAPI|The Mojang API}. Looking up data for a username directly is
     *   heavily rate limited per player. Attempts to call this method more than once per name approximately every five
     *   minutes will result in a 429 response.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getPlayer(name: string, direct?: boolean, raw?: true): Promise<RawResponse>;
    /**
     * Retrieve data of a specific player from the Hypixel API via the `/player` endpoint using a player UUID.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get
     * @param uuid The UUID of the player. If a player with the given UUID is not in Hypixels database, `null` will be
     *   returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelPlayer} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getPlayer(uuid: string, raw?: true): Promise<RawResponse>;
    public async getPlayer(player: string, direct = false, raw = false): Promise<HypixelPlayer | RawResponse | null> {
        if(UUID_REGEX.test(player)) {
            return this.request(`player?uuid=${player}`, raw as any, this.playerSchema, (v) => v.player);
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

            return await this.request(`player?name=${name}`, raw as any, this.playerSchema);
        }
    }

    /**
     * Retrieve the list of a specific player's recently played games from the Hypixel API via the `/recentgames`
     *   endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1recentgames/get
     * @param uuid The UUID of the player. If a player with the given UUID is not in Hypixels database, or if the player
     *   has not recently played any games, an empty array will be returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelRecentGame} array.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with an array of {@link HypixelRecentGame} objects, or an empty array if none
     *   are found or the player does not exist.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getRecentGames(uuid: string, raw?: false): Promise<HypixelRecentGame[]>;
    /**
     * Retrieve the list of a specific player's recently played games from the Hypixel API via the `/recentgames`
     *   endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1recentgames/get
     * @param uuid The UUID of the player. If a player with the given UUID is not in Hypixels database, or if the player
     *   has not recently played any games, an empty array will be returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelRecentGame} array.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getRecentGames(uuid: string, raw?: true): Promise<RawResponse>;
    public async getRecentGames(uuid: string, raw = false): Promise<HypixelRecentGame[] | RawResponse> {
        return await this.request(`recentgames?uuid=${uuid}`, raw as any, this.recentGamesSchema, (val) => val.games ?? []);
    }

    /**
     * Retrieve the online status and current game of a specific player from the Hypixel API via the `/status` endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1status/get
     * @param uuid The UUID of the player. If a player with the given UUID is not currently online, or is not in Hypixels
     *  database, `null` will be returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSession} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link HypixelSession} object, or `null` if the player is not online
     *   or does not exist.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getStatus(uuid: string, raw?: false): Promise<HypixelSession | null>;
    /**
     * Retrieve the online status and current game of a specific player from the Hypixel API via the `/status` endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1status/get
     * @param uuid The UUID of the player. If a player with the given UUID is not currently online, or is not in Hypixels
     *  database, `null` will be returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSession} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getStatus(uuid: string, raw?: true): Promise<RawResponse>;
    public async getStatus(uuid: string, raw = false): Promise<HypixelSession | RawResponse | null> {
        return await this.request(`status?uuid=${uuid}`, raw as any, this.statusSchema, (val) => val.session ?? null);
    }

    /**
     * Retrieve data about a Hypixel Guild from the Hypixel API via the `/guild` endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1guild/get
     * @see https://www.mongodb.com/docs/manual/reference/method/ObjectId/
     * @param id The MongoDB object ID of the guild. If a guild with the given ID does not exist, `null` will be returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelGuild} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link HypixelGuild} object, or `null` if the guild does not exist.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getGuild(id: string, raw?: false): Promise<HypixelGuild | null>;
    /**
     * Retrieve data about a Hypixel Guild from the Hypixel API via the `/guild` endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1guild/get
     * @param name The name of the guild. If a guild with the given name does not exist, `null` will be returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelGuild} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link HypixelGuild} object, or `null` if the guild does not exist.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getGuild(name: string, raw?: false): Promise<HypixelGuild | null>;
    /**
     * Retrieve data about a Hypixel Guild from the Hypixel API via the `/guild` endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1guild/get
     * @param playerUuid The UUID of a player in the guild. If the player is not in a guild, or if the player does not
     *   exist, `null` will be returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelGuild} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link HypixelGuild} object, or `null` if the guild does not exist.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getGuild(playerUuid: string, raw?: false): Promise<HypixelGuild | null>;
    /**
     * Retrieve data about a Hypixel Guild from the Hypixel API via the `/guild` endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1guild/get
     * @see https://www.mongodb.com/docs/manual/reference/method/ObjectId/
     * @param id The MongoDB object ID of the guild. If a guild with the given ID does not exist, `null` will be returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelGuild} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getGuild(id: string, raw?: true): Promise<RawResponse>;
    /**
     * Retrieve data about a Hypixel Guild from the Hypixel API via the `/guild` endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1guild/get
     * @param name The name of the guild. If a guild with the given name does not exist, `null` will be returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelGuild} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getGuild(name: string, raw?: true): Promise<RawResponse>;
    /**
     * Retrieve data about a Hypixel Guild from the Hypixel API via the `/guild` endpoint.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1guild/get
     * @param playerUuid The UUID of a player in the guild. If the player is not in a guild, or if the player does not
     *   exist, `null` will be returned.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelGuild} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getGuild(playerUuid: string, raw?: true): Promise<RawResponse>;
    public async getGuild(input: string, raw = false): Promise<HypixelGuild | null | RawResponse> {
        // Guilds can be searched by ID, name, or member UUID. All three of these are strings, but we can pretty safely
        //   (although not definitively) assume which format is being used based on the contents of the string.
        let paramType: "id" | "name" | "player";
        if(UUID_REGEX.test(input)) {
            paramType = "player";
        } else if(MONGODB_ID_REGEX.test(input)) {
            paramType = "id";
        } else {
            paramType = "name";
        }

        return await this.request(`guild?${paramType}=${input}`, raw as any, this.guildSchema, (v) => v.guild);
    }

    /**
     * Check whether booster timers are currently counting down. Boosters are occasionally paused during maintenance or
     *   server-wide issues.
     * @see {@link getBoosters}
     * @see {@link HypixelBooster}
     * @see https://api.hypixel.net/#tag/Other/paths/~1boosters/get
     * @returns A `Promise` that resolves to `true` if boosters are active, or `false` otherwise.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async areBoostersActive(): Promise<boolean> {
        const boostersRes = await this.getBoosters(true);
        return boostersRes.json().boosterState?.decrementing ?? false;
    }

    /**
     * Retrieve a list of active Hypixel Boosters from the Hypixel API via the `/boosters` endpoint.
     * @see https://api.hypixel.net/#tag/Other/paths/~1boosters/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelBooster} array.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with an array of {@link HypixelBooster} objects, or an empty array if there
     *   are no active boosters.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getBoosters(raw?: false): Promise<HypixelBooster[]>;
    /**
     * Retrieve a list of active Hypixel Boosters from the Hypixel API via the `/boosters` endpoint.
     * @see https://api.hypixel.net/#tag/Other/paths/~1boosters/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelBooster} array.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getBoosters(raw?: true): Promise<RawResponse>;
    public async getBoosters(raw = false): Promise<HypixelBooster[] | RawResponse> {
        return await this.request("boosters", raw as any, this.boosterSchema, (v) => v.boosters);
    }

    /**
     * Retrieve a map of Hypixel game modes and their respective player counts from the Hypixel API via the `/counts`
     *   endpoint.
     * @see https://api.hypixel.net/#tag/Other/paths/~1counts/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelPlayerCounts} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link HypixelPlayerCounts} object.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getPlayerCounts(raw?: false): Promise<HypixelPlayerCounts>;
    /**
     * Retrieve a map of Hypixel game modes and their respective player counts from the Hypixel API via the `/counts`
     *   endpoint.
     * @see https://api.hypixel.net/#tag/Other/paths/~1counts/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelPlayerCounts} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getPlayerCounts(raw?: true): Promise<RawResponse>;
    public async getPlayerCounts(raw = false): Promise<HypixelPlayerCounts | RawResponse> {
        return await this.request("counts", raw as any, this.playerCountsSchema);
    }

    /**
     * Retrieve an object containing the latest punishment statistics from the Hypixel API via the `/punishmentstats`
     *   endpoint.
     * @see https://api.hypixel.net/#tag/Other/paths/~1punishmentstats/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelPunishmentStatistics} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link HypixelPunishmentStatistics} object.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getPunishmentStatistics(raw?: false): Promise<HypixelPunishmentStatistics>;
    /**
     * Retrieve an object containing the latest punishment statistics from the Hypixel API via the `/punishmentstats`
     *   endpoint.
     * @see https://api.hypixel.net/#tag/Other/paths/~1punishmentstats/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelPunishmentStatistics} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getPunishmentStatistics(raw?: true): Promise<RawResponse>;
    public async getPunishmentStatistics(raw = false): Promise<HypixelPunishmentStatistics | RawResponse> {
        return await this.request("punishmentstats", raw as any, this.punishmentStatisticsSchema);
    }

    /**
     * Retrieve an object containing the latest leaderboard data from the Hypixel API via the `/leaderboards` endpoint.
     * @see https://api.hypixel.net/#tag/Other/paths/~1leaderboards/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelLeaderboards} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link HypixelLeaderboards} object.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getLeaderboards(raw?: false): Promise<HypixelLeaderboards>;
    /**
     * Retrieve an object containing the latest leaderboard data from the Hypixel API via the `/leaderboards` endpoint.
     * @see https://api.hypixel.net/#tag/Other/paths/~1leaderboards/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelLeaderboards} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getLeaderboards(raw?: true): Promise<RawResponse>;
    public async getLeaderboards(raw = false): Promise<HypixelLeaderboards | RawResponse> {
        return await this.request("leaderboards", raw as any, this.leaderboardsSchema, (v) => v.leaderboards);
    }

    /**
     * Retrieve an array of the latest Hypixel SkyBlock news posts from the Hypixel API via the `/skyblock/news`
     *   endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1news/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSkyBlockNews} array.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with an array of {@link HypixelSkyBlockNews} objects.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockNews(raw?: false): Promise<HypixelSkyBlockNews[]>;
    /**
     * Retrieve an array of the latest Hypixel SkyBlock news posts from the Hypixel API via the `/skyblock/news`
     *   endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1news/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSkyBlockNews} array.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if an invalid Hypixel API key was provided to the constructor.
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockNews(raw?: true): Promise<RawResponse>;
    public async getSkyBlockNews(raw = false): Promise<HypixelSkyBlockNews[] | RawResponse> {
        return await this.request("skyblock/news", raw as any, this.skyBlockNewsSchema, (v) => v.items);
    }

    /**
     * Retrieve a page of currently active SkyBlock auctions from the Hypixel API via the `/skyblock/auctions`
     *   endpoint. This data is paginated, and is cached by Hypixel for 60 seconds at a time. This method does not
     *   contribute towards your rate limit cap.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1auction/get
     * @param page The page number to fetch. Pages are zero-indexed, meaning the first page is page `0`.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSkyBlockAuctions} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link HypixelSkyBlockAuctions} object.
     * @throws
     * - `Error` if the passed page number does not exist.
     * - `Error` if Hypixel is currently accumulating the list of auctions and is not ready to respond to your request.
     *   Try again shortly.
     * - `Error` if the HTTP request to the Hypixel API failed
     */
    public async getSkyBlockAuctions(page?: number, raw?: false): Promise<HypixelSkyBlockAuctions>;
    /**
     * Retrieve a page of currently active SkyBlock auctions from the Hypixel API via the `/skyblock/auctions`
     *   endpoint. This data is paginated, and is cached by Hypixel for 60 seconds at a time. This method does not
     *   contribute towards your rate limit cap.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1auction/get
     * @param page The page number to fetch. Pages are zero-indexed, meaning the first page is page `0`.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSkyBlockAuctions} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if the passed page number does not exist.
     * - `Error` if Hypixel is currently accumulating the list of auctions and is not ready to respond to your request.
     *   Try again shortly.
     * - `Error` if the HTTP request to the Hypixel API failed
     */
    public async getSkyBlockAuctions(page?: number, raw?: true): Promise<RawResponse>;
    public async getSkyBlockAuctions(page?: number, raw = false): Promise<HypixelSkyBlockAuctions | RawResponse> {
        return await this.request(`skyblock/auctions?page=${page ?? 0}`, raw as any, this.skyBlockAuctionsSchema)
    }

    /**
     * Retrieve a currently active SkyBlock auction from its auction ID from the Hypixel API via the `/skyblock/auction`
     *   endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1auction/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSkyBlockAuction} object.
     *   The raw response will bypass runtime type checking.
     * @param id The ID of the auction to fetch. This is a v4 UUID, with or without dashes.
     * @returns A `Promise` that resolves with a {@link HypixelSkyBlockAuction} object, or `null` if an auction with the
     *   given ID could not be found.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockAuctionById(id: string, raw?: false): Promise<HypixelSkyBlockAuction | null>;
    /**
     * Retrieve a currently active SkyBlock auction from its auction ID from the Hypixel API via the `/skyblock/auction`
     *   endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1auction/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSkyBlockAuction} object.
     *   The raw response will bypass runtime type checking.
     * @param id The ID of the auction to fetch. This is a v4 UUID, with or without dashes.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockAuctionById(id: string, raw?: true): Promise<RawResponse>;
    public async getSkyBlockAuctionById(id: string, raw = false): Promise<HypixelSkyBlockAuction | null | RawResponse> {
        return await this.request(`skyblock/auctions?uuid=${id}`, raw as any, this.skyBlockAuctionSchema, (v) => v.auctions?.[0] ?? null)
    }

    /**
     * Retrieve a list of currently active SkyBlock auctions started by a given player from the Hypixel API via the
     *   `/skyblock/auction` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1auction/get
     * @param raw Whether to return the raw {@link RawResponse} instead of an array of {@link HypixelSkyBlockAuction}
     *   objects. The raw response will bypass runtime type checking.
     * @param playerUuid The UUID of the player whose auctions should be fetched.
     * @returns A `Promise` that resolves with an array of {@link HypixelSkyBlockAuction} objects.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockAuctionsByPlayer(playerUuid: string, raw?: false): Promise<HypixelSkyBlockAuction[]>;
    /**
     * Retrieve a list of currently active SkyBlock auctions started by a given player from the Hypixel API via the
     *   `/skyblock/auction` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1auction/get
     * @param raw Whether to return the raw {@link RawResponse} instead of an array of {@link HypixelSkyBlockAuction}
     *   objects. The raw response will bypass runtime type checking.
     * @param playerUuid The UUID of the player whose auctions should be fetched.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockAuctionsByPlayer(playerUuid: string, raw?: true): Promise<RawResponse>;
    public async getSkyBlockAuctionsByPlayer(playerUuid: string, raw = false): Promise<HypixelSkyBlockAuction[] | RawResponse> {
        return await this.request(`skyblock/auctions?player=${playerUuid}`, raw as any, this.skyBlockAuctionSchema, (v) => v.auctions ?? [])
    }

    /**
     * Retrieve a list of currently active SkyBlock auctions started by a given SkyBlock profile from the Hypixel API
     *   via the `/skyblock/auction` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1auction/get
     * @param raw Whether to return the raw {@link RawResponse} instead of an array of {@link HypixelSkyBlockAuction}
     *   objects. The raw response will bypass runtime type checking.
     * @param profileId The ID of the SkyBlock profile whose auctions should be fetched. This should be a v4 UUID.
     * @returns A `Promise` that resolves with an array of {@link HypixelSkyBlockAuction} objects.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockAuctionsByProfile(profileId: string, raw?: false): Promise<HypixelSkyBlockAuction[]>;
    /**
     * Retrieve a list of currently active SkyBlock auctions started by a given SkyBlock profile from the Hypixel API
     *   via the `/skyblock/auction` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1auction/get
     * @param raw Whether to return the raw {@link RawResponse} instead of an array of {@link HypixelSkyBlockAuction}
     *   objects. The raw response will bypass runtime type checking.
     * @param profileId The ID of the SkyBlock profile whose auctions should be fetched. This should be a v4 UUID.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockAuctionsByProfile(profileId: string, raw?: true): Promise<RawResponse>;
    public async getSkyBlockAuctionsByProfile(profileId: string, raw = false): Promise<HypixelSkyBlockAuction[] | RawResponse> {
        return await this.request(`skyblock/auctions?profile=${profileId}`, raw as any, this.skyBlockAuctionSchema, (v) => v.auctions ?? [])
    }

    /**
     * Retrieve a list of SkyBlock auctions that ended within the last 60 seconds from the Hypixel API via the
     *   `/skyblock/auctions_ended` endpoint. This data is cached by Hypixel for 60 seconds at a time. This method does
     *   not contribute towards your rate limit cap.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1auctions_ended/get
     * @param raw Whether to return the raw {@link RawResponse} instead of an array of {@link HypixelSkyBlockEndedAuction}
     *   objects. The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with an array of {@link HypixelSkyBlockEndedAuction} objects.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     */
    public async getSkyBlockEndedAuctions(raw?: false): Promise<HypixelSkyBlockEndedAuction[]>;
    /**
     * Retrieve a list of SkyBlock auctions that ended within the last 60 seconds from the Hypixel API via the
     *   `/skyblock/auctions_ended` endpoint. This data is cached by Hypixel for 60 seconds at a time. This method does
     *   not contribute towards your rate limit cap.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1auctions_ended/get
     * @param raw Whether to return the raw {@link RawResponse} instead of an array of {@link HypixelSkyBlockEndedAuction}
     *   objects. The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     */
    public async getSkyBlockEndedAuctions(raw?: true): Promise<RawResponse>;
    public async getSkyBlockEndedAuctions(raw = false): Promise<HypixelSkyBlockEndedAuction[] | RawResponse> {
        return await this.request(`skyblock/auctions_ended`, raw as any, this.skyBlockEndedAuctionsSchema, (v) => v.auctions ?? [])
    }

    /**
     * Retrieve a list of products for sale in the SkyBlock bazaar from the Hypixel API via the `/skyblock/bazaar`
     *   endpoint. This data is cached by Hypixel for 60 seconds at a time. This method does not contribute towards your
     *   rate limit cap. The response is a map of item IDs in CAMEL_CASE to {@link HypixelSkyBlockBazaarProduct} objects.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1bazaar/get
     * @see {@link HypixelSkyBlockItem}
     * @param raw Whether to return the raw {@link RawResponse} instead of a map of item IDs to
     *   {@link HypixelSkyBlockBazaarProduct} objects. The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with an object mapping CAMEL_CASE item IDs to
     *   {@link HypixelSkyBlockBazaarProduct} objects.
     * @throws
     * - `Error` if Hypixel is currently accumulating the list of auctions and is not ready to respond to your request.
     *   Try again shortly.
     * - `Error` if the HTTP request to the Hypixel API failed
     */
    public async getSkyBlockBazaarProducts(raw?: false): Promise<Record<string, HypixelSkyBlockBazaarProduct>>;
    /**
     * Retrieve a list of products for sale in the SkyBlock bazaar from the Hypixel API via the `/skyblock/bazaar`
     *   endpoint. This data is cached by Hypixel for 60 seconds at a time. This method does not contribute towards your
     *   rate limit cap. The response is a map of item IDs in CAMEL_CASE to {@link HypixelSkyBlockBazaarProduct} objects.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1bazaar/get
     * @see {@link HypixelSkyBlockItem}
     * @param raw Whether to return the raw {@link RawResponse} instead of a map of item IDs to
     *   {@link HypixelSkyBlockBazaarProduct} objects. The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if Hypixel is currently accumulating the list of auctions and is not ready to respond to your request.
     *   Try again shortly.
     * - `Error` if the HTTP request to the Hypixel API failed
     */
    public async getSkyBlockBazaarProducts(raw?: true): Promise<RawResponse>;
    public async getSkyBlockBazaarProducts(raw = false): Promise<Record<string, HypixelSkyBlockBazaarProduct> | RawResponse> {
        return await this.request(`skyblock/bazaar`, raw as any, this.skyBlockBazaarSchema, (v) => v.products ?? {})
    }

    /**
     * Retrieve data about a SkyBlock profile from the Hypixel API via the `/skyblock/profile` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1profile/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSkyBlockProfile} object.
     *   The raw response will bypass runtime type checking.
     * @param profileId The ID of the SkyBlock profile to fetch. This should be a v4 UUID.
     * @returns A `Promise` that resolves with a {@link HypixelSkyBlockProfile}, or null if the profile does not exist.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockProfile(profileId: string, raw?: false): Promise<HypixelSkyBlockProfile | null>;
    /**
     * Retrieve data about a SkyBlock profile from the Hypixel API via the `/skyblock/profile` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1profile/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSkyBlockProfile} object.
     *   The raw response will bypass runtime type checking.
     * @param profileId The ID of the SkyBlock profile to fetch. This should be a v4 UUID.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockProfile(profileId: string, raw?: true): Promise<RawResponse>;
    public async getSkyBlockProfile(profileId: string, raw = false): Promise<HypixelSkyBlockProfile | null | RawResponse> {
        return await this.request(`skyblock/profile?profile=${profileId}`, raw as any, this.skyBlockProfileSchema, (v) => v.profile ?? null);
    }

    /**
     * Retrieve an array of a player's SkyBlock profiles from the Hypixel API via the `/skyblock/profiles` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1profiles/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSkyBlockProfile} object.
     *   The raw response will bypass runtime type checking.
     * @param playerUuid The UUID of the player whose profiles should be fetched.
     * @returns A `Promise` that resolves with an array of {@link HypixelSkyBlockProfile} objects.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockProfiles(playerUuid: string, raw?: false): Promise<HypixelSkyBlockProfile[]>;
    /**
     * Retrieve an array of a player's SkyBlock profiles from the Hypixel API via the `/skyblock/profiles` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1profiles/get
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link HypixelSkyBlockProfile} object.
     *   The raw response will bypass runtime type checking.
     * @param playerUuid The UUID of the player whose profiles should be fetched.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockProfiles(playerUuid: string, raw?: true): Promise<RawResponse>;
    public async getSkyBlockProfiles(playerUuid: string, raw = false): Promise<HypixelSkyBlockProfile[] | RawResponse> {
        return await this.request(`skyblock/profiles?uuid=${playerUuid}`,  raw as any, this.skyBlockProfilesSchema, (v) => v.profiles ?? [])
    }

    /**
     * Retrieve the museum data for a SkyBlock profile from the Hypixel API via the `/skyblock/museum` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1museum/get
     * @param raw Whether to return the raw {@link RawResponse} instead of the parsed museum data.
     *   The raw response will bypass runtime type checking.
     * @param profileId The ID of the SkyBlock profile to fetch the museum data for. This should be a v4 UUID.
     * @returns A `Promise` that resolves with an object mapping the UUIDs of each player in the profile to their
     *   respective {@link HypixelSkyBlockMuseum} values.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockMuseums(profileId: string, raw?: false): Promise<Record<string, HypixelSkyBlockMuseum>>;
    /**
     * Retrieve the museum data for a SkyBlock profile from the Hypixel API via the `/skyblock/museum` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1museum/get
     * @param raw Whether to return the raw {@link RawResponse} instead of the parsed museum data.
     *   The raw response will bypass runtime type checking.
     * @param profileId The ID of the SkyBlock profile to fetch the museum data for. This should be a v4 UUID.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockMuseums(profileId: string, raw?: true): Promise<RawResponse>;
    public async getSkyBlockMuseums(profileId: string, raw = false): Promise<Record<string, HypixelSkyBlockMuseum> | RawResponse> {
        return await this.request(`skyblock/museum?profile=${profileId}`, raw as any, this.skyBlockMuseumSchema, (v) => v.members ?? {})
    }

    /**
     * Retrieve an array of a player's SkyBlock bingo profiles from the Hypixel API via the `/skyblock/bingo` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1bingo/get
     * @param raw Whether to return the raw {@link RawResponse} instead of an array of
     *   {@link HypixelSkyBlockBingoProfile} objects. The raw response will bypass runtime type checking.
     * @param playerUuid The UUID of the player whose bingo profiles should be fetched.
     * @returns A `Promise` that resolves with an array of {@link HypixelSkyBlockBingoProfile} objects.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockBingoProfiles(playerUuid: string, raw?: false): Promise<HypixelSkyBlockBingoProfile[]>;
    /**
     * Retrieve an array of a player's SkyBlock bingo profiles from the Hypixel API via the `/skyblock/bingo` endpoint.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1bingo/get
     * @param raw Whether to return the raw {@link RawResponse} instead of an array of
     *   {@link HypixelSkyBlockBingoProfile} objects. The raw response will bypass runtime type checking.
     * @param playerUuid The UUID of the player whose bingo profiles should be fetched.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     * - `Error` if the Hypixel API rate limit has been reached. {@link APIOptions.deferPolicy} can help avoid this.
     *   Can occur if the API has an emergency global throttle applied as well.
     */
    public async getSkyBlockBingoProfiles(playerUuid: string, raw?: true): Promise<RawResponse>;
    public async getSkyBlockBingoProfiles(playerUuid: string, raw = false): Promise<HypixelSkyBlockBingoProfile[] | RawResponse> {
        return await this.request(`skyblock/bingo?uuid=${playerUuid}`, raw as any, this.skyBlockBingoProfileSchema, (v) => v.events ?? [])
    }

    /**
     * Retrieve an array of active or upcoming SkyBlock firesales from the Hypixel API via the `/skyblock/firesales`
     *   endpoint. This method does not contribute towards your rate limit cap.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1firesales/get
     * @param raw Whether to return the raw {@link RawResponse} instead of an array of {@link HypixelSkyBlockFiresale}
     *   objects. The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with an array of {@link HypixelSkyBlockFiresale} objects.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     */
    public async getSkyBlockFiresales(raw?: false): Promise<HypixelSkyBlockFiresale[]>;
    /**
     * Retrieve an array of active or upcoming SkyBlock firesales from the Hypixel API via the `/skyblock/firesales`
     *   endpoint. This method does not contribute towards your rate limit cap.
     * @see https://api.hypixel.net/#tag/SkyBlock/paths/~1skyblock~1firesales/get
     * @param raw Whether to return the raw {@link RawResponse} instead of an array of {@link HypixelSkyBlockFiresale}
     *   objects. The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Hypixel API.
     * @throws
     * - `Error` if the HTTP request to the Hypixel API failed
     */
    public async getSkyBlockFiresales(raw?: true): Promise<RawResponse>;
    public async getSkyBlockFiresales(raw = false): Promise<HypixelSkyBlockFiresale[] | RawResponse> {
        return await this.request(`skyblock/firesales`, raw as any, this.skyBlockFiresalesSchema, (v) => v.sales ?? [])
    }

    /**
     * @internal
     * @protected
     */
    protected genHeaders(): Headers {
        const headers = super.genHeaders();
        headers.set("API-Key", this.options.apiKey);
        return headers;
    }

    /**
     * @internal
     * @param options
     * @protected
     */
    protected parseOptions(options: HypixelAPIOptions): NonOptional<HypixelAPIOptions> {
        return Object.freeze({
            ...this.parseDefaultOptions(options),
            apiKey: options.apiKey,
            // default defer policy based on Rate limit headers
            deferPolicy: options.deferPolicy ? options.deferPolicy : new RateLimitDeferPolicy(
                "RateLimit-Limit",
                "RateLimit-Remaining",
                "RateLimit-Reset",
                300_000
            )
        })
    }
}
