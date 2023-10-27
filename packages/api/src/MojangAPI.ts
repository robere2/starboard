import {APIOptions, BaseAPI, RawResponse} from "./BaseAPI";
import {NonOptional} from "./util";
import * as crypto from "crypto";
import {MojangProfile, UuidToProfileSchema, MojangUsernameToUuidSchema} from "./schemas";

/**
 * Interface for requesting data from the Mojang API.
 *
 * While the Mojang API has a rate limit for many endpoints, request debouncing currently isn't built into the
 * Mojang API interface. (TODO)
 *
 * @example
 * const mojang = new MojangAPI();
 *
 * const uuid = (await mojang.getUuid("Technoblade"))!; // v4 UUID string
 * const profile = (await mojang.getProfile(uuid))!; // MojangProfile
 * const skinUrl = profile.properties?.[0]?.value?.textures?.SKIN?.url; // URL string
 */
export class MojangAPI extends BaseAPI<APIOptions> {

    private static readonly IP_REGEX = /^(?:\d{1,3}\.){3}\d{1,3}|(?:\d{1,3}\.){1,3}\*$/

    private accessToken?: string;

    /**
     * Create a new instance of `MojangAPI`.
     * @param options Options to use when creating the `MojangAPI`.
     */
    public constructor(options?: APIOptions) {
        super(options ?? {});
    }

    /**
     * TODO
     * @param accessToken
     */
    public authorize(accessToken: string | undefined): this {
        this.accessToken = accessToken;
        return this;
    }

    /**
     * Get the Minecraft account UUID for a given username. If no player has the given username, `null` is returned.
     * The rate limit for this endpoint is IP-based, and has a limit of approximately 200 requests per minute.
     * @param name The Minecraft username to get the account UUID for.
     * @param raw Whether to return the raw {@link RawResponse} instead of a UUID.
     *   The raw response will bypass runtime type checking.
     * @returns A UUID v4 string, or `null` if an account couldn't be found for the given username.
     * @throws
     * - `Error` if the request to Mojang's servers fails or has a malformed response.
     * - `Error` if the Mojang rate limit is hit.
     */
    public async getUuid(name: string, raw?: false): Promise<string | null>;
    /**
     * Get the Minecraft account UUID for a given username. If no player has the given username, `null` is returned.
     * The rate limit for this endpoint is IP-based, and has a limit of approximately 200 requests per minute.
     * @param name The Minecraft username to get the account UUID for.
     * @param raw Whether to return the raw {@link RawResponse} instead of a UUID.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Mojang API.
     * @throws
     * - `Error` if the request to Mojang's servers fails or has a malformed response.
     * - `Error` if the Mojang rate limit is hit.
     */
    public async getUuid(name: string, raw?: true): Promise<RawResponse>;
    public async getUuid(name: string, raw = false): Promise<RawResponse | string | null> {
        return await this.request(`https://api.mojang.com/users/profiles/minecraft/${name}`, raw as any, MojangUsernameToUuidSchema, (res) => {
            // If either error or errorMessage are set, throw one of them (preferably errorMessage)
            if(res.error || res.errorMessage) {
                throw new Error(res.errorMessage ?? res.error!)
            }
            return res.id ?? null;
        })
    }

