import {IDeferPolicy} from "./IDeferPolicy";
import {RateLimitExceededError} from "../throwables";
import {randomUUID} from "crypto";

/**
 * Container for queued deferral `Promise`s with a corresponding unique ID.
 */
class QueueItem {
    id = randomUUID();
    promise?: Promise<void>;
}

/**
 * Implementation of {@link IDeferPolicy} that is used to defer outgoing HTTP requests based on a set of three
 * rate limit HTTP headers:
 *
 * - A header indicating the total number of requests the client is allowed to make within the rate limit interval
 * - A header indicating the number of remaining requests the client is allowed to make until the next reset
 * - A header indicating the number of seconds remaining until the next reset
 *
 * This class also allows short bursts of requests to flow through without being deferred, at the risk of later requests
 * being deferred for longer. Bursting can be disabled by passing a burst ratio of 1.0.
 *
 * The header names, default reset interval, built-in buffer, and burst settings can be configured via the constructor.
 *
 * This class was primarily designed to work with the Hypixel API rate limits.
 *
 * @see https://api.hypixel.net/#section/Introduction/Limits
 */
export class RateLimitDeferPolicy implements IDeferPolicy {

    /**
     * The name of the header that contains the total request limit
     * @internal
     * @protected
     */
    protected limitHeaderName: string;
    /**
     * The name of the header that contains the remaining number of allowed requests
     * @internal
     * @protected
     */
    protected remainingHeaderName: string;
    /**
     * The name of the header that contains the number of seconds until the next reset
     * @internal
     * @protected
     */
    protected resetHeaderName: string;
    /**
     * Before we receive our first response, we don't know how long until the next reset. We could make some
     * assumptions, but usually the developer knows their own reset interval ahead of time. If we haven't received
     * a reset interval value yet, we assume it's the default.
     *
     * This value is also used after a previous reset interval has expired.
     * @internal
     * @protected
     */
    protected defaultResetInterval: number;
    /**
     * A percentage of the total number of allowed requests that should never be used by the parent {@link BaseAPI}.
     * As we get closer to using up all of our requests, the amount of time we debounce gets less and less accurate.
     * Adding a small buffer helps protect against accidentally hitting our rate limit at the tail end of the
     * reset interval. As a bonus, this can also be used to allow the API credentials to be used by another application
     * as well with less risk of hitting the rate limit (maybe particularly useful for IP-based rate limits)
     * @internal
     * @protected
     */
    protected buffer: number;

    /**
     * Date object containing the timestamp at which our rate limit will reset.
     * @internal
     * @protected
     */
    protected resetDateTime: Date;
    /**
     * Number of requests remaining in the current rate limit interval
     * @remarks Infinity disables rate limiting until the first response is received, at which point this value will be
     * updated.
     * @internal
     * @protected
     */
    protected remaining: number = Infinity;
    /**
     * Total number of requests we're allowed to make per interval
     * @internal
     * @protected
     */
    protected total: number = Infinity;
    /**
     * A Set containing the queue of requests to be sent. Each {@link poll} call iterates through them and awaits them
     * until it reaches its own {@link QueueItem}, at which point the `poll` call resolves. This could have performance
     * implications at large scales.
     * @internal
     * @protected
     */
    protected queue: Set<QueueItem> = new Set();

    /**
     * Number of requests that have been burst requests in our current burst interval. Once this value is equal to
     * {@link burstCap}, burst requests can no longer be sent until this is reset back to 0.
     * @internal
     * @protected
     */
    protected burstCount: number = 0;
    /**
     * Number of requests that can be sent without any debouncing within the specified burst interval.
     * @see {@link burstIntervalTimer}
     * @internal
     * @protected
     */
    protected burstCap: number;
    /**
     * A ratio of how many requests we must have remaining in the current reset interval for bursting to be used.
     * For example, if this value is 0.5 and our {@link total} is 300, bursting can only be used if {@link remaining} is
     * greater than or equal to 150.
     * @internal
     * @protected
     */
    protected burstRequiredRatio: number;
    /**
     * Timer interval that resets our {@link burstCount} back to 0. Can be cancelled with {@link destroy}.
     * @internal
     * @protected
     */
    protected burstIntervalTimer: ReturnType<typeof setTimeout>;

