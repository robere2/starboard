import {Cache, CacheItem} from "./Cache.ts";

export class InMemoryCache<T> extends Cache<T> {

    private cache = new Map<string, CacheItem<T>>()

    public write(key: string, value: T): void {
        this.cache.set(key, {
            created: Date.now(),
            value
        });
    }

    public async access(key: string): Promise<CacheItem<T> | undefined> {
        return this.cache.get(key);
    }
}
