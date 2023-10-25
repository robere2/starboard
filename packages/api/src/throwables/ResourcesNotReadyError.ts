/**
 * Error that is thrown when you attempt to use {@link HypixelResources} before it has fetched all data from the
 *   Hypixel API. This should never happen unless you are overriding the default `HypixelResources` class, as
 *   the {@link HypixelResources.create} method will not return a new instance until all resources have been fetched.
 */
export class ResourcesNotReadyError extends Error {
    /**
     * Constructor for `ResourcesNotReadyError`.
     * @param options `Error` options
     */
    constructor(options?: ErrorOptions) {
        super("Attempt to use HypixelResource data before data has been fetched. Await the result of " +
            "HypixelResources.fetch() before attempting to use.", options);
    }
}
