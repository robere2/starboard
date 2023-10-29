/**
 * Error that is thrown when {@link RateLimitDeferPolicy} hits its maximum requests before the next rate limit reset.
 *   This should never happen if nothing else is using up your API limit (i.e., you have no other applications using
 *   the same API key).
 */
export class RateLimitExceededError extends Error {
    /**
     * Constructor for `RateLimitExceededError`.
     * @param options `Error` options
     */
    constructor(options?: ErrorOptions) {
        super("Rate limit exceeded", options);
    }

}
