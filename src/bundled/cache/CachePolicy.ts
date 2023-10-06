import {CacheItem} from "./Cache.ts";

export abstract class CachePolicy<T = any> {
    abstract use(item: CacheItem<T>): Promise<boolean> | boolean;
}
