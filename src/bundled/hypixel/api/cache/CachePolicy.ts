import type {CacheItem} from "./Cache.ts";

export abstract class CachePolicy<T = any> {
    abstract check(item: CacheItem<T>): Promise<boolean> | boolean;
}
