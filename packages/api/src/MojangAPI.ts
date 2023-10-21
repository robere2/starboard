import {APIOptions, BaseAPI} from "./BaseAPI";
import {ParsedOptions} from "./util";
import * as crypto from "crypto";
import {MojangProfile} from "./MojangProfile";

export class MojangAPI extends BaseAPI<APIOptions> {

    private static readonly IP_REGEX = /^(?:\d{1,3}\.){3}\d{1,3}|(?:\d{1,3}\.){1,3}\*$/

    private accessToken?: string;
    constructor(options?: APIOptions) {
        super(options ?? {});
    }

    public authorize(accessToken: string | undefined): this {
        this.accessToken = accessToken;
        return this;
    }

    public async getUuid(name: string): Promise<string | null> {
        // Request Mojang API with the user agent injected if it is set. Otherwise, Node default is used.
        const res = await this.options.httpClient.fetch(new Request(`https://api.mojang.com/users/profiles/minecraft/${name}`));

        if(res.ok) {
            const json = await res.json();
            if(typeof json !== "object" || json === null) {
                throw new Error('Request to Mojang API failed', {
                    cause: json
                })
            }
            return (json as Record<string, any>).id;
        } else {
            throw new Error('Request to Mojang API failed', {
                cause: await res.json()
            })
        }
    }

    public async getProfile(uuid: string): Promise<MojangProfile | null> {
        const res = await this.options.httpClient.fetch(new Request(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`));
        if(res.ok) {
            const json = await res.json();
            if(typeof json !== "object" || json === null) {
                throw new Error('Request to Mojang API failed', {
                    cause: json
                })
            }
            return new MojangProfile(json);
        } else {
            throw new Error('Request to Mojang API failed', {
                cause: await res.json()
            })
        }
    }

    public async getBlockedServerHashes(): Promise<string[]> {
        const res = await this.options.httpClient.fetch(new Request("https://sessionserver.mojang.com/blockedservers"));
        if(res.ok) {
            return (await res.text()).split('\n');
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
     *   subdomain/octet (e.g. dev.mc.hypixel.net -> *.mc.hypixel.net, and 192.168.0.1 -> 192.168.0.*). This process
     *   continues up to the TLD/the highest octet (e.g. *.net, and 192.*). If a matching hash is found within the
     *   list then the server is blocked by Mojang and true is returned.
     * @param serverAddress
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
     *   address itself along with addresses with wildcards placed in each subdomain location, except for the TLD.
     *   For example, for the server address "mc.hypixel.net", the returned strings will be:
     *     - mc.hypixel.net
     *     - *.hypixel.net
     *     - *.net
     *   If an IPv4 address is supplied, the order of wildcards is reversed. For example, for the IP address
     *   "192.168.1.1", the returned strings will be:
     *     - 192.168.1.1
     *     - 192.168.1.*
     *     - 192.168.*
     *     - 192.*
     *   This is a recursive algorithm.
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

    protected parseOptions(options: APIOptions): ParsedOptions<APIOptions> {
        return this.parseDefaultOptions(options);
    }
}
