import {Cache, CacheItem} from "./Cache.ts";

export class InMemoryCache<T> extends Cache<T> {

    private cache = new Map<string, CacheItem<T>>()

    public write(key: string, value: T): void {
        this.cache.set(key, {
            created: Date.now(),
            value
        });
    }

    public access(key: string): CacheItem<T> | undefined {
        return this.cache.get(key);
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    keys(): string[] {
        return Array.from(this.cache.keys());
    }
}
