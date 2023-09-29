import {expect, test} from "bun:test";
import {Cache} from "./Cache.ts";

class MinimumCacheExample extends Cache {

    // Saving is not tested in this file
    save(key: string, value: any): void | Promise<void> {
        return undefined;
    }

    // Retrieving is not tested in this file
    get(key: string, fn: (() => any) | undefined): Promise<any> {
        return Promise.resolve(undefined);
    }

}

test('Constructs', () => {
    expect(new MinimumCacheExample(555).ttl).toEqual(555);
})

test('Does not allow 0 TTL', () => {
    expect(() => new MinimumCacheExample(0)).toThrow()
})

test('Does not allow negative TTL', () => {
    expect(() => new MinimumCacheExample(-1)).toThrow()
})
