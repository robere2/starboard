export abstract class Cache<T = any> {

    public readonly ttl: number;

    public constructor(ttl: number) {
        if(ttl <= 0) {
            throw new Error('Cache TTL cannot be less than or equal to 0.');
        }
        this.ttl = ttl;
    }

    abstract save(key: string, value: T): void | Promise<void>;
    abstract get(key: string, fn?: (() => T | Promise<T>)): Promise<T | undefined>
}
