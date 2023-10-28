import {HttpClient} from "./http";
import {NonOptional} from "./util";
import * as z from "zod";
import {IDeferPolicy} from "./defer";
import {ZodSchema} from "zod";

/**
 * A container around `Response` for HTTP responses from APIs that integrates Zod schema parsing.
 * @see https://zod.dev/
 */
export class RawResponse {

    private bodyText!: string;
    /**
     * The original `Response` from the `fetch()` call. This can be used to read headers and status codes from the
     * response, however it should not be used to read the body. Instead, use {@link json} or {@link text}.
     */
    public readonly response: Response;

    /**
     * @internal
     * @param response
     * @private
     */
    private constructor(response: Response) {
        this.response = response;
    }

    /**
     * @internal
     * @param response
     */
    public static async create(response: Response): Promise<RawResponse> {
        const rawRes = new RawResponse(response);
        rawRes.bodyText = await response.text();
        return rawRes;
    }

    /**
     * Parse this responses JSON body using a Zod schema.
     * @param schema The Zod schema to parse the body with.
     * @throws
     * - `Error` if the response is not JSON.
     * - `Error` if the response JSON does not match the given schema.
     * @returns the parsed API response
     * @see https://zod.dev/
     */
    public async parse<T extends ZodSchema>(schema: T): Promise<z.infer<T>> {
        return schema.parse(this.json())
    }

    /**
     * Get the API response body and attempt to parse it as JSON.
     * @throws
     * - `Error` if the API response is not valid JSON.
     */
    public json(): any {
        return JSON.parse(this.bodyText);
    }

    /**
     * Get the API response body as plain text.
     */
    public text(): string {
        return this.bodyText;
    }
}

/**
 * Default options that all implementations of {@link BaseAPI} accept.
 */
export type APIOptions = {
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
    deferPolicy?: IDeferPolicy | null;
    /**
     * Custom HTTP client to use for HTTP requests to the Mojang API. If not provided, a default HTTP client will be
     *   used, which simply uses the {@link fetch} function. Custom HTTP clients are particularly useful for
     *   test suites where you want to mock an HTTP request. Custom clients can also be useful for adding custom logging
     *   or error handling for HTTP requests.
     */
    httpClient?: HttpClient;
}

/**
 * An extensible API interface, used by {@link MojangAPI} and {@link HypixelAPI}.
 * @typeParam T The type of the options that can be provided to this API. Must extend {@link APIOptions}.
 * @example
 * type YourOptions extends APIOptions {
 *     apiKey: string;
 * }
 *
 * class YourAPI extends BaseAPI<YourOptions> {
 *
 *     protected genHeaders(): Headers {
 *         const headers = super.genHeaders();
 *         headers.set("Authorization", "Bearer " + this.options.apiKey);
 *         return headers;
 *     }
 *
 *     protected parseOptions(options: YourOptions): NonOptional<YourOptions> {
 *         return Object.freeze({
 *             ...this.parseDefaultOptions(options),
 *             apiKey: options.apiKey,
 *         })
 *     }
 *
 *     public async sendRequest(): Promise<string> {
 *         return await this.request("https://example.com/get-data", false, ResponseSchema, res => res.someStringValue);
 *     }
 * }
 */
export abstract class BaseAPI<T extends APIOptions> {

    /**
     * The options provided to the constructor, parsed by {@link parseOptions}.
     * @protected
     */
    protected readonly options: NonOptional<T>;

    /**
     * @hidden
     * @param options
     * @protected
     */
    protected constructor(options: T) {
        this.options = this.parseOptions(options);
    }

    /**
     * Parse the options input into the constructor into a structurally identical object but with all unset values set
     * to their default.
     * @remarks Within this method call `parseDefaultOptions` to parse the options set within {@link APIOptions}.
     * Any additional values you have in your extensions to these options must be parsed by you.
     * @param options
     * @protected
     * @example
     *
     * protected parseOptions(options: YourOptions): NonOptional<YourOptions> {
     *     return Object.freeze({
     *         ...this.parseDefaultOptions(options),
     *         apiKey: options.apiKey,
     *     })
     * }
     */
    protected abstract parseOptions(options: T): NonOptional<T>;

    /**
     * Generate the `Headers` object to be sent with requests to the API.
     * @returns A `Headers` instance with all the headers to send with requests.
     * @protected
     * @example
     *
     * protected genHeaders(): Headers {
     *     const headers = super.genHeaders();
     *     headers.set("Authorization", "Bearer " + this.options.apiKey);
     *     return headers;
     * }
     */
    protected genHeaders(): Headers {
        return new Headers();
    }

    /**
     * Send a request to a given URL using this APIs {@link HttpClient} provided {@link options}. If the `HttpClient`
     * has a cached response, then that response is returned immediately. Otherwise, we send a new request to the URL.
     * Before sending the request, if an {@link IDeferPolicy} was provided to {@link options}, the defer policy is
     * polled first.
     * @param url The complete URL to send a request to. Relative URLs are not supported.
     * @returns A `Promise` which resolves to a `RawResponse` from the API.
     * @throws
     * - `Error` if the HTTP request fails
     * @protected
     * @see {@link request}
     */
    protected async rawRequest(url: string): Promise<RawResponse> {
        const req = new Request(url, {
            headers: this.genHeaders()
        });

        let res = await this.options.httpClient!.fetch(req, undefined, true);
        // fetch value from API if cache was not a hit
        if(!res) {
            await this.options.deferPolicy?.poll();
            res = await this.options.httpClient!.fetch(req);
            this.options.deferPolicy?.notify(res);
        }

        return await RawResponse.create(res)
    }

