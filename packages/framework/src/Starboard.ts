import {Service} from "./Service";
import {serve, ServeOptions} from "./serve";
import {Server} from "http";

export class Starboard extends Service {

    private server?: Server;
    private options: ServeOptions | undefined;

    constructor(options?: ServeOptions) {
        super('/');
        this.options = options;
    }

    public async start(): Promise<void> {
        if(this.server) {
            throw new Error('Server is already running')
        }

        this.server = await serve(async (req: Request): Promise<Response> => {
            const endpoint = this.allEndpoints().get(new URL(req.url).pathname)
            if(endpoint) {
                return endpoint.handle(req);
            }
            return new Response(JSON.stringify({error: 404}), {
                status: 404
            });
        }, {
            port: this.options?.port ?? 4381,
            hostname: this.options?.hostname ?? "localhost",
            allowedHosts: this.options?.allowedHosts || [this.options?.hostname ?? "localhost"],
            https: this.options?.https ?? false
        })
    }

    public isRunning(): boolean {
        return this.server !== undefined;
    }

    public getServer(): Server | undefined {
        return this.server;
    }

    public async stop(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.server?.close((err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
        this.destroy();
        this.server = undefined;
    }

    public getPort(): number {
        const addr =this.server?.address()
        if(addr && typeof addr === "object") {
            return addr.port;
        }
        throw new Error(`Unable to get port from address ${addr}`)
    }

    public getHostname(): string {
        const addr = this.server?.address();
        if(addr && typeof addr === "object") {
            return addr.address
        }
        throw new Error(`Unable to get hostname from address ${addr}`)
    }
}
