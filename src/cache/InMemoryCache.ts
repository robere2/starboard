import {Cache} from "./Cache.ts";

type CacheItem<T> = {
    value: T
    created: number
}

export class InMemoryCache<T> extends Cache<T> {

    private cache = new Map<string, CacheItem<T>>()

    public save(key: string, value: T): void {
        this.cache.set(key, {
            created: Date.now(),
            value
        });
    }

    async get(key: string, fn?: (() => T | Promise<T>)): Promise<T | undefined> {
        const item = this.cache.get(key);
        const minAge = Date.now() - this.ttl;

        // If item is set and not expired, return the item
        if(item && item.created >= minAge) {
            return item.value;
        }

        // If the item is not set, or if item is set but is expired, try to set/update it with the fn, if provided
        if(!item || item.created < minAge) {
            if(typeof fn === "function") {
                const value = await fn();
                this.cache.set(key, {
                    created: Date.now(),
                    value
                });
                return value;
            } else {
                return undefined;
            }
        }
    }

}
