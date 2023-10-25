import type {CacheItem} from "./Cache";

/**
 * A `CachePolicy` is an interface for checking whether a given object of type `T` is considered a "hit" or "miss" on
 *   the cache. Typically, this will take into account how stale the data is. For simple use-cases, you can simply use
 *   {@link TTLCachePolicy}.
 * @typeParam T The type of the object stored in the cache.
 * @see {@link TTLCachePolicy}
 */
export interface CachePolicy<T = any> {
    /**
     * Checks whether the given item is considered a "hit" or "miss" on the {@link Cache}. If it is a hit, then the
     *   Cache should keep the data and keep handing it out to callers. If it is a miss, then the Cache
     *   should not return the data anymore, and it's free to delete it from the cache.
     * @param item The item to check, containing both the value of type `T` and the time at which it was first inserted
     *   into the Cache.
     * @returns A `boolean` representing whether the item is considered a "hit" or "miss". Can also return a
     *   `Promise<boolean>`. If it is a miss, the Cache should no longer use it, and it's safe to delete it.
     */
    check(item: CacheItem<T>): Promise<boolean> | boolean;
}
