import {CachePolicy} from "./CachePolicy";

/**
 * The options that can be provided to a {@link Cache} constructor.
 * @typeParam T The type of the values stored in the cache.
 */
export type CacheOptions<T> = {
    /**
     * The policy that defines how the {@link Cache} should determine whether a given entry is valid (or, more
     *   technically speaking, a "hit").
     */
    policy: CachePolicy<T>,
    /**
     * Function used to start a custom garbage collection mechanism. Without this, the default garbage collection
     *   mechanism will be used (check all items against the {@link CachePolicy} every 60 seconds). To disable garbage
     *   collection, you can pass an empty function here. If you have a custom implementation, you may want to also
     *   implement `stopGarbageCollection`.
     */
    startGarbageCollection?: () => void;
    /**
     * Function used to stop a custom garbage collection mechanism. Without this, the default garbage collection
     *   mechanism will attempt to stop the internal default garbage collection interval. You should not use this
     *   option without also using `startGarbageCollection` (doing so will cause the default garbage collector
     *   to never shut down).
     */
    stopGarbageCollection?: () => void;
}

/**
 * Container for storing values of type `T` along with a timestamp at which the value was saved in the {@link Cache}.
 *   This is useful for {@link CachePolicy} implementations which invalidate the cached values after a certain period of
 *   time.
 * @typeParam T The type of the value stored in the cache.
 */
export type CacheItem<T = any> = {
    /**
     * The value stored in the cache.
     */
    value: T
    /**
     * Unix timestamp in milliseconds at which the value was first inserted into the {@link Cache}.
     */
    created: number
}

/**
 * The `Cache` class is an implementable abstract class for storing values to be recalled later.
 * @typeParam T The type of the values stored in the cache.
 * @see {@link CachePolicy}
 * @see {@link InMemoryCache}
 */
export abstract class Cache<T = any> {

    /**
     * The {@link CachePolicy} that this `Cache` is using.
     */
    public readonly policy: CachePolicy<T>;
    private readonly options: CacheOptions<T>;
    private garbageCollectionInterval?: ReturnType<typeof setInterval>;

    /**
     * Constructor for the `Cache` class.
     * @param options The custom options for the `Cache`, type {@link CacheOptions}.
     * @typeParam T The type of the values stored in the cache.
     * @see {@link CacheOptions}
     */
    public constructor(options: CacheOptions<T>) {
        this.policy = options.policy;
        this.options = options;
        if(options.startGarbageCollection) {
            options.startGarbageCollection();
        } else {
            this.garbageCollectionInterval = setInterval(() => this.garbageCollect(), 1000 * 60);
        }
    }

    /**
     * Write a value to the cache. This inserts a {@link CacheItem} value into the `Cache` with the `created` value
     *   being set to the time of calling this method.
     * @param key The key to write the value to in the cache. This key can later be used to retrieve the value from the
     *   cache, if it's still valid according to the {@link CachePolicy}. Generally these keys should be unique for
     *   each value stored in the cache.
     * @param value Value to write to the cache at the given key. Must be of type `T`.
     * @returns Either void or a Promise of void that resolves when the value has successfully been added to the cache.
     * @see {@link CachePolicy}
     */
    public abstract write(key: string, value: T): void | Promise<void>;

    /**
     * Get the value of a given key from the cache, if it still exists.
     * @param key Key that was used in the call to {@link write} instructing the `Cache` on where to store the value.
     * @returns A `Promise` that resolves to the value of type `T` stored in the cache at the given key, if it still
     *   exists and is valid according to the {@link CachePolicy}. If the value does not exist, `null` will be returned.
     * @see {@link CachePolicy}
     */
    public async get(key: string): Promise<T | null>;
    /**
     * Get the value of a given key from the cache, if it exists, or call the passed generator function if not.
     * @param key Key that was used in the call to {@link write} instructing the `Cache` on where to store the value.
     * @param fn If the value does not exist in the cache, this function will be called to generate the value to
     *   store in the cache. This function can return the value directly or via a `Promise`.
     * @returns A `Promise` that resolves to the value of type `T` stored in the cache at the given key if it exists.
     *   If it does not exist, the value returned from `fn` is returned.
     */
    public async get(key: string, fn: (() => T | Promise<T>)): Promise<T>;
    public async get(key: string, fn?: (() => T | Promise<T>)): Promise<T | null> {
        this.garbageCollect(); // We don't want to await here. Garbage collection can happen in the background.
        const item = await this.access(key);

        // If item is set and still valid according to cache policy, return the item
        if(item && this.policy.check(item)) {
            return item.value;
        }

        if(!fn) {
            return null;
        }

        // If the item is not set, or if item is set but invalid, try to set/update it with the fn
        const value = await fn();
        this.write(key, value);
        return value;
    }

    /**
     * A function responsible for cleaning up dead `Cache` values, usually with the help of {@link policy}. By default,
     *   this entails iterating all values in the cache and checking if they are still valid according to the
     *   {@link CachePolicy}. If not, they are deleted from the cache using {@link delete}.
     * @returns a Promise that resolves after all dead values have been deleted from the cache, i.e. {@link get},
     *   and {@link access}, and {@link keys} will no longer return them unless they're added again.
     * @protected
     */
    protected async garbageCollect(): Promise<void> {
        for(const key of await this.keys()) {
            const item = await this.access(key);
            // Only delete items if the item exists and the cache policy says it's no good.
            if(!item || await this.policy.check(item)) {
                continue;
            }
            await this.delete(key);
        }
    }

    /**
     * Destroy this `Cache` instance, primarily by shutting down the garbage collector. Failure to do so may leave
     *   your program hanging if you do not explicitly interrupt it.
     */
    public destroy(): void {
        if(this.options.stopGarbageCollection) {
            this.options.stopGarbageCollection();
        } else if(this.garbageCollectionInterval) {
            clearInterval(this.garbageCollectionInterval);
            this.garbageCollectionInterval = undefined;
        }
    }

    /**
     * Access a given key in the `Cache` directly, bypassing the {@link CachePolicy}. This is primarily used by
     *   the garbage collector to check if values are stale, but may be useful in other applications as well.
     *   Unlike {@link get}, this method returns the entire {@link CacheItem}. If you just want the value, use
     *   {@link get} instead.
     * @param key The key to access in the `Cache`.
     * @returns The `CacheItem` stored at the given key, if it exists, or `undefined` if it does not. May also
     *   return a `Promise` that resolves to the `CacheItem`, or `undefined` if it does not exist.
     */
    public abstract access(key: string): CacheItem<T> | Promise<CacheItem<T> | undefined> | undefined

    /**
     * Delete the value at a given key from the `Cache`, such that a subsequent call to {@link get} or {@link access}
     *   would not return the value.
     * @param key The key of the value to delete from the `Cache`.
     * @returns Either void or a Promise of void that resolves when the key has successfully been deleted from the
     *   cache.
     */
    public abstract delete(key: string): void | Promise<void>;

    /**
     * Retrieve a list of all currently-stored keys stored in the `Cache`. These keys do not necessarily have to be
     *   associated with a still-valid value. In fact, this method is used by {@link garbageCollect} to iterate over
     *   the `Cache` and find stale values.
     * @returns An `Array` of strings where each value corresponds to a key in the `Cache`. If the `Cache` is empty,
     *   an empty `Array` will be returned. May also return a `Promise` that resolves to an `Array` of strings.
     */
    public abstract keys(): string[] | Promise<string[]>;
}
