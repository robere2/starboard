import {CachePolicy} from "./CachePolicy.ts";

export type CacheOptions<T> = {
    policy: CachePolicy<T>,
    startGarbageCollection?: () => void;
}

export type CacheItem<T = any> = {
    value: T
    created: number
}

export abstract class Cache<T = any> {

    public readonly policy: CachePolicy<T>;

    public constructor(options: CacheOptions<T>) {
        this.policy = options.policy;
        if(options.startGarbageCollection) {
            options.startGarbageCollection();
        } else {
            setTimeout(() => this.garbageCollect(), 1000 * 60);
        }
    }

    public abstract write(key: string, value: T): void | Promise<void>;
    public abstract write(key: string, value: T): void | Promise<void>;

    public async get(key: string, fn: (() => T | Promise<T>)): Promise<T> {
        this.garbageCollect(); // We don't want to await here. Garbage collection can happen in the background.
        const item = await this.access(key);

        // If item is set and still valid according to cache policy, return the item
        if(item && this.policy.check(item)) {
            return item.value;
        }

        // If the item is not set, or if item is set but invalid, try to set/update it with the fn
        const value = await fn();
        this.write(key, value);
        return value;
    }

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

    public abstract access(key: string): CacheItem<T> | Promise<CacheItem<T> | undefined> | undefined

    public abstract delete(key: string): void | Promise<void>;

    public abstract keys(): string[] | Promise<string[]>;
}
