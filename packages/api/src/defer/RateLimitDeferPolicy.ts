import {IDeferPolicy} from "./IDeferPolicy";
import {RateLimitExceededError} from "../throwables";
import {randomUUID} from "crypto";

class QueueItem {
    id = randomUUID();
    promise?: Promise<void>;
}

export class RateLimitDeferPolicy implements IDeferPolicy {

    protected limitHeaderName: string;
    protected remainingHeaderName: string;
    protected resetHeaderName: string;
    protected defaultResetInterval: number;
    protected buffer: number;


    protected resetDateTime: Date;
    // Infinity disables rate limiting until the first response is received, at which point this value will be updated.
    protected remaining: number = Infinity;
    protected total: number = Infinity;
    protected queue: Set<QueueItem> = new Set();

    protected burstCount: number = 0;
    protected burstCap: number;
    protected burstRequiredRatio: number;
    protected burstIntervalTimer: ReturnType<typeof setTimeout>;

    constructor(limitHeaderName: string, remainingHeaderName: string, resetHeaderName: string, defaultResetInterval: number, buffer = 0.02, burstCap = 3, burstInterval = 3000, burstRequiredRatio = 0.5) {
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

    public destroy(): void {
        clearInterval(this.burstIntervalTimer);
    }

    public poll(): Promise<void> {
        const localQueueItem = new QueueItem()
        const promise = new Promise<void>(async resolve => {
            for(const queueItem of this.queue) {
                if(queueItem.id === localQueueItem.id) {
                    this.attemptValuesReset();
                    if(this.remaining  <= 0) {
                        throw new RateLimitExceededError();
                    }
                    this.remaining--;
                    await this.runDefer();
                    resolve();
                    this.queue.delete(queueItem);
                    return;
                } else {
                    await queueItem.promise;
                }
            }
            resolve();
        })
        localQueueItem.promise = promise;
        this.queue.add(localQueueItem);
        return promise;

    }

    protected async runDefer(): Promise<void> {
        const now = Date.now();
        const timeTilReset = this.resetDateTime.getTime() - now;
        const deferTime = timeTilReset / Math.max(this.remaining - this.buffer * this.total, 1)

        if(this.remaining === Infinity) {
            console.log('Rate limit unknown, no defer')
            return;
        } else if(this.burstCount < this.burstCap && this.remaining / this.total > this.burstRequiredRatio) {
            console.log("Bursting. Ratio: " + (this.remaining / this.total))
            this.burstCount++;
            return;
        } else {
            console.log("Waiting " + deferTime + "ms")
            console.log(`Limit: ${this.total} Remaining: ${this.remaining} Reset: ${timeTilReset}`)
            await new Promise(resolve => setTimeout(resolve, deferTime));
        }
    }

    protected attemptValuesReset() {
        if(!this.resetDateTime || this.resetDateTime <= new Date()) {
            this.remaining = this.total;
            this.resetDateTime = new Date(Date.now() + this.defaultResetInterval);
        }
    }

    public update(res: Response) {
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
