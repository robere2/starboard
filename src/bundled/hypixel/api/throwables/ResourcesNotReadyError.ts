export class ResourcesNotReadyError extends Error {

    constructor(options?: ErrorOptions) {
        super("Attempt to use HypixelResource data before data has been fetched. Await the result of " +
            "HypixelResources.fetch() before attempting to use.", options);
    }
}