    /**
     * Constructor
     * @param limitHeaderName The name of the header that contains the total request limit per reset interval.
     * @param remainingHeaderName The name of the header that contains the remaining number of allowed requests in our
     * current reset interval.
     * @param resetHeaderName The name of the header that contains the number of seconds until the next reset.
     * @param defaultResetInterval The default number of seconds between reset intervals. This is used to estimate the
     * required debounce before we've received our first response via {@link notify}.
     * @param buffer A value between 0 and 1 representing how much of the total should NOT be used by the API. Setting
     * this to 0 could result in requests towards the end of the reset interval hitting the rate limit.
     * @param burstCap Max number of allowed burst requests within each burst interval. To disable bursting, you can set
     * this to 0.
     * @param burstInterval Length of each burst interval in milliseconds. Internally `setInterval` is used, so setting
     * this to a value less than 20 could have unintended effects.
     * @param burstRequiredRatio A value between 0 and 1 representing how many requests must be remaining within the
     * current reset interval for bursting to be used. This can be set to 0 to have bursting enabled all the time, or
     * 1 to disable bursting completely.
     */
    constructor(
        limitHeaderName = "RateLimit-Limit",
        remainingHeaderName = "RateLimit-Remaining",
        resetHeaderName = "RateLimit-Reset",
        defaultResetInterval = 300,
        buffer = 0.02,
        burstCap = 3,
        burstInterval = 3000,
        burstRequiredRatio = 0.5
    ) {
        this.limitHeaderName = limitHeaderName;
        this.remainingHeaderName = remainingHeaderName;
        this.resetHeaderName = resetHeaderName;
        this.defaultResetInterval = defaultResetInterval;
        this.buffer = buffer;
        this.burstCap = burstCap;
        this.burstRequiredRatio = burstRequiredRatio;
        this.resetDateTime = new Date(Date.now() + this.defaultResetInterval);

        this.burstIntervalTimer = setInterval(() => {
            this.burstCount = 0;
        }, burstInterval);
    }

    /**
     * Destroy this `RateLimitDeferPolicy` instance, primarily by shutting down the burst interval. Failure to do so may
     * leave your program hanging if you do not explicitly interrupt it.
     */
    public destroy(): void {
        clearInterval(this.burstIntervalTimer);
    }

    /**
     * @internal
     * @protected
     */
    protected async runDefer(): Promise<void> {
        // If remaining is infinity, we don't debounce
        if(this.remaining === Infinity) {
            return;
        }

        // Attempt to burst if we're under the right conditions (under burst cap & above the burst ratio)
        if(this.burstCount < this.burstCap && this.remaining / this.total > this.burstRequiredRatio) {
            this.burstCount++;
            return;
        }

        // Debounce only if we have a `remaining` value and can't burst
        const now = Date.now();
        const timeTilReset = this.resetDateTime.getTime() - now;
        const deferTime = timeTilReset / Math.max(this.remaining - this.buffer * this.total, 1)
        await new Promise(resolve => setTimeout(resolve, deferTime));
    }

    /**
     * Checks if we're past the next known reset timestamp, and resets the {@link remaining} and {@link resetDateTime}
     * values if so. {@link resetDateTime} is set using the {@link defaultResetInterval}.
     * @internal
     * @protected
     */
    protected attemptValuesReset() {
        if(!this.resetDateTime || this.resetDateTime <= new Date()) {
            this.remaining = this.total;
            this.resetDateTime = new Date(Date.now() + this.defaultResetInterval);
        }
    }

    public poll(): Promise<void> {
        const localQueueItem = new QueueItem()
        const promise = (async () => {
            for(const queueItem of this.queue) {
                if(queueItem.id === localQueueItem.id) {
                    this.attemptValuesReset();
                    if(this.remaining  <= 0) {
                        throw new RateLimitExceededError();
                    }
                    this.remaining--;
                    await this.runDefer();
                    this.queue.delete(queueItem);
                    return;
                } else {
                    await queueItem.promise;
                }
            }
        })()
        localQueueItem.promise = promise;
        this.queue.add(localQueueItem);
        return promise;
    }

    public notify(res: Response) {
        // When a Response is received, we don't want to delay, but we will update our stored rate limit values.
        const remaining = res.headers.get(this.remainingHeaderName);
        const total = res.headers.get(this.limitHeaderName);
        const reset = res.headers.get(this.resetHeaderName);

        if(remaining && total && reset) {
            const remainingParsed = parseInt(remaining);
            const totalParsed = parseInt(total);
            const resetParsed = parseInt(reset) * 1000;

            this.remaining = remainingParsed;
            this.total = totalParsed;
            this.resetDateTime = new Date(Date.now() + resetParsed);
        }
    }

}
