/**
 * The `IDeferPolicy` is an interface used by instances of {@link BaseAPI} and its descendants to determine the
 *   frequency at which requests can be sent. In other words, API requests are debounced to protect against going over
 *   API rate limits, and `IDeferPolicy` is used to decide the delay between two requests.
 *
 *   This interface was designed with the intention of debouncing API requests, but it can be used for any task which
 *   should have a controlled delay.
 * @typeParam T - The callback notification type that will be passed to {@link IDeferPolicy.notify}. Defaults to `Response`.
 * @see {@link RateLimitDeferPolicy}
 */
export interface IDeferPolicy<T = Response> {
    /**
     * Async method that controls the flow of an upcoming task by resolving when it's time to start the task.
     * @returns A `Promise` that resolves when it is okay to start the next task. If the `Promise` never resolves,
     *   the task will never start.
     */
    poll(): Promise<void>;

    /**
     * Method used to notify an `IDeferPolicy` when a deferred task completes, i.e. when the deferred request's HTTP
     *   response comes back. This may be useful for retrieving rate limit data from the response, or for maintaining a
     *   record of how many requests are currently in transit to/from the API.
     * @param value The value of type `T` that is delivered with the notification.
     */
    notify(value: T): void;
}
