import type {CacheItem} from "./Cache";

export abstract class CachePolicy<T = any> {
    abstract check(item: CacheItem<T>): Promise<boolean> | boolean;
}
