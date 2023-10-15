export class RateLimitExceededError extends Error {
    constructor(options?: ErrorOptions) {
        super("Rate limit exceeded", options);
    }

}
