import {HttpClient} from "./http";
import {NonOptional} from "./util";
import * as z from "zod";
import {IDeferPolicy} from "./defer";

export type BaseResponse = z.infer<typeof BaseSchema> & Record<string, any>

export const BaseSchema = z.object({
    success: z.boolean(),
    cause: z.string().nullish(),
    throttle: z.boolean().nullish(),
    global: z.boolean().nullish()
}).passthrough()


export type APIOptions = {
    /**
     * Rate limit usage percentage at which to enable queuing requests to help ensure that your over-usage of the API
     *   doesn't get 429 rate limited. Should be a number between 0.0 and 1.0, where 0.0 means enable queueing after 0%
     *   of the rate limit has been used (i.e. all requests) and 1.0 means enable queueing after 100% (i.e. no
     *   requests). Once the queue is in use, this will use the rate limit headers found in the response from the API
     *   to determine how much time needs to pass before another request can be made to ensure that not all requests are
     *   used up before the rate limit timer resets. Requests will then be processed in the queue with the required
     *   delay between each request. This value can also be a boolean, where `true` means enable queueing at any
     *   percentage (same as providing 0.0) and `false` means disable queueing entirely (same as providing 1.0).
     */
    deferPolicy?: IDeferPolicy | null;
    /**
     * Custom HTTP client to use for HTTP requests to the Mojang API. If not provided, a default HTTP client will be
     *   used, which simply uses the {@link fetch} function. Custom HTTP clients are particularly useful for
     *   test suites where you want to mock an HTTP request. Custom clients can also be useful for adding custom logging
     *   or error handling for HTTP requests.
     */
    httpClient?: HttpClient;
}

export abstract class BaseAPI<T extends APIOptions> {
    protected readonly options: NonOptional<T>;

    protected constructor(options: T) {
        this.options = this.parseOptions(options);
    }

    protected abstract parseOptions(options: T): NonOptional<T>;

    protected genHeaders(): Headers {
        return new Headers();
    }

    protected async request<T extends typeof BaseSchema, U>(path: string, raw: boolean, schema: T, mutator?: (input: z.infer<T>) => U): Promise<BaseResponse | U> {
        const req = new Request(path, {
            headers: this.genHeaders()
        });

        let res = await this.options.httpClient!.fetch(req, undefined, true);
        if(!res) {
            if(this.options.deferPolicy) {
                await this.options.deferPolicy.poll();
            }

            res = await this.options.httpClient!.fetch(req);

            if(this.options.deferPolicy) {
                this.options.deferPolicy.notify(res);
            }
        }


        const json = BaseSchema.readonly().parse(await res.json());

        if(raw) {
            return json;
        } else if(!json.success) {
            throw new Error(`Hypixel API Error: ${json.cause}`, {
                cause: json.cause
            });
        } else {
            if(mutator) {
                try {
                    return mutator(schema.readonly().parse(json))
                } catch(e) {
                    console.log(e);
                    throw e;
                }
            } else {
                return schema.readonly().parse(json);
            }
        }
    }

    public destroy(): void {
        this.options.httpClient!.destroy();
    }

    /**
     * Parse an APIOptions input into an object with default values applied. This is a utility function that can parse
     *   all the default options found in APIOptions objects for you. Custom values found in classes that extend
     *   APIOptions can be parsed with {@link parseOptions}. If your implementation of BaseAPI does not have custom
     *   options (i.e., it uses just a APIOptions object), {@link parseOptions} can just call this function and return
     *   the returned value.
     * @param options APIOptions object with potentially undefined property values
     * @returns ParsedOptions\<APIOptions> An object with all the values found in the passed options object, with default
     *   values applied to all supported properties that are otherwise undefined. This means the returned value is
     *   guaranteed to have no more undefined configuration values.
     * @protected
     */
    protected parseDefaultOptions(options: APIOptions): NonOptional<APIOptions> {
        return Object.freeze({
            deferPolicy: options.deferPolicy ?? null,
            httpClient: options.httpClient ?? new HttpClient()
        })
    }
}
