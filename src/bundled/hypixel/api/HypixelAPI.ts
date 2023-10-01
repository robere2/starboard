import {HypixelPlayer, HypixelPlayerResponse} from "./HypixelPlayer.ts";
import {MojangAPI} from "../../MojangAPI.ts";
import packageJson from "../../../../package.json";
import {UUID_REGEX} from "../../../util.ts";

const HYPIXEL_API_URL = "https://api.hypixel.net";

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
     * The user agent to provide to the Hypixel API servers. Defaults to "Starboard <Version>", e.g. "Starboard v1.0.0".
     *   If you would like to use Bun's default user agent, set this to null.
     */
    userAgent?: string | null;
}

/**
 * Interface for requesting data from the Hypixel API. Caching is not built-in.
 */
export class HypixelAPI {
    private readonly options: HypixelAPIOptions;
    private readonly mojangApi: MojangAPI;

    /**
     * Construct an interface to connect to the Hypixel API with your preferred settings
     * @param options Options to use in Hypixel API requests. An API key is required, but all other options are
     *   optional.
     */
    public constructor(options: HypixelAPIOptions) {
        this.options = Object.freeze(options);
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
    public async getPlayer(nameOrUuid: string, direct: boolean = false): Promise<HypixelPlayer | null> {
        // Hypixel API request is generated based on the two provided inputs
        let hypixelRequest: Request;
        if(UUID_REGEX.test(nameOrUuid)) {
            hypixelRequest = new Request(`${HYPIXEL_API_URL}/player?uuid=${nameOrUuid}`, {
                headers: this.genHeaders()
            });
        } else {
            const name = nameOrUuid; // Rename variable to make code clearer
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
        const res = await fetch(hypixelRequest);
        const json: HypixelPlayerResponse = await res.json();
        if(json.success) {
            return json.player;
        } else {
            throw new Error("Hypixel API Error", {
                cause: json.cause
            })
        }
    }

    private genHeaders(): Headers {
        const headers = new Headers();
        headers.set("API-Key", this.options.apiKey);
        if(this.options.userAgent) {
            headers.set("User-Agent", this.options.userAgent);
        } else if(this.options.userAgent === undefined) {
            headers.set("User-Agent", `Starboard v${packageJson.version}`);
        }
        return headers;
    }
}
