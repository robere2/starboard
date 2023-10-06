import {CachePolicy} from "./CachePolicy.ts";

export type CacheItem<T = any> = {
    value: T
    created: number
}

export abstract class Cache<T = any> {

    public readonly policy: CachePolicy<T>;

    public constructor(policy: CachePolicy<T>) {
        this.policy = policy;
    }

    public abstract write(key: string, value: T): void | Promise<void>;
    public abstract write(key: string, value: T): void | Promise<void>;

    public async get(key: string, fn: (() => T | Promise<T>)): Promise<T> {
        const item = await this.access(key);

        // If item is set and still valid according to cache policy, return the item
        if(item && this.policy.use(item)) {
            return item.value;
        }

        // If the item is not set, or if item is set but invalid, try to set/update it with the fn
        const value = await fn();
        this.write(key, value);
        return value;
    }

    public abstract access(key: string): CacheItem<T> | Promise<CacheItem<T> | undefined> | undefined
}
