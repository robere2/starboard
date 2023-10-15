import {CachePolicy} from "./CachePolicy.ts";
import {CacheItem} from "./Cache.ts";

export class TTLCachePolicy<T = any> extends CachePolicy<T> {

    public readonly ttl: number;

    /**
     * Create a new CachePolicy which marks items as expired after a certain amount of time.
     * @param ttl Time to live in milliseconds. After this number of milliseconds since the CacheItem was saved, the
     *   CacheItem will no longer be used and can safely be removed from the cache.
     */
    constructor(ttl: number) {
        super();
        if(ttl <= 0) {
            throw new Error('Cache TTL cannot be less than or equal to 0.');
        }
        this.ttl = ttl;
    }


    check(item: CacheItem<T>): Promise<boolean> | boolean {
        return item.created + this.ttl > Date.now();
    }
}
