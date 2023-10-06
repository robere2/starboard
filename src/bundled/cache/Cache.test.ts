import {expect, test} from "bun:test";
import {Cache, CacheItem} from "./Cache.ts";
import {TTLCachePolicy} from "./TTLCachePolicy.ts";

class MinimumCacheExample<T = any> extends Cache<T> {

    constructor(ttl: number) {
        super(new TTLCachePolicy(ttl));
    }

    // Saving is not tested in this file
    write(key: string, value: any): void | Promise<void> {
        return undefined;
    }

    access(key: string): CacheItem<T> | Promise<CacheItem<T> | undefined> | undefined {
        return undefined;
    }

}

test('Constructs', () => {
    const cache = new MinimumCacheExample(555);
    expect((cache.policy as TTLCachePolicy).ttl).toEqual(555);
})

test('Does not allow 0 TTL', () => {
    expect(() => new MinimumCacheExample(0)).toThrow()
})

test('Does not allow negative TTL', () => {
    expect(() => new MinimumCacheExample(-1)).toThrow()
})