    /**
     * Get a Minecraft account's profile. Profile data includes the player's username, skin, cape, and character shape.
     * The rate limit for this endpoint is IP-based, and has a limit of approximately 200 requests per minute.
     * @param uuid The player's UUID, with or without dashes.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link MojangProfile} object.
     *   The raw response will bypass runtime type checking.
     * @returns A {@link MojangProfile} object, or `null` if a profile couldn't be found for the given UUID.
     * @throws
     * - `Error` if the request to Mojang's servers fails or has a malformed response.
     * - `Error` if the Mojang rate limit is hit.
     */
    public async getProfile(uuid: string, raw?: false): Promise<MojangProfile | null>;
    /**
     * Get a Minecraft account's profile. Profile data includes the player's username, skin, cape, and character shape.
     * The rate limit for this endpoint is IP-based, and has a limit of approximately 200 requests per minute.
     * @param uuid The player's UUID, with or without dashes.
     * @param raw Whether to return the raw {@link RawResponse} instead of a {@link MojangProfile} object.
     *   The raw response will bypass runtime type checking.
     * @returns A `Promise` that resolves with a {@link RawResponse} containing the raw data fetched from the Mojang API.
     * @throws
     * - `Error` if the request to Mojang's servers fails or has a malformed response.
     * - `Error` if the Mojang rate limit is hit.
     */
    public async getProfile(uuid: string, raw?: true): Promise<RawResponse>;
    public async getProfile(uuid: string, raw = false): Promise<RawResponse | MojangProfile | null> {
        return await this.request(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`, raw as any, UuidToProfileSchema, (res) => {
            // If either error or errorMessage are set, throw one of them (preferably errorMessage)
            if(res.errorMessage || res.error) {
                throw new Error(res.errorMessage ?? res.error!)
            }
            return res ?? null;
        })
    }

    /**
     * Get the list of SHA1 server address hashes blocked by Mojang. For more information about how blocked server
     *   addresses are hashed and checked, see {@link isServerBlocked} and
     *   {@link https://wiki.vg/Mojang_API#Blocked_Servers the Mojang documentation}. The rate limit for this endpoint
     *   is IP-based. Its limit is currently unknown.
     * @see {@link isServerBlocked}
     * @see https://wiki.vg/Mojang_API#Blocked_Servers
     * @returns a `Promise` that resolves to an array of strings, where each string is a SHA1 hash
     * @throws
     * - `Error` if the request to Mojang's servers fails or has a malformed response.
     * - `Error` if the Mojang rate limit is hit.
     */
    public async getBlockedServerHashes(): Promise<string[]> {
        // Regular expression to match a list of SHA1 strings separated by line breaks
        const regex = /^(?:[0-9a-f]{40}\n)*[0-9a-f]{40}$/
        const res = await this.options.httpClient.fetch(new Request("https://sessionserver.mojang.com/blockedservers"));
        if(res.ok) {
            const text = await res.text();
            if(!regex.test(text)) {
                throw new Error("Response from Mojang API is malformed", {
                    cause: text
                });
            }
            return text.split('\n');
        } else {
            throw new Error('Request to Mojang API failed', {
                cause: await res.text()
            });
        }
    }

    /**
     * Checks if a given Minecraft server address is blocked by Mojang. This is done by checking the list of blocked
     *   server hashes from the Mojang API and comparing the SHA1 hash of the provided server address against the list.
     *   If the server address hash is not found in the list, a wild card is applied to the highest specificity
     *   subdomain/octet (e.g. `dev.mc.hypixel.net` -> `*.mc.hypixel.net`, and `192.168.0.1` -> `192.168.0.*`). This process
     *   continues up to the TLD/the highest octet (e.g. `*.net`, and `192.*`). If a matching hash is found within the
     *   list then the server is blocked by Mojang and true is returned.
     * @param serverAddress The server's domain or IP address to check against the list of blocked server addresses.
     * @returns `true` if a Minecraft server address is blocked by Mojang, or `false` if not.
     * @throws
     * - `Error` if the request to Mojang's servers fails or has a malformed response.
     * - `Error` if the Mojang rate limit is hit.
     */
    public async isServerBlocked(serverAddress: string): Promise<boolean> {
        const hashes = await this.getBlockedServerHashes();
        const serverNamespaces = this.getServerNamespaces(serverAddress);
        for(const namespace  of serverNamespaces) {
            const hash = crypto.createHash('sha1').update(namespace).digest('hex');
            if(hashes.includes(hash)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets all strings used by Minecraft to test if a given server address is blocked. Minecraft tests the server
     * address itself along with addresses with wildcards placed in each subdomain location, except for the TLD.
     * For example, for the server address `mc.hypixel.net`, the returned strings will be:
     *
     * - `mc.hypixel.net`
     * - `*.hypixel.net`
     * - `*.net`
     *
     * If an IPv4 address is supplied, the order of wildcards is reversed. For example, for the IP address
     * `192.168.1.1`, the returned strings will be:
     *
     * - `192.168.1.1`
     * - `192.168.1.*`
     * - `192.168.*`
     * - `192.*`
     *
     * This is a recursive algorithm.
     * @param serverAddress The server address to test. A valid domain or IPv4 address is expected. Behavior is
     *   undefined when an invalid server address is provided. IPv6 addresses are not supported.
     * @returns An array of strings used by Minecraft to test if a Minecraft server address is blocked. The array
     *   is in order of most specific to least specific.
     * @protected
     */
    protected getServerNamespaces(serverAddress: string): string[] {
        let parts = serverAddress.split('.');
        const isIP = MojangAPI.IP_REGEX.test(serverAddress);

        // Breakout condition, top-level domains cannot be replaced with a wild card (i.e., *.net does not become *)
        if(parts.length <= 2) {
            return [serverAddress]
        }

        // IPv4 addresses have their wild cards applied in reverse order of domains. Parts are reversed and then
        //  reversed again later
        if(isIP) {
            parts = parts.reverse();
        }

        // If this address already has wildcards within it, we want to remove the wildcard and add it to the next level
        //  up in the domain. Otherwise, we just want to add a wildcard to the bottom level.
        if(parts[0] === '*') {
            parts = parts.slice(1);
        }
        parts[0] = '*';

        // IPv4 parts were previously reversed, now they need to be reversed again
        if(isIP) {
            parts = parts.reverse();
        }

        return [serverAddress, ...this.getServerNamespaces(parts.join('.'))];
    }

    /**
     * @internal
     * @param options
     * @protected
     */
    protected parseOptions(options: APIOptions): NonOptional<APIOptions> {
        return this.parseDefaultOptions(options);
    }
}
