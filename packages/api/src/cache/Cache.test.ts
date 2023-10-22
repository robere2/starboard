import assert from "node:assert/strict"
import {afterEach, test} from "node:test";
import {Cache, CacheItem} from "./";
import {TTLCachePolicy} from "./TTLCachePolicy";

class MinimumCacheExample<T = any> extends Cache<T> {

    constructor(ttl: number) {
        super({
            policy: new TTLCachePolicy<T>(ttl)
        });
    }

    // Saving is not tested in this file
    write(): void | Promise<void> {
        return undefined;
    }

    access(): CacheItem<T> | Promise<CacheItem<T> | undefined> | undefined {
        return undefined;
    }

    delete(): void | Promise<void> {
        return undefined;
    }

    keys(): string[] | Promise<string[]> {
        return []
    }

}

let cache: Cache | undefined;
afterEach(() => {
    cache?.destroy();
    cache = undefined;
});

test('Constructs', () => {
    cache = new MinimumCacheExample(555);
    assert.equal((cache.policy as TTLCachePolicy).ttl, 555);
})

test('Does not allow 0 TTL', () => {
    assert.throws(() => cache = new MinimumCacheExample(0))
})

test('Does not allow negative TTL', () => {
    assert.throws(() => cache = new MinimumCacheExample(-1))
})
