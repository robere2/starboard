import packageJson from "../../../package.json";
import {Cache} from "../cache/Cache.ts";
import crypto from "crypto";

/**
 * Because of Bun issue [#6348](https://github.com/oven-sh/bun/issues/6348), there's no way of faithfully cloning our
 *   Response values. We obviously need the Response body, so we can use a structure like this to store the data and
 *   re-create the Response via constructor. We only store these properties because this is all we're able to copy over
 *   via the Response constructor, which is the downside to this method, and we should replace it as soon as #6348 is
 *   resolved.
 */
export type SerializableResponse = {
    status: number,
    statusText: string,
    headers?: Record<string, string>,
    body?: string
}

export class HttpClient {

    public userAgent: string | null;
    public readonly cache: Cache<SerializableResponse> | null;

    /**
     * Constructor for a new HTTP client.
     * @param userAgent The user agent to use for requests. Defaults to Starboard v{packageJson.version}. If null
     *   is passed, the default Bun user agent will be used.
     * @param cache A Cache to use for storing Responses. If not provided, no cache will be used.
     */
    constructor(userAgent?: string | null | undefined, cache?: Cache<SerializableResponse>) {
        this.userAgent = userAgent === undefined ? `Starboard v${packageJson.version}` : userAgent;
        this.cache = cache ?? null;
    }

    /**
     * Send an HTTP Request to the provided URL or Request. The specification for this method largely mirrors the spec
     *   for Bun's built-in fetch function. {@link HttpClient} will generate default headers for the request
     *   (i.e. the user agent). Generated headers will be overwritten by any headers already defined in the
     *   Request or RequestInit objects, if provided. If both a Request and RequestInit object are provided, any values
     *   defined within the RequestInit take precedence over values already defined in the Request. Any values in the
     *   Request that are not defined in the RequestInit will still be used. This only applies to the top level (i.e.,
     *   if the `headers` property exists in the RequestInit object, the headers defined in the Request will be ignored).
     * @param url The Request to send, or the URL to send the Request to.
     * @param init Optional RequestInit object. If a Request is passed, any options that are also specified within the
     *   passed Request will be ignored.
     * @throws Error if an invalid URL is provided
     * @throws Error if the HTTP request fails
     */
    public fetch(url: string | URL | Request, init?: FetchRequestInit): Promise<Response>;
    /**
     * Send an HTTP Request using the provided Request. The specification for this method largely mirrors the spec
     *   for Bun's built-in fetch function. {@link HttpClient} will generate default headers for the request
     *   (i.e. the user agent). Generated headers will be overwritten by any headers already defined in the
     *   Request or RequestInit objects, if provided. If both a Request and RequestInit object are provided, any values
     *   defined within the RequestInit take precedence over values already defined in the Request. Any values in the
     *   Request that are not defined in the RequestInit will still be used. This only applies to the top level (i.e.,
     *   if the `headers` property exists in the RequestInit object, the headers defined in the Request will be ignored).
     * @param input The Request to send
     * @param init Optional RequestInit object. If a Request is passed, any options that are also specified within the
     *   passed Request will be ignored.
     * @throws Error if the HTTP request fails
     */
    public fetch(input: Request, init?: RequestInit): Promise<Response>;
    public async fetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {

        const generatedHeaders = this.genHeaders();

        // If a URL/string is passed, we can convert it into a Request with the RequestInit options
        if(typeof input === "string" || input instanceof URL) {
            input = new Request({
                url: input.toString(),
                ...init,
            });
        }


        // input is now guaranteed to be a Request object. RequestInit takes precedence over Request, so if RequestInit
        //   has headers defined, we add our generated headers to that. Otherwise, we add them to the Request.
        if(init?.headers) {
            init.headers = new Headers({
                ...Object.fromEntries(generatedHeaders),
                ...Object.fromEntries(new Headers(init.headers))
            })
        } else {
            for(const header of generatedHeaders) {
                if(!input.headers.get(header[0])) {
                    input.headers.set(header[0], header[1]);
                }
            }
        }

        input = new Request(input, init)

        // Attempt to use cache before sending actual network request.
        if(this.cache) {
            const result = (await this.cache.get(await this.hashRequest(input),  async () => {
                console.log(`Sending HTTP request to ${(input as Request).url}`);
                const response = await fetch(input);
                return {
                    body: await response.text(),
                    headers: Object.fromEntries(response.headers),
                    status: response.status,
                    statusText: response.statusText
                }
            }));
            return new Response(result.body, result);
        } else {
            console.log(`Sending HTTP request to ${input.url}`);
            return await fetch(input);
        }
    }

    /**
     * Generate a hash string for a Request. Request hashes are used by this `HttpClient` in managing the cache. The
     *   hash for a given Request is used as a key within the cache to reference the accompanying Response. If a Cache
     *   is not provided to an instance of this HttpClient, this method won't be used by default.
     * @param req Request to generate a hash for.
     * @returns A string which uniquely identifies this Request's associated Response.By default, this is in the form of
     *   an MD5 hash to a string resembling the HTTP message format as defined in
     *   {@link https://datatracker.ietf.org/doc/html/rfc2616#section-4|RFC 2616}, but with the HTTP version removed
     *   from the start line. However, this method could be overridden to provide custom hashing functionality, such as
     *   shared caches between URLs, or to ignore headers or other parameters.
     * @protected
     */
    protected async hashRequest(req: Request): Promise<string> {
        // We're just creating a string similar to how the raw HTTP message is formatted. The Request class does not
        //   expose this info directly. Parts which don't actually matter for the purpose of caching are omitted
        //   (i.e. HTTP version).
        let str = `${req.method} ${req.url}\n`;
        for(const header of req.headers.entries()) {
            str += `${header[0].toLowerCase()}: ${header[1]}\n`;
        }
        str += "\n";
        str += await req.text();

        return crypto.createHash("md5").update(str).digest("hex");
    }

    protected genHeaders(): Headers {
        const headers = new Headers();
        if(this.userAgent) {
            headers.set("User-Agent", this.userAgent);
        }
        return headers;
    }
}
