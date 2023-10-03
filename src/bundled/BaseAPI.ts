import {HttpClient} from "./http/HttpClient.ts";
import {ParsedOptions} from "../util.ts";

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
    defer?: boolean | number;
    /**
     * Custom HTTP client to use for HTTP requests to the Mojang API. If not provided, a default HTTP client will be
     *   used, which simply uses the {@link fetch} function. Custom HTTP clients are particularly useful for
     *   test suites where you want to mock an HTTP request. Custom clients can also be useful for adding custom logging
     *   or error handling for HTTP requests.
     */
    httpClient?: HttpClient;
}

export abstract class BaseAPI<T extends APIOptions> {
    protected readonly options: ParsedOptions<T>;

    protected constructor(options: T) {
        this.options = this.parseOptions(options);
    }

    protected abstract parseOptions(options: T): ParsedOptions<T>;

    /**
     * Parse an APIOptions input into an object with default values applied. This is a utility function that can parse
     *   all the default options found in APIOptions objects for you. Custom values found in classes that extend
     *   APIOptions can be parsed with {@link parseOptions}. If your implementation of BaseAPI does not have custom
     *   options (i.e., it uses just a APIOptions object), {@link parseOptions} can just call this function and return
     *   the returned value.
     * @param options APIOptions object with potentially undefined property values
     * @returns ParsedOptions<APIOptions> An object with all the values found in the passed options object, with default
     *   values applied to all supported properties that are otherwise undefined. This means the returned value is
     *   guaranteed to have no more undefined configuration values.
     * @protected
     */
    protected parseDefaultOptions(options: APIOptions): ParsedOptions<APIOptions> {
        return Object.freeze({
            defer: options.defer ?? 0.0,
            httpClient: options.httpClient ?? new HttpClient()
        })
    }
}
