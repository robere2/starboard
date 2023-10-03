import packageJson from "../../../package.json";

export class HttpClient {

    public userAgent: string | null;

    /**
     * Constructor for a new HTTP client.
     * @param userAgent The user agent to use for requests. Defaults to Starboard v{packageJson.version}. If null
     *   is passed, the default Bun user agent will be used.
     */
    constructor(userAgent?: string | null) {
        this.userAgent = userAgent === undefined ? `Starboard v${packageJson.version}` : userAgent;
    }

    /**
     * Send an HTTP Request to the provided URL or Request. The specification for this method largely mirrors the spec
     *   for Bun's built-in fetch function. {@link HttpClient} will generate default headers for the request
     *   (i.e. the user agent). Generated headers will be overwritten by any headers already defined in the
     *   Request or RequestInit objects, if provided. If both a Request and RequestInit object are provided, any values
     *   defined within the RequestInit take precedence over values already defined in the Request. Any values in the
     *   Request that are not defined in the RequestInit will still be used.
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
     *   Request that are not defined in the RequestInit will still be used.
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
            init.headers =  {
                ...generatedHeaders,
                ...init?.headers
            }
        } else {
            for(const header of generatedHeaders) {
                if(!input.headers.get(header[0])) {
                    input.headers.set(header[0], header[1]);
                }
            }
        }

        // We still need to pass the init parameter in case a Request was passed and there are any properties defined in
        //   the init parameter that weren't defined in the Request.
        return await fetch(input, {
            ...init,
        });
    }

    protected genHeaders(): Headers {
        const headers = new Headers();
        if(this.userAgent) {
            headers.set("User-Agent", this.userAgent);
        }
        return headers;
    }
}