    /**
     * Send an API request to the given URL using the provided {@link HttpClient} and {@link IDeferPolicy}.
     * @param url URL to send the request to. Relative URLs not supported.
     * @param raw Whether to receive a {@link RawResponse}.
     * @param schema **In this overload, this value is unused.** - The Zod schema to use to parse the API response.
     * @param mutator **In this overload, this value is unused.** - A function that takes in the schema-parsed response
     * and returns another value. This can also be used to perform additional validation on the response and throw an
     * `Error` if it fails.
     * @returns
     * - **If `raw` is true, the `RawResponse` from {@link rawRequest} is returned.**
     * - If `raw` is `false` and the `mutator` argument is undefined, the API response parsed by the provided schema is
     * returned.
     * - If `raw` is `false` and a `mutator` argument is provided, the value returned by the mutator is returned.
     * @throws
     * - `Error` if the HTTP request fails.
     * - `Error` if the schema parsing fails.
     * @see https://zod.dev/
     * @protected
     */
    protected async request<S extends ZodSchema, V>(url: string, raw: true, schema?: S, mutator?: (input: z.infer<S>) => V): Promise<RawResponse>;
    /**
     * Send an API request to the given URL using the provided {@link HttpClient} and {@link IDeferPolicy}.
     * @param url URL to send the request to. Relative URLs not supported.
     * @param raw Whether to receive a {@link RawResponse}.
     * @param schema The Zod schema to use to parse the API response.
     * @param mutator **In this overload, this value is unused.** - A function that takes in the schema-parsed response
     * and returns another value. This can also be used to perform additional validation on the response and throw an
     * `Error` if it fails.
     * @returns
     * - If `raw` is true, the `RawResponse` from {@link rawRequest} is returned.
     * - **If `raw` is `false` and the `mutator` argument is undefined, the API response parsed by the provided schema
     * is returned.**
     * - If `raw` is `false` and a `mutator` argument is provided, the value returned by the mutator is returned.
     * @throws
     * - `Error` if the HTTP request fails.
     * - `Error` if the schema parsing fails.
     * @see https://zod.dev/
     * @protected
     */
    protected async request<S extends ZodSchema, V>(url: string, raw: false, schema: S, mutator?: (input: z.infer<S>) => V): Promise<z.infer<S>>;
    /**
     * Send an API request to the given URL using the provided {@link HttpClient} and {@link IDeferPolicy}.
     * @param url URL to send the request to. Relative URLs not supported.
     * @param raw Whether to receive a {@link RawResponse}.
     * @param schema The Zod schema to use to parse the API response.
     * @param mutator A function that takes in the schema-parsed response
     * and returns another value. This can also be used to perform additional validation on the response and throw an
     * `Error` if it fails.
     * @returns
     * - If `raw` is true, the `RawResponse` from {@link rawRequest} is returned.
     * - If `raw` is `false` and the `mutator` argument is undefined, the API response parsed by the provided schema is
     * returned.
     * - **If `raw` is `false` and a `mutator` argument is provided, the value returned by the mutator is returned.**
     * @throws
     * - `Error` if the HTTP request fails.
     * - `Error` if the schema parsing fails.
     * @see https://zod.dev/
     * @protected
     */
    protected async request<S extends ZodSchema, V>(url: string, raw: false, schema: S, mutator: (input: z.infer<S>) => V): Promise<V>;
    protected async request<S extends ZodSchema, V>(url: string, raw: boolean, schema?: S, mutator?: (input: z.infer<S>) => V): Promise<z.infer<S> | V | RawResponse> {
        const rawRes = await this.rawRequest(url);

        if(raw) {
            return rawRes;
        }

        // Schema can only be undefined if raw is true, which is no longer the case.
        const parsed = await rawRes.parse(schema!);
        if(mutator) {
            return mutator(parsed);
        }
        return parsed;
    }

    /**
     * Destroy this API instance, primarily by shutting down the {@link HttpClient}. Failure to do so may
     * leave your program hanging if you do not explicitly interrupt it.
     */
    public destroy(): void {
        this.options.httpClient!.destroy();
    }

    /**
     * Parse an APIOptions input into an object with default values applied. This is a utility function that can parse
     *   all the default options found in APIOptions objects for you. Custom values found in classes that extend
     *   APIOptions can be parsed with {@link parseOptions}. If your implementation of BaseAPI does not have custom
     *   options (i.e., it uses just a APIOptions object), {@link parseOptions} can just call this function and return
     *   the returned value.
     * @param options APIOptions object with potentially undefined property values
     * @returns ParsedOptions\<APIOptions> An object with all the values found in the passed options object, with default
     *   values applied to all supported properties that are otherwise undefined. This means the returned value is
     *   guaranteed to have no more undefined configuration values.
     * @protected
     * @hidden
     */
    protected parseDefaultOptions(options: APIOptions): NonOptional<APIOptions> {
        return Object.freeze({
            deferPolicy: options.deferPolicy ?? null,
            httpClient: options.httpClient ?? new HttpClient()
        })
    }
}
