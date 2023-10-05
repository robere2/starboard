import {HypixelPlayer, HypixelPlayerResponse} from "./HypixelPlayer.ts";
import {MojangAPI} from "../../MojangAPI.ts";
import {ParsedOptions, UUID_REGEX} from "../../../util.ts";
import {HttpClient} from "../../http/HttpClient.ts";
import {BaseAPI} from "../../BaseAPI.ts";
import {HypixelRecentGame, HypixelRecentGamesResponse} from "./HypixelRecentGame.ts";
import {HypixelSession, HypixelStatusResponse} from "./HypixelSession.ts";
import {HypixelGuild, HypixelGuildResponse} from "./HypixelGuild.ts";
import {HypixelGame, HypixelGamesResponse} from "./resources/HypixelGame.ts";
import {HypixelAchievementsResponse, HypixelGameAchievements} from "./resources/HypixelGameAchievements.ts";
import {HypixelChallenge, HypixelChallengeResponse} from "./resources/HypixelChallenge.ts";
import {HypixelQuest, HypixelQuestResponse} from "./resources/HypixelQuest.ts";
import {HypixelGuildAchievements, HypixelGuildAchievementsResponse} from "./resources/HypixelGuildAchievements.ts";
import {HypixelPet, HypixelPetRarity, HypixelPetsResponse} from "./resources/HypixelPet.ts";
import {HypixelCompanion, HypixelCompanionRarity, HypixelCompanionsResponse} from "./resources/HypixelCompanion.ts";
import {
    HypixelSkyBlockCollection,
    HypixelSkyBlockCollectionsResponse
} from "./resources/skyblock/HypixelSkyBlockCollection.ts";
import {HypixelSkyBlockItem, HypixelSkyBlockItemsResponse} from "./resources/skyblock/HypixelSkyBlockItem.ts";
import {HypixelSkyBlockSkill, HypixelSkyBlockSkillsResponse} from "./resources/skyblock/HypixelSkyBlockSkill.ts";

const HYPIXEL_API_URL = "https://api.hypixel.net";
const MONGODB_ID_REGEX = /^[0-9a-f]{24}$/i;

export type HypixelAPIOptions = {
    /**
     * API key to use in requests to the Hypixel API. Should be a valid UUID with or without dashes retrieved from
     *   https://developer.hypixel.net/dashboard. An invalid UUID will result in 403 error responses from the API.
     */
    apiKey: string;
    /**
     * Rate limit usage percentage at which to enable queuing requests to help ensure that your over-usage of the API
     *   doesn't get 429 rate limited. Should be a number between 0.0 and 1.0, where 0.0 means enable queueing after 0%
     *   of the rate limit has been used (i.e. all requests) and 1.0 means enable queueing after 100% (i.e. no
     *   requests). Once the queue is in use, this will use the rate limit headers found in the response from the API
     *   to determine how much time needs to pass before another request can be made to ensure that not all requests are
     *   used up before the rate limit timer resets. Requests will then be processed in the queue with the required
     *   delay between each request. This value can also be a boolean, where `true` means enable queueing at any
     *   percentage (same as providing 0.0) and `false` means disable queueing entirely (same as providing 1.0).
     */
    defer?: boolean | number;
    /**
     * Custom HTTP client to use for HTTP requests to the Mojang API. If not provided, a default HTTP client will be
     *   used, which simply uses the {@link fetch} function. Custom HTTP clients are particularly useful for
     *   test suites where you want to mock an HTTP request. Custom clients can also be useful for adding custom logging
     *   or error handling for HTTP requests.
     */
    httpClient?: HttpClient;
}

export type HypixelAPIErrorDef = {
    success: false,
    cause: string,
    throttle?: boolean,
    global?: boolean
}

export type HypixelAPIValue<T> = {
    readonly [P in keyof T]?: HypixelAPIValue<T[P]>;
}

export type HypixelAPIResponse<T> = ({
    success: true;
} & HypixelAPIValue<T>) | HypixelAPIErrorDef;

/**
 * Interface for requesting data from the Hypixel API. Caching is not built-in.
 */
export class HypixelAPI extends BaseAPI<HypixelAPIOptions> {
    private readonly mojangApi: MojangAPI;

