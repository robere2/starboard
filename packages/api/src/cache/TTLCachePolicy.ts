import {CachePolicy} from "./CachePolicy";
import {CacheItem} from "./Cache";

/**
 * Time-based implementation of {@link CachePolicy}. {@link CacheItem} entries are considered valid for a given amount
 *   of time after entrance into the {{@link Cache}.
 * @typeParam T Type of the cached data.
 */
export class TTLCachePolicy<T = any> implements CachePolicy<T> {

    /**
     * Number of milliseconds after {@link CacheItem} entry after which point the entry will no longer be valid, and
     *   should be garbage collected.
     */
    public readonly ttl: number;

    /**
     * Create a new CachePolicy which marks items as expired after a certain amount of time.
     * @param ttl Time to live in milliseconds. After this number of milliseconds since the CacheItem was saved, the
     *   CacheItem will no longer be used and can safely be removed from the cache.
     * @typeParam T Type of the cached data.
     */
    constructor(ttl: number) {
        if(ttl <= 0) {
            throw new Error('Cache TTL cannot be less than or equal to 0.');
        }
        this.ttl = ttl;
    }

    /**
     * Check if a given {@link CacheItem} is still valid according to this policy.
     * @param item `CacheItem` to check.
     * @returns `true` if the `CacheItem`'s creation time plus the TTL is still in the future, `false` otherwise.
     * @override
     */
    check(item: CacheItem<T>): Promise<boolean> | boolean {
        return item.created + this.ttl > Date.now();
    }
}
