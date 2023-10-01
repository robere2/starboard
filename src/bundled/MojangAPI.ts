import packageJson from "../../package.json";

export type MojangAPIOptions = {
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
     * The user agent to provide to the Mojang API servers. Defaults to "Starboard <Version>", e.g. "Starboard v1.0.0".
     *   If you would like to use Bun's default user agent, set this to null.
     */
    userAgent?: string | null;
}

export class MojangAPI {

    constructor(public readonly options?: MojangAPIOptions) {}

    public async getUuid(name: string): Promise<string | null> {
        // Request Mojang API with the user agent injected if it is set. Otherwise, Bun default is used.
        const res = await fetch(new Request(`https://api.mojang.com/users/profiles/minecraft/${name}`,  {
            headers: this.genHeaders()
        }));

        if(res.ok) {
            const json = await res.json();
            return json.id;
        } else {
            throw new Error('Request to Mojang API failed', {
                cause: await res.json()
            })
        }
    }

    private genHeaders(): Headers {
        const headers = new Headers();
        if(this.options?.userAgent) {
            headers.set("User-Agent", this.options.userAgent);
        } else if(this.options?.userAgent === undefined) {
            headers.set("User-Agent", `Starboard v${packageJson.version}`);
        }
        return headers;
    }
}