    /**
     * Construct an interface to connect to the Hypixel API with your preferred settings
     * @param options Options to use in Hypixel API requests. An API key is required, but all other options are
     *   optional.
     */
    public constructor(options: HypixelAPIOptions) {
        super(options);
        this.mojangApi = new MojangAPI()
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
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(name: string, direct?: boolean): Promise<HypixelPlayer | null>;
    /**
     * Retrieve data of a specific player, including game stats. If the player is not found, null is returned. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param uuid The UUID of the player. If the UUID is not found, null is returned.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(uuid: string): Promise<HypixelPlayer | null>;
    /**
     * Retrieve up-to-date data of a specific player, including game stats. If the player is not found, null is
     *   returned, however this should never happen unless you constructed the HypixelPlayer object yourself. Request
     *   to API could be delayed depending on the `defer` option provided to the constructor.
     * @see https://api.hypixel.net/#tag/Player-Data/paths/~1player/get Hypixel API reference
     * @param player HypixelPlayer instance with the UUID of the player you're looking for data for.
     * @throws Error if an invalid Hypixel API key was provided to the constructor.
     * @throws Error if the HTTP request to the Hypixel API failed
     * @throws Error if the Hypixel API rate limit has been reached and request deferring was disabled in the
     *   constructor. Can occur if the API has an emergency global throttle applied as well.
     * @returns HypixelPlayer object containing all the data of the player, or null if the player is not found.
     */
    public async getPlayer(player: HypixelPlayer): Promise<HypixelPlayer | null>;
    public async getPlayer(player: string | HypixelPlayer, direct: boolean = false): Promise<HypixelPlayer | null> {
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
        if(json.success) {
            return new HypixelPlayer(json.player ?? {});
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            })
        }
    }

    public async getRecentGames(uuid: string): Promise<HypixelRecentGame[]>;
    public async getRecentGames(player: HypixelPlayer): Promise<HypixelRecentGame[]>;
    public async getRecentGames(player: string | HypixelPlayer): Promise<HypixelRecentGame[]> {
        const uuid = player instanceof HypixelPlayer ? player.uuid : player;
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/recentgames?uuid=${uuid}`, {
            headers: this.genHeaders()
        })
        const json: HypixelRecentGamesResponse = await res.json();
        if(json.success) {
            if(!json.games) {
                return [];
            }
            if(!Array.isArray(json.games)) {
                throw new Error("Hypixel API Error", {
                    cause: "games is not an array"
                })
            }
            return json.games.map(game => new HypixelRecentGame(game));
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            })
        }
    }

    public async getStatus(uuid: string): Promise<HypixelSession | null>;
    public async getStatus(player: HypixelPlayer): Promise<HypixelSession | null>;
    public async getStatus(player: string | HypixelPlayer): Promise<HypixelSession | null> {
        const uuid = player instanceof HypixelPlayer ? player.uuid : player;
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/status?uuid=${uuid}`, {
            headers: this.genHeaders()
        })
        const json: HypixelStatusResponse = await res.json();
        if(json.success) {
            return json.session ? new HypixelSession(json.session) : null;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            })
        }
    }

    public async getGuild(id: string): Promise<HypixelGuild | null>;
    public async getGuild(name: string): Promise<HypixelGuild | null>;
    public async getGuild(player: HypixelPlayer): Promise<HypixelGuild | null>;
    public async getGuild(playerUuid: string): Promise<HypixelGuild | null>;
    public async getGuild(input: string | HypixelPlayer): Promise<HypixelGuild | null> {
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
        if(json.success) {
            return json.guild ? new HypixelGuild(json.guild) : null;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            })
        }
    }

    public async getGames(): Promise<Record<string, HypixelGame>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/games`, {
            headers: this.genHeaders()
        });
        const json: HypixelGamesResponse = await res.json();
        if(json.success) {
            if(!json.games) {
                return {};
            }

            // Hypixel API response is not actual HypixelGame objects. HypixelGame constructor performs type checks
            const typedGames = json.games as Record<string, HypixelGame>
            for(const prop in typedGames) {
                typedGames[prop] = new HypixelGame(typedGames[prop]);
            }

            return typedGames;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getAchievements(): Promise<Record<string, HypixelGameAchievements>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/achievements`, {
            headers: this.genHeaders()
        });
        const json: HypixelAchievementsResponse = await res.json();
        if(json.success) {
            if(!json.achievements) {
                return {};
            }

            // Hypixel API response is not actual HypixelGameAchievements objects. HypixelGameAchievements constructor performs type checks
            const typedAchievements = json.achievements as Record<string, HypixelGameAchievements>
            for(const prop in typedAchievements) {
                typedAchievements[prop] = new HypixelGameAchievements(typedAchievements[prop]);
            }

            return typedAchievements;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getChallenges(): Promise<Record<string, HypixelChallenge[]>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/challenges`, {
            headers: this.genHeaders()
        });
        const json: HypixelChallengeResponse = await res.json();
        if(json.success) {
            if(!json.challenges) {
                return {};
            }

            // Hypixel API response is not actual HypixelChallenge objects. HypixelChallenge constructor performs type checks
            const typedChallenges = json.challenges as Record<string, HypixelChallenge[]>
            for(const game in typedChallenges) {

                for(let i = 0; i < typedChallenges[game].length; i++) {
                    typedChallenges[game][i] = new HypixelChallenge(typedChallenges[game][i]);
                }
            }

            return typedChallenges;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getQuests(): Promise<Record<string, HypixelQuest[]>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/quests`, {
            headers: this.genHeaders()
        });
        const json: HypixelQuestResponse = await res.json();
        if(json.success) {
            if(!json.quests) {
                return {};
            }

            // Hypixel API response is not actual HypixelQuest objects. HypixelQuest constructor performs type checks
            const typedQuests = json.quests as Record<string, HypixelQuest[]>
            for(const game in typedQuests) {
                for(let i = 0; i < typedQuests[game].length; i++) {
                    typedQuests[game][i] = new HypixelQuest(typedQuests[game][i]);
                }
            }

            return typedQuests;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getGuildAchievements(): Promise<HypixelGuildAchievements> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/guilds/achievements`, {
            headers: this.genHeaders()
        });
        const json: HypixelGuildAchievementsResponse = await res.json();
        if(json.success) {
            return new HypixelGuildAchievements({
                one_time: json?.one_time ?? {},
                tiered: json.tiered ?? {}
            })
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getPets(): Promise<HypixelPet[]> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/vanity/pets`, {
            headers: this.genHeaders()
        });
        const json: HypixelPetsResponse = await res.json();
        if(json.success) {
            if(!json.types) {
                return [];
            }

            const pets: HypixelPet[] = [];
            for(const pet of json.types) {
                if(!pet) {
                    continue;
                }
                pets.push(new HypixelPet(pet));
            }
            return pets;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getPetRarities(): Promise<HypixelPetRarity[]> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/vanity/pets`, {
            headers: this.genHeaders()
        });
        const json: HypixelPetsResponse = await res.json();
        if(json.success) {
            if(!json.rarities) {
                return [];
            }

            const rarities: HypixelPetRarity[] = [];
            for(const rarity of json.rarities) {
                if(!rarity) {
                    continue;
                }
                rarities.push(new HypixelPetRarity(rarity));
            }
            return rarities;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getCompanions(): Promise<HypixelCompanion[]> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/vanity/companions`, {
            headers: this.genHeaders()
        });
        const json: HypixelCompanionsResponse = await res.json();
        if(json.success) {
            if(!json.types) {
                return [];
            }

            const companions: HypixelCompanion[] = [];
            for(const companion of json.types) {
                if(!companion) {
                    continue;
                }
                companions.push(new HypixelCompanion(companion));
            }
            return companions;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getCompanionRarities(): Promise<HypixelCompanionRarity[]> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/vanity/companions`, {
            headers: this.genHeaders()
        });
        const json: HypixelCompanionsResponse = await res.json();
        if(json.success) {
            if(!json.rarities) {
                return [];
            }

            const rarities: HypixelCompanionRarity[] = [];
            for(const rarity of json.rarities) {
                if(!rarity) {
                    continue;
                }
                rarities.push(new HypixelCompanionRarity(rarity));
            }
            return rarities;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockCollections(): Promise<Record<string,HypixelSkyBlockCollection>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/skyblock/collections`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockCollectionsResponse = await res.json();
        if(json.success) {
            if(!json.collections) {
                return {};
            }

            const collections: Record<string, HypixelSkyBlockCollection> = {};
            for(const collection in json.collections) {
                if(!json.collections[collection]) {
                    continue;
                }
                collections[collection] = new HypixelSkyBlockCollection(json.collections[collection] as HypixelSkyBlockCollection);
            }

            return collections;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockSkills(): Promise<Record<string, HypixelSkyBlockSkill>> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/skyblock/skills`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockSkillsResponse = await res.json();
        if(json.success) {
            if(!json.collections) {
                return {};
            }

            const skills: Record<string, HypixelSkyBlockSkill> = {};
            for(const skill in json.collections) {
                if(!skill) {
                    continue;
                }
                skills[skill] = new HypixelSkyBlockSkill(json.collections[skill] as HypixelSkyBlockSkill);
            }
            return skills;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            });
        }
    }

    public async getSkyBlockItems(): Promise<HypixelSkyBlockItem[]> {
        const res = await this.options.httpClient.fetch(`${HYPIXEL_API_URL}/resources/skyblock/items`, {
            headers: this.genHeaders()
        });
        const json: HypixelSkyBlockItemsResponse = await res.json();
        if(json.success) {
            if(!json.items) {
                return [];
            }

            const items: HypixelSkyBlockItem[] = [];
            for(const item of json.items) {
                if(!item) {
                    continue;
                }
                items.push(new HypixelSkyBlockItem(item));
            }
            return items;
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
