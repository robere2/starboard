import {IDeferPolicy} from "./IDeferPolicy.ts";
import {RateLimitExceededError} from "../throwables/RateLimitExceededError.ts";

export class RateLimitDeferPolicy implements IDeferPolicy {

    protected limitHeaderName: string;
    protected remainingHeaderName: string;
    protected resetHeaderName: string;

    protected resetDateTime : Date | null = null;
    // Infinity disables rate limiting until the first response is received, at which point this value will be updated.
    protected remaining: number = Infinity;
    protected total: number = Infinity;

    constructor(limitHeaderName: string, remainingHeaderName: string, resetHeaderName: string) {
        this.limitHeaderName = limitHeaderName;
        this.remainingHeaderName = remainingHeaderName;
        this.resetHeaderName = resetHeaderName;
    }

    async poll(input: Request | Response): Promise<void> {
        if(input instanceof Request) {
            // When a Request is received, we want to defer that request by spacing them all out evenly out so that we
            // don't exceed our rate limit. Start by resetting our stored rate limit values if we have a reset date
            // that has passed.
            if(this.resetDateTime && this.resetDateTime < new Date()) {
                this.remaining = this.total;
                this.resetDateTime = null;
            }

            if(this.remaining === 0) {
                throw new RateLimitExceededError();
            } else {
                this.remaining--;
                const timeRemainingTilReset = this.resetDateTime ? this.resetDateTime.getTime() - Date.now() : 0;
                if(this.remaining === Infinity || timeRemainingTilReset <= 0) {
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, timeRemainingTilReset / this.remaining));
            }

        } else { // When a Response is received, we don't want to delay, but we will update our stored rate limit values.
            const remaining = input.headers.get(this.remainingHeaderName);
            const total = input.headers.get(this.limitHeaderName);
            const reset = input.headers.get(this.resetHeaderName);

            if(remaining && total && reset) {
                this.remaining = parseInt(remaining);
                this.total = parseInt(total);
                const msTilReset = parseInt(reset) * 1000;
                this.resetDateTime = new Date(Date.now() + msTilReset);
            }
        }
    }

}
