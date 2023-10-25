import {Cache, CacheItem} from "./Cache";

/**
 * In-memory implementation of {@link Cache}. This is likely sufficient for most `Cache` implementations, however larger
 *   applications may benefit from an external or more complex caching system.
 * @typeParam T - Type of the values stored in the `Cache`.
 */
export class InMemoryCache<T> extends Cache<T> {

    private cache = new Map<string, CacheItem<T>>()

    /**
     * Write a value to the cache. This inserts a {@link CacheItem} value into the `Cache` with the `created` value
     *   being set to the time of calling this method.
     * @param key The key to write the value to in the cache. This key can later be used to retrieve the value from the
     *   cache, if it's still valid according to the {@link CachePolicy}. Generally these keys should be unique for
     *   each value stored in the cache.
     * @param value Value to write to the cache at the given key. Must be of type `T`.
     * @returns Either void or a Promise of void that resolves when the value has successfully been added to the cache.
     * @see {@link CachePolicy}
     * @override
     */
    public write(key: string, value: T): void {
        this.cache.set(key, {
            created: Date.now(),
            value
        });
    }

    /**
     * Access a given key in the `Cache` directly, bypassing the {@link CachePolicy}. This is primarily used by
     *   the garbage collector to check if values are stale, but may be useful in other applications as well.
     *   Unlike {@link get}, this method returns the entire {@link CacheItem}. If you just want the value, use
     *   {@link get} instead.
     * @param key The key to access in the `Cache`.
     * @returns The `CacheItem` stored at the given key, if it exists, or `undefined` if it does not. May also
     *   return a `Promise` that resolves to the `CacheItem`, or `undefined` if it does not exist.
     * @override
     */
    public access(key: string): CacheItem<T> | undefined {
        return this.cache.get(key);
    }

    /**
     * Delete the value at a given key from the `Cache`, such that a subsequent call to {@link get} or {@link access}
     *   would not return the value.
     * @param key The key of the value to delete from the `Cache`.
     * @returns Either void or a Promise of void that resolves when the key has successfully been deleted from the
     *   cache.
     * @override
     */
    delete(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Retrieve a list of all currently-stored keys stored in the `Cache`. These keys do not necessarily have to be
     *   associated with a still-valid value. In fact, this method is used by {@link garbageCollect} to iterate over
     *   the `Cache` and find stale values.
     * @returns An `Array` of strings where each value corresponds to a key in the `Cache`. If the `Cache` is empty,
     *   an empty `Array` will be returned. May also return a `Promise` that resolves to an `Array` of strings.
     * @override
     */
    keys(): string[] {
        return Array.from(this.cache.keys());
    }
}
