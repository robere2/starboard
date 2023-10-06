import {CachePolicy} from "./CachePolicy.ts";
import {CacheItem} from "./Cache.ts";

export class TTLCachePolicy extends CachePolicy {

    public readonly ttl: number;

    constructor(ttl: number) {
        super();
        if(ttl <= 0) {
            throw new Error('Cache TTL cannot be less than or equal to 0.');
        }
        this.ttl = ttl;
    }


    use(item: CacheItem<any>): Promise<boolean> | boolean {
        return item.created + this.ttl < Date.now();
    }
}
